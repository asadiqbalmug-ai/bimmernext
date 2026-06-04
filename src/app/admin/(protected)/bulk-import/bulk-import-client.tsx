"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Upload, Loader2, CheckCircle2, XCircle, AlertTriangle, FileImage, ExternalLink } from "lucide-react";
import { fileToBase64, pdfPageToBase64 } from "../jobs/new/pdf-extractor";

interface StaffMember { id: string; full_name: string; role: string }

type FileStatus = "pending" | "processing" | "saved" | "error";

interface QueueItem {
  id: string;
  file: File;
  status: FileStatus;
  jobId?: string;
  jobNumber?: string;
  uncertainCount?: number;
  error?: string;
}

const CONCURRENCY = 1; // process one at a time to avoid Gemini rate limits
const MIME_TYPES: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/heic": "image/heic",
  "image/heif": "image/heif",
  "application/pdf": "image/jpeg",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BulkImportClient({ staff: _staff }: { staff: StaffMember[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [running, setRunning] = useState(false);

  const update = useCallback((id: string, patch: Partial<QueueItem>) =>
    setQueue((q) => q.map((i) => i.id === id ? { ...i, ...patch } : i)), []);

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => MIME_TYPES[f.type] !== undefined);
    setQueue((q) => [
      ...q,
      ...arr.map((f) => ({ id: crypto.randomUUID(), file: f, status: "pending" as FileStatus })),
    ]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const processItem = useCallback(async (item: QueueItem) => {
    update(item.id, { status: "processing" });
    try {
      const supabase = createClient();

      // 1. Convert to base64
      const isPdf = item.file.type === "application/pdf";
      const base64 = isPdf ? await pdfPageToBase64(item.file) : await fileToBase64(item.file);
      const mimeType = isPdf ? "image/jpeg" : item.file.type;

      // 2. OCR
      const ocrRes = await fetch("/api/admin/ocr-job-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      if (!ocrRes.ok) throw new Error((await ocrRes.json()).error || "OCR failed");
      const { data: extracted, uncertainFields } = await ocrRes.json();

      // 3. Upload original file to Supabase Storage
      const path = `bulk/${Date.now()}-${item.file.name}`;
      let pdfUrl: string | null = null;
      const { data: uploaded } = await supabase.storage
        .from("job-cards")
        .upload(path, item.file, { contentType: item.file.type, upsert: false });
      if (uploaded) {
        const { data: signed } = await supabase.storage
          .from("job-cards")
          .createSignedUrl(uploaded.path, 60 * 60 * 24 * 365);
        pdfUrl = signed?.signedUrl ?? null;
      }
      // 4. Save to DB as Draft
      const filledRows = (extracted.jobs_carried_out ?? []).filter((r: { job: string }) => r.job?.trim());
      const { data: saved, error } = await supabase
        .from("job_cards")
        .insert({
          status: "Draft",
          priority: "Normal",
          order_no: extracted.order_no || null,
          customer_name: extracted.customer_name || "Unknown",
          customer_phone: extracted.customer_phone || null,
          make: extracted.make || null,
          model: extracted.model || null,
          vin: extracted.vin || null,
          registration: extracted.registration || null,
          mileage_in: extracted.mileage ? parseInt(String(extracted.mileage).replace(/[^0-9]/g, "")) || null : null,
          date_in: extracted.date || null,
          customers_concerns: extracted.customers_concerns || null,
          additional_findings: extracted.additional_findings || null,
          suggestions: extracted.suggestions || null,
          remarks: extracted.remarks || null,
          jobs_carried_out: filledRows.map((r: { job: string; technician?: string }) => ({
            job: r.job,
            technicians: r.technician ? [r.technician] : [],
          })),
          pdf_url: pdfUrl,
          pdf_filename: item.file.name,
          uncertain_fields: Array.isArray(uncertainFields) ? uncertainFields : [],
          job_number: "",
        })
        .select("id, job_number")
        .single();

      if (error) throw new Error(error.message);

      update(item.id, {
        status: "saved",
        jobId: saved.id,
        jobNumber: saved.job_number,
        uncertainCount: (uncertainFields ?? []).length,
      });
    } catch (err) {
      update(item.id, { status: "error", error: String(err instanceof Error ? err.message : err) });
    }
  }, [update]);

  const runQueue = useCallback(async (items: QueueItem[]) => {
    setRunning(true);
    const pending = items.filter((i) => i.status === "pending");

    for (let i = 0; i < pending.length; i += CONCURRENCY) {
      const batch = pending.slice(i, i + CONCURRENCY);
      await Promise.all(batch.map(processItem));
    }
    setRunning(false);
  }, [processItem]);

  const startImport = () => {
    const pending = queue.filter((i) => i.status === "pending");
    if (!pending.length) return;
    runQueue(pending);
  };

  const retryErrors = () => {
    const errors = queue.filter((i) => i.status === "error");
    if (!errors.length) return;
    setQueue((q) => q.map((i) => i.status === "error" ? { ...i, status: "pending", error: undefined } : i));
    runQueue(errors.map((i) => ({ ...i, status: "pending" })));
  };

  const clearDone = () => setQueue((q) => q.filter((i) => i.status !== "saved"));

  const counts = {
    total: queue.length,
    pending: queue.filter((i) => i.status === "pending").length,
    processing: queue.filter((i) => i.status === "processing").length,
    saved: queue.filter((i) => i.status === "saved").length,
    error: queue.filter((i) => i.status === "error").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Bulk Import</h1>
        <p className="text-white/40 text-sm mt-1">
          Drop job card photos or PDFs — AI reads each one and saves as Draft for your review.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-white/10 hover:border-[#00C2C7]/40 rounded-2xl p-10 text-center cursor-pointer transition-colors group"
      >
        <Upload size={32} className="mx-auto text-white/20 group-hover:text-[#00C2C7]/60 transition-colors mb-3" />
        <p className="text-white/50 text-sm font-semibold">Drop files here or click to browse</p>
        <p className="text-white/25 text-xs mt-1">JPG · PNG · WEBP · HEIC · PDF — up to 500 files</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* Stats + Actions */}
      {queue.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-3 flex-1 flex-wrap text-xs font-semibold">
            <Chip label="Total"      value={counts.total}      color="text-white/50" />
            <Chip label="Pending"    value={counts.pending}    color="text-blue-300" />
            <Chip label="Saved"      value={counts.saved}      color="text-green-300" />
            {counts.error > 0 && <Chip label="Errors" value={counts.error} color="text-red-300" />}
          </div>

          <div className="flex gap-2">
            {counts.error > 0 && !running && (
              <button
                onClick={retryErrors}
                className="px-3 py-2 text-xs font-semibold bg-red-500/10 text-red-300 hover:bg-red-500/20 rounded-xl transition-colors"
              >
                Retry Errors
              </button>
            )}
            {counts.saved > 0 && (
              <button
                onClick={clearDone}
                className="px-3 py-2 text-xs font-semibold bg-white/5 text-white/40 hover:text-white rounded-xl transition-colors"
              >
                Clear Done
              </button>
            )}
            <button
              onClick={startImport}
              disabled={running || counts.pending === 0}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-[#00C2C7] text-[#0A0A0A] rounded-xl hover:bg-[#0094FF] hover:text-white transition-all disabled:opacity-40"
            >
              {running ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {running ? `Processing…` : `Import ${counts.pending}`}
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {running && counts.total > 0 && (
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00C2C7] transition-all duration-300"
            style={{ width: `${Math.round(((counts.saved + counts.error) / counts.total) * 100)}%` }}
          />
        </div>
      )}

      {/* Queue list */}
      {queue.length > 0 && (
        <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
            <p className="text-xs font-bold tracking-widest text-white/30 uppercase">Queue</p>
            {!running && counts.pending === 0 && counts.saved > 0 && (
              <p className="text-xs text-green-400 font-semibold">✓ All done</p>
            )}
          </div>
          <ul className="divide-y divide-white/[0.04] max-h-[60vh] overflow-y-auto">
            {queue.map((item) => (
              <li key={item.id} className="px-5 py-3 flex items-center gap-3">
                {/* Icon */}
                <div className="shrink-0">
                  {item.status === "pending"    && <FileImage size={16} className="text-white/20" />}
                  {item.status === "processing" && <Loader2 size={16} className="text-[#00C2C7] animate-spin" />}
                  {item.status === "saved"      && <CheckCircle2 size={16} className="text-green-400" />}
                  {item.status === "error"      && <XCircle size={16} className="text-red-400" />}
                </div>

                {/* Filename */}
                <p className="flex-1 text-sm text-white/60 truncate min-w-0">{item.file.name}</p>

                {/* Uncertainty badge */}
                {item.status === "saved" && (item.uncertainCount ?? 0) > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full shrink-0">
                    <AlertTriangle size={9} /> {item.uncertainCount} flag{item.uncertainCount !== 1 ? "s" : ""}
                  </span>
                )}

                {/* Error message */}
                {item.status === "error" && (
                  <span className="text-xs text-red-400/60 truncate max-w-xs shrink-0">{item.error}</span>
                )}

                {/* Link to review */}
                {item.jobId && (
                  <Link
                    href={`/admin/jobs/${item.jobId}`}
                    className="shrink-0 flex items-center gap-1 text-xs text-[#00C2C7] hover:text-white font-semibold transition-colors"
                  >
                    Review <ExternalLink size={11} />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {queue.length === 0 && (
        <div className="text-center py-16 text-white/20 text-sm">
          No files added yet. Drop some job card photos above to get started.
        </div>
      )}
    </div>
  );
}

function Chip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className={`bg-white/5 px-3 py-1.5 rounded-lg ${color}`}>
      {value} {label}
    </span>
  );
}
