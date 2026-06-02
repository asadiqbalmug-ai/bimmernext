"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, FileCheck, X } from "lucide-react";

export interface ExtractedJobCard {
  customer_name?: string;
  customer_phone?: string;
  make?: string;
  model?: string;
  year?: string;
  vin?: string;
  registration?: string;
  mileage_in?: string;
  date_in?: string;
  customer_complaints?: string;
  work_done?: string;
  items?: Array<{ desc: string; qty: string; unit: number; amount: number }>;
  parts_total?: number;
  labour_total?: number;
  grand_total?: number;
}

function parseText(text: string): ExtractedJobCard {
  const get = (patterns: RegExp[]): string | undefined => {
    for (const re of patterns) {
      const m = text.match(re);
      if (m?.[1]) return m[1].trim().replace(/\s+/g, " ");
    }
  };

  const getNum = (patterns: RegExp[]): number | undefined => {
    const v = get(patterns);
    if (!v) return undefined;
    const n = parseFloat(v.replace(/,/g, ""));
    return isNaN(n) ? undefined : n;
  };

  const result: ExtractedJobCard = {
    customer_name: get([
      /Cust(?:omer)?[:\s]+([A-Za-z\s]+?)(?:\n|VIN|Phone|Make|$)/i,
      /Customer\s*Name[:\s]+(.+?)(?:\n|$)/i,
      /Name[:\s]+([A-Za-z][A-Za-z\s]{2,40})(?:\n|Phone|$)/i,
    ]),
    customer_phone: get([
      /(?:Phone|Tel|Mobile|Contact)[:\s]+([\d\s+\-()]{7,20})/i,
      /(\+971[\d\s\-]{8,15})/,
      /(05\d[\d\s\-]{7,12})/,
    ]),
    make: get([
      /Make[:\s]+([A-Za-z\-]+)/i,
      /Vehicle[:\s]+([A-Za-z]+)/i,
      /\b(BMW|MINI|Rolls[- ]Royce|Mercedes|Audi|Volkswagen|Toyota|Nissan)\b/i,
    ]),
    model: get([
      /Model[:\s]+([A-Za-z0-9\s\-]+?)(?:\n|VIN|Year|$)/i,
      /(?:BMW|MINI)\s+([A-Za-z0-9\s]{1,20})(?:\n|VIN|$)/i,
    ]),
    year: get([
      /Year[:\s]+(\d{4})/i,
      /\b(201\d|202\d)\b/,
    ]),
    vin: get([
      /VIN[:\s]+([A-HJ-NPR-Z0-9]{11,17})/i,
      /Chassis[:\s]+([A-HJ-NPR-Z0-9]{11,17})/i,
    ]),
    registration: get([
      /Reg(?:istration)?[:\s]+([A-Z0-9\-]+)/i,
      /Plate[:\s]+([A-Z0-9\-]+)/i,
      /\b(\d{1,3}-[A-Z]-[A-Z]{2,3})\b/,
      /\b([A-Z]{1,3}[\s\-]\d{4,6})\b/,
    ]),
    mileage_in: get([
      /Mileage[:\s]+([\d,]+)\s*km/i,
      /KM[:\s]+([\d,]+)/i,
      /Odometer[:\s]+([\d,]+)/i,
    ]),
    date_in: get([
      /Date[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/i,
      /Date[:\s]+(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/i,
    ]),
    customer_complaints: get([
      /(?:Complaints?|Customer Request|Fault|Problem|Issue)[:\s]+([\s\S]{10,300}?)(?:\n\n|\nDiag|\nWork|$)/i,
      /(?:Remarks?|Notes?)[:\s]+([\s\S]{10,200}?)(?:\n\n|$)/i,
    ]),
    work_done: get([
      /(?:Work Done|Services?|Description of (?:Work|Goods)|Diagnosis)[:\s]+([\s\S]{10,500}?)(?:\n\n|Parts|Labour|Total|$)/i,
    ]),
  };

  // Try to extract line items — look for rows: description | qty | unit | amount
  const itemLines: ExtractedJobCard["items"] = [];
  const lineRe = /^(.{3,60}?)\s{2,}(\d+[Ll]?)\s{2,}([\d,.]+)\s{2,}([\d,.]+)\s*$/gm;
  let m;
  while ((m = lineRe.exec(text)) !== null) {
    const amount = parseFloat(m[4].replace(/,/g, ""));
    if (isNaN(amount) || amount < 1) continue;
    itemLines.push({
      desc: m[1].trim(),
      qty: m[2],
      unit: parseFloat(m[3].replace(/,/g, "")) || amount,
      amount,
    });
  }
  if (itemLines.length > 0) result.items = itemLines;

  // Totals
  result.parts_total = getNum([/Parts[:\s]+([\d,]+)/i]);
  result.labour_total = getNum([/Labour[:\s]+([\d,]+)/i]);
  result.grand_total = getNum([
    /Grand\s*Total[:\s]+([\d,]+)/i,
    /Total[:\s]+([\d,]+)\s*AED/i,
    /Amount\s*Due[:\s]+([\d,]+)/i,
  ]);

  // Clean undefined values
  Object.keys(result).forEach((k) => {
    if ((result as Record<string, unknown>)[k] === undefined) delete (result as Record<string, unknown>)[k];
  });

  return result;
}

export default function PdfExtractor({
  onExtracted,
  onFileSelected,
}: {
  onExtracted: (data: ExtractedJobCard, file: File) => void;
  onFileSelected?: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.includes("pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    setError(null);
    setLoading(true);
    onFileSelected?.(file);

    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const lines = content.items
          .map((item: unknown) => (item as { str: string }).str)
          .join(" ");
        fullText += lines + "\n";
      }

      const extracted = parseText(fullText);
      onExtracted(extracted, file);
    } catch (err) {
      setError("Could not parse PDF. Fill in manually.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!fileName ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-white/10 rounded-2xl py-8 flex flex-col items-center gap-3 hover:border-[#00C2C7]/40 hover:bg-[#00C2C7]/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#00C2C7]/10 flex items-center justify-center group-hover:bg-[#00C2C7]/20 transition-colors">
            <Upload size={22} className="text-[#00C2C7]" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Upload Job Card PDF</p>
            <p className="text-white/30 text-xs mt-0.5">Fields will be auto-filled from the document</p>
          </div>
        </button>
      ) : (
        <div className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border ${loading ? "border-white/10 bg-white/5" : error ? "border-red-500/30 bg-red-500/10" : "border-green-500/30 bg-green-500/10"}`}>
          <div className="flex items-center gap-3 min-w-0">
            {loading ? (
              <Loader2 size={18} className="text-[#00C2C7] animate-spin shrink-0" />
            ) : error ? (
              <X size={18} className="text-red-400 shrink-0" />
            ) : (
              <FileCheck size={18} className="text-green-400 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{fileName}</p>
              <p className="text-xs text-white/40">
                {loading ? "Extracting text…" : error || "Fields filled — review below"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setFileName(null); setError(null); inputRef.current && (inputRef.current.value = ""); }}
            className="text-white/30 hover:text-white/60 shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
