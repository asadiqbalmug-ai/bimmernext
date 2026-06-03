"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, FileCheck, X, Sparkles, ImageIcon } from "lucide-react";

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

async function fileToBase64(file: File): Promise<string> {
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

async function pdfPageToBase64(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.5 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return canvas.toDataURL("image/jpeg", 0.92).split(",")[1];
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"];
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif";

export default function JobCardUploader({
  onExtracted,
  onFileSelected,
}: {
  onExtracted: (data: ExtractedJobCard, file: File) => void;
  onFileSelected?: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

    if (f.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAIExtract = async () => {
    if (!file) return;
    setOcrLoading(true);
    setMessage({ type: "info", text: "Sending to AI — reading handwriting…" });

    try {
      let base64: string;
      let mimeType: string;

      if (file.type === "application/pdf") {
        base64 = await pdfPageToBase64(file);
        mimeType = "image/jpeg";
      } else {
        base64 = await fileToBase64(file);
        mimeType = file.type || "image/jpeg";
      }

      const res = await fetch("/api/admin/ocr-job-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const json = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: json.error || "AI extraction failed" });
        setOcrLoading(false);
        return;
      }

      onExtracted(json.data, file);
      setMessage({ type: "success", text: "AI extracted fields — review and edit below" });
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
        <button type="button" onClick={reset} className="text-white/30 hover:text-white/60 shrink-0">
          <X size={16} />
        </button>
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
