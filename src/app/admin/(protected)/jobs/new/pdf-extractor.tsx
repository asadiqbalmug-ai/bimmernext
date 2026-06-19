"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, FileCheck, X, Sparkles, ImageIcon, Download } from "lucide-react";

export interface ExtractedJobCard {
  date?: string;
  order_no?: string;
  customer_name?: string;
  customer_phone?: string;
  make?: string;
  model?: string;
  vin?: string;
  registration?: string;
  mileage?: string;
  customers_concerns?: string;
  additional_findings?: string;
  suggestions?: string;
  jobs_carried_out?: Array<{ job: string; technician: string }>;
  remarks?: string;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function sanitizePathName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

export function getVinStorageStem(vin: string | null | undefined) {
  const cleaned = (vin ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!cleaned) return "";
  return cleaned.length > 6 ? cleaned.slice(-6) : cleaned;
}

export function getStorageNameParts(vin: string | null | undefined, originalName: string) {
  const stem = getVinStorageStem(vin);
  const safeOriginal = sanitizePathName(originalName);
  const extMatch = safeOriginal.match(/(\.[^.]+)$/);

  return {
    stem: stem || sanitizePathName(safeOriginal.replace(/\.[^.]+$/, "")) || "job-card",
    ext: extMatch?.[1] || ".pdf",
  };
}

export function buildStorageFilename(stem: string, ext: string, duplicateIndex = 0) {
  return duplicateIndex > 0 ? `${stem} (${duplicateIndex})${ext}` : `${stem}${ext}`;
}

export function getNextDuplicateIndex(existingNames: string[], stem: string, ext: string) {
  let highest = -1;
  const escapedStem = stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedExt = ext.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escapedStem}(?: \\((\\d+)\\))?${escapedExt}$`, "i");

  for (const name of existingNames) {
    const match = name.match(pattern);
    if (!match) continue;
    const index = match[1] ? Number.parseInt(match[1], 10) : 0;
    if (Number.isFinite(index)) {
      highest = Math.max(highest, index);
    }
  }

  return highest + 1;
}

type OcrResult = {
  data: ExtractedJobCard;
  uncertainFields: string[];
};

function getPdfWorkerSrc() {
  return new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
}

function mergeExtractedJobCards(base: ExtractedJobCard, next: ExtractedJobCard): ExtractedJobCard {
  const merged: ExtractedJobCard = { ...base };

  const scalarKeys: Array<Exclude<keyof ExtractedJobCard, "jobs_carried_out">> = [
    "date",
    "order_no",
    "customer_name",
    "customer_phone",
    "make",
    "model",
    "vin",
    "registration",
    "mileage",
    "customers_concerns",
    "additional_findings",
    "suggestions",
    "remarks",
  ];

  for (const key of scalarKeys) {
    const incoming = next[key];
    const current = merged[key];
    if (typeof incoming === "string" && incoming.trim() && (!current || !String(current).trim())) {
      merged[key] = incoming.trim();
    }
  }

  const existingJobs = merged.jobs_carried_out ?? [];
  const incomingJobs = next.jobs_carried_out ?? [];
  const seen = new Set(
    existingJobs.map((row) => `${row.job.trim().toLowerCase()}|${row.technician.trim().toLowerCase()}`)
  );

  const jobs = [...existingJobs];
  for (const row of incomingJobs) {
    const job = row.job?.trim() ?? "";
    const technician = row.technician?.trim() ?? "";
    if (!job && !technician) continue;

    const key = `${job.toLowerCase()}|${technician.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    jobs.push({ job, technician });
  }

  if (jobs.length > 0) {
    merged.jobs_carried_out = jobs;
  }

  return merged;
}

async function renderPdfPageToBase64(pdf: any, pageNumber: number): Promise<string> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2.5 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to render PDF page preview");
  }

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  const result = canvas.toDataURL("image/jpeg", 0.92).split(",")[1];
  page.cleanup?.();
  return result;
}

async function ocrImageBase64(imageBase64: string, mimeType: string): Promise<OcrResult> {
  const res = await fetch("/api/admin/ocr-job-card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "AI extraction failed");
  }

  return {
    data: json.data as ExtractedJobCard,
    uncertainFields: Array.isArray(json.uncertainFields) ? json.uncertainFields : [],
  };
}

export async function pdfPageToBase64(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = getPdfWorkerSrc();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const firstPage = await renderPdfPageToBase64(pdf, 1);
  pdf.cleanup?.();
  return firstPage;
}

export async function pdfPagesToBase64(file: File): Promise<string[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = getPdfWorkerSrc();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  try {
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      pages.push(await renderPdfPageToBase64(pdf, pageNumber));
    }
    return pages;
  } finally {
    pdf.cleanup?.();
  }
}

