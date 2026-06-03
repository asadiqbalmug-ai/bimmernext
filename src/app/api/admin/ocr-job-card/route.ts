import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const PROMPT = `You are reading a BimmerNext Auto Maintenance job card (handwritten or printed).
Extract all visible information and return ONLY a valid JSON object with exactly these fields:
{
  "date": "string — date from card e.g. 06-01-26",
  "order_no": "string — Order No field if visible",
  "make": "string — car make e.g. BMW, Mini",
  "model": "string — car model code e.g. E71, F15, F56",
  "vin": "string — VIN or chassis number",
  "registration": "string — registration/plate number",
  "customer_name": "string — customer name",
  "customer_phone": "string — phone number if visible",
  "mileage": "string — mileage reading",
  "customers_concerns": "string — everything written in Customer's Concerns section",
  "additional_findings": "string — everything written in Additional Findings section",
  "suggestions": "string — suggestions line if any",
  "jobs_carried_out": [{"job": "string", "technician": "string"}],
  "remarks": "string — remarks line if any"
}
For jobs_carried_out: read ALL rows from BOTH left and right columns of the Jobs Carried Out table.
If a field is blank or unreadable, use empty string "".
Return ONLY the JSON object — no markdown fences, no explanation.`;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    return NextResponse.json(
      { error: "No AI key configured. Add GEMINI_API_KEY (free) or OPENAI_API_KEY to Vercel env vars." },
      { status: 500 }
    );
  }

  const { imageBase64, mimeType } = await req.json();
  if (!imageBase64) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  let raw: string;

  if (geminiKey) {
    // ── Google Gemini 1.5 Flash (free tier: 1500 req/day) ──
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
        generationConfig: { temperature: 0.1, maxOutputTokens: 1500 },
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.error?.message || "Gemini request failed" }, { status: 500 });
    }
    const data = await res.json();
    raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  } else {
    // ── OpenAI fallback ──
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`, detail: "high" } },
              { type: "text", text: PROMPT },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.error?.message || "OpenAI request failed" }, { status: 500 });
    }
    const data = await res.json();
    raw = data.choices?.[0]?.message?.content || "{}";
  }

  try {
    const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return NextResponse.json({ data: JSON.parse(cleaned) });
  } catch {
    return NextResponse.json({ error: "Could not parse AI response", raw }, { status: 500 });
  }
}
