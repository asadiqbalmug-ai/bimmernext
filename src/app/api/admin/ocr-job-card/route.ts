import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const PROMPT = `You are reading a BimmerNext Auto Maintenance job card (handwritten or printed, possibly photographed at an angle or in low light).

Extract every visible field and return ONLY a valid JSON object with exactly these keys:
{
  "date": "date on the card e.g. 03-06-26",
  "order_no": "Order No / job number if printed",
  "make": "car make e.g. BMW, Mini, Rolls-Royce",
  "model": "model code e.g. E71, F15, G30, F56",
  "vin": "full VIN / chassis number",
  "registration": "plate number e.g. 14106-P-DXB",
  "customer_name": "customer full name",
  "customer_phone": "phone number if present",
  "mileage": "odometer reading as written",
  "customers_concerns": "full text of Customer Concerns section",
  "additional_findings": "full text of Additional Findings section",
  "suggestions": "suggestions line",
  "jobs_carried_out": [{"job": "description", "technician": "name or initials"}],
  "remarks": "remarks line",
  "_uncertain": ["list", "of", "field", "names", "you", "were", "unsure", "about"]
}

Rules:
- For jobs_carried_out read ALL rows from BOTH left and right columns.
- "_uncertain" must contain the key names of any field where the handwriting was illegible, faint, crossed-out, ambiguous, or you had to guess. E.g. ["vin","mileage"].
- If a field is completely blank, use "".
- Return ONLY the JSON — no markdown, no commentary.`;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured. Add it to Vercel → Settings → Environment Variables." },
      { status: 500 }
    );
  }

  const { imageBase64, mimeType } = await req.json();
  if (!imageBase64) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mimeType || "image/jpeg", data: imageBase64 } },
          { text: PROMPT },
        ],
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2000 },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.error?.message || "Gemini request failed", detail: err }, { status: 500 });
  }

  const data = await res.json();

  // Gemini sometimes returns blocked content
  if (data.candidates?.[0]?.finishReason === "SAFETY") {
    return NextResponse.json({ error: "Gemini blocked the response (safety filter). Try a clearer image." }, { status: 422 });
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    const uncertain: string[] = Array.isArray(parsed._uncertain) ? parsed._uncertain : [];
    delete parsed._uncertain;
    return NextResponse.json({ data: parsed, uncertainFields: uncertain });
  } catch {
    return NextResponse.json({ error: "Could not parse Gemini response", raw }, { status: 500 });
  }
}