export async function extractJobCardFromFile(file: File): Promise<OcrResult> {
  if (file.type === "application/pdf") {
    const pages = await pdfPagesToBase64(file);
    if (!pages.length) {
      throw new Error("No PDF pages found");
    }

    let mergedData: ExtractedJobCard = {};
    const uncertain = new Set<string>();

    for (const pageBase64 of pages) {
      const result = await ocrImageBase64(pageBase64, "image/jpeg");
      mergedData = mergeExtractedJobCards(mergedData, result.data);
      result.uncertainFields.forEach((field) => uncertain.add(field));
    }

    return { data: mergedData, uncertainFields: Array.from(uncertain) };
  }

  const base64 = await fileToBase64(file);
  return ocrImageBase64(base64, file.type || "image/jpeg");
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"];
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif";

export default function JobCardUploader({
  onExtracted,
  onFileSelected,
}: {
  onExtracted: (data: ExtractedJobCard, file: File, uncertainFields?: string[]) => void;
  onFileSelected?: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const handleFile = async (f: File) => {
    if (!IMAGE_TYPES.includes(f.type) && !f.name.endsWith(".heic") && !f.name.endsWith(".heif")) {
      setMessage({ type: "error", text: "Upload a PDF or image (JPG, PNG, HEIC)" });
      return;
    }
    setFile(f);
    setMessage(null);
    onFileSelected?.(f);
    const objUrl = URL.createObjectURL(f);
    setDownloadUrl(objUrl);

    if (f.type.startsWith("image/")) {
      setPreviewUrl(objUrl);
    } else if (f.type === "application/pdf") {
      // Render first page to canvas for preview
      pdfPageToBase64(f)
        .then((b64) => setPreviewUrl(`data:image/jpeg;base64,${b64}`))
        .catch(() => setPreviewUrl(null));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAIExtract = async () => {
    if (!file) return;
    setOcrLoading(true);
    setMessage({ type: "info", text: "Sending to AI — reading handwriting…" });

    try {
      const json = await extractJobCardFromFile(file);
      onExtracted(json.data, file, json.uncertainFields ?? []);
      const uc = (json.uncertainFields ?? []).length;
      setMessage({ type: "success", text: uc > 0 ? `Fields extracted — ${uc} field${uc > 1 ? "s" : ""} flagged ⚠️ for review` : "Fields extracted — review and confirm below" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "AI extraction failed. Fill in manually." });
    } finally {
      setOcrLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setDownloadUrl(null);
    setMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (!file) {
    return (
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-white/10 rounded-2xl py-10 flex flex-col items-center gap-3 hover:border-[#00C2C7]/40 hover:bg-[#00C2C7]/5 transition-all group cursor-pointer"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="w-12 h-12 rounded-2xl bg-[#00C2C7]/10 flex items-center justify-center group-hover:bg-[#00C2C7]/20 transition-colors">
          <Upload size={22} className="text-[#00C2C7]" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">Upload Job Card</p>
          <p className="text-white/30 text-xs mt-1">
            Photo (JPG/PNG/HEIC) or scanned PDF<br />
            AI will read the handwriting and fill the fields
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* File info row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          {file.type.startsWith("image/") ? (
            <ImageIcon size={18} className="text-[#00C2C7] shrink-0" />
          ) : (
            <FileCheck size={18} className="text-[#00C2C7] shrink-0" />
          )}
          <p className="text-white text-sm font-semibold truncate">{file.name}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={file.name}
              className="p-1.5 rounded-lg text-white/30 hover:text-[#00C2C7] hover:bg-[#00C2C7]/10 transition-colors"
              title="Download original file"
            >
              <Download size={15} />
            </a>
          )}
          <button type="button" onClick={reset} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Image preview */}
      {previewUrl && (
        <div className="rounded-xl overflow-hidden border border-white/10 max-h-72 flex items-center justify-center bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Job card preview" className="max-h-72 w-auto object-contain" />
        </div>
      )}

      {/* AI Extract button */}
      <button
        type="button"
        onClick={handleAIExtract}
        disabled={ocrLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00C2C7] to-[#0094FF] text-[#0A0A0A] font-bold py-3 rounded-xl text-sm tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50"
      >
        {ocrLoading ? (
          <><Loader2 size={16} className="animate-spin" /> Reading handwriting…</>
        ) : (
          <><Sparkles size={16} /> Extract with AI</>
        )}
      </button>

      {message && (
        <p className={`text-xs font-semibold px-1 ${
          message.type === "success" ? "text-green-400" :
          message.type === "error" ? "text-red-400" :
          "text-[#00C2C7]"
        }`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
