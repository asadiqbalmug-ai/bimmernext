import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are reading a BimmerNext Auto Maintenance job card (may be handwritten or printed).
Extract all visible information and return ONLY a valid JSON object with exactly these fields:
{
  "date": "string — date from card e.g. 06-01-26",
  "order_no": "string — Order No field if visible",
  "make": "string — car make e.g. BMW, Mini",
  "model": "string — car model code e.g. E71, F15, F56",
  "vin": "string — VIN or chassis number",
  "registration": "string — registration/plate number",
  "customer_name": "string — customer name",
  "mileage": "string — mileage reading",
  "customers_concerns": "string — everything written in Customer's Concerns section",
  "additional_findings": "string — everything written in Additional Findings section",
  "suggestions": "string — suggestions line if any",
  "jobs_carried_out": [{"job": "string", "technician": "string"}],
  "remarks": "string — remarks line if any"
}
For jobs_carried_out: read ALL rows from BOTH left and right columns of the Jobs Carried Out table.
If a field is blank or unreadable, use empty string "".
Return only the JSON object, no markdown, no explanation.`;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured. Add it to your Vercel environment variables." }, { status: 500 });
  }

  const { imageBase64, mimeType } = await req.json();
  if (!imageBase64) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`, detail: "high" },
            },
            { type: "text", text: "Extract all job card fields from this image." },
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
  const raw = data.choices?.[0]?.message?.content || "{}";

  try {
    const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json({ data: parsed });
  } catch {
    return NextResponse.json({ error: "Could not parse AI response", raw }, { status: 500 });
  }
}
