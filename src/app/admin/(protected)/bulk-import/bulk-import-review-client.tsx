"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileImage,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  XCircle,
  ExternalLink,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fileToBase64, pdfPageToBase64, type ExtractedJobCard } from "../jobs/new/pdf-extractor";

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
}

type ItemStatus = "pending" | "processing" | "ready" | "saving" | "saved" | "skipped" | "error";
type ErrorStage = "ocr" | "save";

interface DraftJobRow {
  job: string;
  technician: string;
}

interface DraftJobCard {
  date: string;
  order_no: string;
  customer_name: string;
  customer_phone: string;
  make: string;
  model: string;
  vin: string;
  registration: string;
  mileage: string;
  customers_concerns: string;
  additional_findings: string;
  suggestions: string;
  remarks: string;
  jobs_carried_out: DraftJobRow[];
}

interface ReviewItem {
  id: string;
  file: File;
  previewUrl: string;
  status: ItemStatus;
  draft: DraftJobCard;
  uncertainFields: string[];
  error?: string;
  errorStage?: ErrorStage;
  jobId?: string;
  jobNumber?: string;
}

const ACCEPTED_TYPES: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/heic": "image/heic",
  "image/heif": "image/heif",
  "application/pdf": "application/pdf",
};

const DEFAULT_JOB_ROWS = 3;

function createEmptyJobRow(): DraftJobRow {
  return { job: "", technician: "" };
}

function createEmptyDraft(): DraftJobCard {
  return {
    date: "",
    order_no: "",
    customer_name: "",
    customer_phone: "",
    make: "",
    model: "",
    vin: "",
    registration: "",
    mileage: "",
    customers_concerns: "",
    additional_findings: "",
    suggestions: "",
    remarks: "",
    jobs_carried_out: Array.from({ length: DEFAULT_JOB_ROWS }, createEmptyJobRow),
  };
}

function normalizeJobs(rows?: ExtractedJobCard["jobs_carried_out"]): DraftJobRow[] {
  const mapped = (rows ?? [])
    .map((row) => ({
      job: row.job ?? "",
      technician: row.technician ?? "",
    }))
    .filter((row) => row.job.trim().length > 0 || row.technician.trim().length > 0);

  return mapped.length > 0 ? mapped : [createEmptyJobRow()];
}

function mapExtractedToDraft(data: ExtractedJobCard): DraftJobCard {
  return {
    date: data.date ?? "",
    order_no: data.order_no ?? "",
    customer_name: data.customer_name ?? "",
    customer_phone: data.customer_phone ?? "",
    make: data.make ?? "",
    model: data.model ?? "",
    vin: data.vin ?? "",
    registration: data.registration ?? "",
    mileage: data.mileage ?? "",
    customers_concerns: data.customers_concerns ?? "",
    additional_findings: data.additional_findings ?? "",
    suggestions: data.suggestions ?? "",
    remarks: data.remarks ?? "",
    jobs_carried_out: normalizeJobs(data.jobs_carried_out),
  };
}

function parseMileage(value: string) {
  const cleaned = value.replace(/[^0-9]/g, "");
  return cleaned ? Number.parseInt(cleaned, 10) : null;
}

function sanitizePathName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function findNextSelectable(items: ReviewItem[], activeId: string | null) {
  const currentIndex = activeId ? items.findIndex((item) => item.id === activeId) : -1;
  const ordered = currentIndex >= 0 ? [...items.slice(currentIndex + 1), ...items.slice(0, currentIndex + 1)] : items;

  return (
    ordered.find((item) => item.status === "ready") ??
    ordered.find((item) => item.status === "error" && item.errorStage === "save") ??
    ordered.find((item) => item.status === "processing") ??
    ordered.find((item) => item.status === "error") ??
    null
  );
}

function StatusBadge({ status }: { status: ItemStatus }) {
  const classes: Record<ItemStatus, string> = {
    pending: "text-white/45 bg-white/5",
    processing: "text-cyan-300 bg-cyan-300/10",
    ready: "text-emerald-300 bg-emerald-300/10",
    saving: "text-amber-300 bg-amber-300/10",
    saved: "text-emerald-300 bg-emerald-300/10",
    skipped: "text-white/35 bg-white/5",
    error: "text-red-300 bg-red-500/10",
  };

  const labels: Record<ItemStatus, string> = {
    pending: "Queued",
    processing: "Reading",
    ready: "Review",
    saving: "Saving",
    saved: "Saved",
    skipped: "Skipped",
    error: "Error",
  };

  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes[status]}`}>{labels[status]}</span>;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">{children}</label>;
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#00C2C7]/50 focus:bg-white/7"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#00C2C7]/50 focus:bg-white/7 resize-y"
      />
    </div>
  );
}

function JobRowEditor({
  row,
  onChange,
  onRemove,
  canRemove,
}: {
  row: DraftJobRow;
  onChange: (patch: Partial<DraftJobRow>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-xl border border-white/10 bg-white/5 p-3 md:grid-cols-[1.2fr_0.8fr_auto] md:items-end">
      <TextField label="Job" value={row.job} onChange={(value) => onChange({ job: value })} placeholder="Inspection / repair detail" />
      <TextField label="Technician" value={row.technician} onChange={(value) => onChange({ technician: value })} placeholder="Name / initials" />
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="inline-flex h-[42px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-white/35 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        title="Remove row"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function BulkImportReviewClient({ staff }: { staff: StaffMember[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? null,
    [activeId, items]
  );

  const counts = useMemo(() => {
    const tally = {
      total: items.length,
      pending: 0,
      processing: 0,
      ready: 0,
      saving: 0,
      saved: 0,
      skipped: 0,
      error: 0,
    };

    for (const item of items) {
      tally[item.status] += 1;
    }

    return tally;
  }, [items]);

  const updateItem = useCallback((id: string, patch: Partial<ReviewItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const updateDraft = useCallback((id: string, patch: Partial<DraftJobCard>) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              draft: {
                ...item.draft,
                ...patch,
              },
            }
          : item
      )
    );
  }, []);

  const updateJobRow = useCallback((id: string, rowIndex: number, patch: Partial<DraftJobRow>) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const rows = [...item.draft.jobs_carried_out];
        rows[rowIndex] = { ...rows[rowIndex], ...patch };

        return {
          ...item,
          draft: {
            ...item.draft,
            jobs_carried_out: rows,
          },
        };
      })
    );
  }, []);

  const addJobRow = useCallback((id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              draft: {
                ...item.draft,
                jobs_carried_out: [...item.draft.jobs_carried_out, createEmptyJobRow()],
              },
            }
          : item
      )
    );
  }, []);

  const removeJobRow = useCallback((id: string, rowIndex: number) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const rows = [...item.draft.jobs_carried_out];
        if (rows.length <= 1) {
          rows[0] = createEmptyJobRow();
        } else {
          rows.splice(rowIndex, 1);
        }

        return {
          ...item,
          draft: {
            ...item.draft,
            jobs_carried_out: rows,
          },
        };
      })
    );
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const accepted = Array.from(files).filter((file) => ACCEPTED_TYPES[file.type] !== undefined);
    if (!accepted.length) return;

    setItems((current) => [
      ...current,
      ...accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "pending" as ItemStatus,
        draft: createEmptyDraft(),
        uncertainFields: [],
      })),
    ]);

    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }, [addFiles]);

  const processItem = useCallback(async (id: string) => {
    const current = items.find((item) => item.id === id);
    if (!current || current.status !== "pending") return;

    setProcessingId(id);
    updateItem(id, { status: "processing", error: undefined, errorStage: undefined });

    try {
      const isPdf = current.file.type === "application/pdf";
      const base64 = isPdf ? await pdfPageToBase64(current.file) : await fileToBase64(current.file);
      const mimeType = isPdf ? "image/jpeg" : current.file.type || "image/jpeg";

      const response = await fetch("/api/admin/ocr-job-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "OCR failed");
      }

      updateItem(id, {
        status: "ready",
        draft: mapExtractedToDraft(json.data as ExtractedJobCard),
        uncertainFields: Array.isArray(json.uncertainFields) ? json.uncertainFields : [],
        error: undefined,
        errorStage: undefined,
      });
    } catch (error) {
      updateItem(id, {
        status: "error",
        error: error instanceof Error ? error.message : "AI extraction failed",
        errorStage: "ocr",
      });
    } finally {
      setProcessingId((currentId) => (currentId === id ? null : currentId));
    }
  }, [items, updateItem]);

  useEffect(() => {
    if (processingId) return;
    const nextPending = items.find((item) => item.status === "pending");
    if (nextPending) {
      void processItem(nextPending.id);
    }
  }, [items, processItem, processingId]);

  useEffect(() => {
    if (!items.length) {
      setActiveId(null);
      return;
    }

    const current = activeItem;
    if (current && (current.status === "ready" || (current.status === "error" && current.errorStage === "save"))) {
      return;
    }

    const next = findNextSelectable(items, activeId);
    if (next && next.id !== activeId) {
      setActiveId(next.id);
    }
  }, [activeId, activeItem, items]);

  useEffect(() => {
    if (!activeId && items.length > 0) {
      const next = findNextSelectable(items, null);
      if (next) setActiveId(next.id);
    }
  }, [activeId, items]);

  const retryOcr = useCallback((id: string) => {
    updateItem(id, { status: "pending", error: undefined, errorStage: undefined });
  }, [updateItem]);

  const skipCurrent = useCallback(() => {
    if (!activeItem) return;
    updateItem(activeItem.id, {
      status: "skipped",
      error: undefined,
      errorStage: undefined,
    });
  }, [activeItem, updateItem]);

  const saveCurrent = useCallback(async () => {
    if (!activeItem) return;
    if (activeItem.status === "processing" || activeItem.status === "pending") return;
    if (savingId) return;

    const itemId = activeItem.id;
    const itemSnapshot = activeItem;

    setSavingId(itemId);
    updateItem(itemId, { status: "saving", error: undefined, errorStage: undefined });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const safeFileName = sanitizePathName(itemSnapshot.file.name);
      const path = `bulk/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

      const { data: uploaded, error: uploadError } = await supabase.storage
        .from("job-cards")
        .upload(path, itemSnapshot.file, {
          contentType: itemSnapshot.file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      let pdfUrl: string | null = null;
      if (uploaded) {
        const { data: signed } = await supabase.storage
          .from("job-cards")
          .createSignedUrl(uploaded.path, 60 * 60 * 24 * 365);
        pdfUrl = signed?.signedUrl ?? null;
      }

      const filledRows = itemSnapshot.draft.jobs_carried_out
        .map((row) => ({ job: row.job.trim(), technician: row.technician.trim() }))
        .filter((row) => row.job.length > 0 || row.technician.length > 0);

      const { data: saved, error } = await supabase
        .from("job_cards")
        .insert({
          status: "Draft",
          priority: "Normal",
          created_by: user?.id ?? null,
          order_no: itemSnapshot.draft.order_no.trim() || null,
          customer_name: itemSnapshot.draft.customer_name.trim() || "Unknown",
          customer_phone: itemSnapshot.draft.customer_phone.trim() || null,
          make: itemSnapshot.draft.make.trim() || null,
          model: itemSnapshot.draft.model.trim() || null,
          vin: itemSnapshot.draft.vin.trim() || null,
          registration: itemSnapshot.draft.registration.trim() || null,
          mileage_in: parseMileage(itemSnapshot.draft.mileage),
          date_in: itemSnapshot.draft.date.trim() || null,
          customers_concerns: itemSnapshot.draft.customers_concerns.trim() || null,
          additional_findings: itemSnapshot.draft.additional_findings.trim() || null,
          suggestions: itemSnapshot.draft.suggestions.trim() || null,
          remarks: itemSnapshot.draft.remarks.trim() || null,
          jobs_carried_out: filledRows.map((row) => ({
            job: row.job,
            technicians: row.technician ? [row.technician] : [],
          })),
          pdf_url: pdfUrl,
          pdf_filename: itemSnapshot.file.name,
          uncertain_fields: itemSnapshot.uncertainFields,
          job_number: "",
        })
        .select("id, job_number")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      updateItem(itemId, {
        status: "saved",
        jobId: saved.id,
        jobNumber: saved.job_number,
        error: undefined,
        errorStage: undefined,
      });
    } catch (error) {
      updateItem(itemId, {
        status: "error",
        error: error instanceof Error ? error.message : "Saving failed",
        errorStage: "save",
      });
    } finally {
      setSavingId((currentId) => (currentId === itemId ? null : currentId));
    }
  }, [activeItem, savingId, updateItem]);

  const goToPrevious = useCallback(() => {
    if (!items.length || !activeItem) return;
    const index = items.findIndex((item) => item.id === activeItem.id);
    if (index <= 0) return;
    setActiveId(items[index - 1].id);
  }, [activeItem, items]);

  const goToNext = useCallback(() => {
    if (!items.length || !activeItem) return;
    const index = items.findIndex((item) => item.id === activeItem.id);
    if (index < 0 || index >= items.length - 1) return;
    setActiveId(items[index + 1].id);
  }, [activeItem, items]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-white">Bulk Import</h1>
        <p className="text-sm text-white/40">
          Upload multiple job cards. Gemini reads each document, then you review the extracted fields before saving or skipping.
        </p>
        <p className="text-xs text-white/25">Active staff loaded: {staff.length}</p>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="group cursor-pointer rounded-2xl border-2 border-dashed border-white/10 p-8 text-center transition-colors hover:border-[#00C2C7]/40 hover:bg-[#00C2C7]/5"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf"
          className="hidden"
          onChange={(event) => event.target.files && addFiles(event.target.files)}
        />
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00C2C7]/10 transition-colors group-hover:bg-[#00C2C7]/20">
          <Upload size={22} className="text-[#00C2C7]" />
        </div>
        <p className="text-sm font-semibold text-white/60">Drop files here or click to browse</p>
        <p className="mt-1 text-xs text-white/25">JPG · PNG · WEBP · HEIC · PDF</p>
      </div>

      {items.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-white/5 bg-[#0A0A0A] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <StatChip label="Total" value={counts.total} />
              <StatChip label="Queued" value={counts.pending} tone="text-blue-300" />
              <StatChip label="Reading" value={counts.processing} tone="text-cyan-300" />
              <StatChip label="Ready" value={counts.ready} tone="text-emerald-300" />
              <StatChip label="Saved" value={counts.saved} tone="text-emerald-300" />
              <StatChip label="Skipped" value={counts.skipped} tone="text-white/45" />
              {counts.error > 0 && <StatChip label="Errors" value={counts.error} tone="text-red-300" />}
            </div>
            <div className="ml-auto text-xs text-white/30">
              AI extraction happens automatically in the background.
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {items.map((item, index) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`min-w-[220px] flex-shrink-0 rounded-2xl border px-3 py-3 text-left transition-all ${
                    isActive
                      ? "border-[#00C2C7]/60 bg-[#00C2C7]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {item.file.type === "application/pdf" ? (
                        <FileText size={16} className="text-white/30" />
                      ) : (
                        <FileImage size={16} className="text-white/30" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-white">{item.file.name}</span>
                        <span className="text-[10px] text-white/20">#{index + 1}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        {item.status === "saved" && item.jobId && (
                          <Link
                            href={`/admin/jobs/${item.jobId}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00C2C7] hover:text-white"
                          >
                            Open <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#050505]">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/25">Document Preview</p>
                  <p className="truncate text-sm text-white/55">{activeItem?.file.name ?? "No document selected"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    disabled={!activeItem}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/45 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    title="Previous document"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    disabled={!activeItem}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/45 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    title="Next document"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="flex min-h-[580px] items-center justify-center bg-black/30 p-3">
                {!activeItem ? (
                  <div className="text-sm text-white/25">Select a document to preview it here.</div>
                ) : activeItem.file.type === "application/pdf" ? (
                  <iframe
                    title={activeItem.file.name}
                    src={activeItem.previewUrl}
                    className="h-[560px] w-full rounded-xl border border-white/10 bg-white"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeItem.previewUrl}
                    alt={activeItem.file.name}
                    className="max-h-[560px] w-full rounded-xl object-contain"
                  />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#050505]">
              <div className="border-b border-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/25">Review Fields</p>
                    <p className="truncate text-sm text-white/55">
                      {activeItem ? activeItem.file.name : "Awaiting document"}
                    </p>
                  </div>
                  {activeItem && <StatusBadge status={activeItem.status} />}
                </div>
                {activeItem && activeItem.uncertainFields.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeItem.uncertainFields.map((field) => (
                      <span
                        key={field}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300"
                      >
                        <AlertTriangle size={10} /> {field}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!activeItem ? (
                <div className="px-4 py-10 text-center text-sm text-white/25">No review item selected.</div>
              ) : activeItem.status === "processing" ? (
                <div className="space-y-4 px-4 py-10 text-center">
                  <Loader2 size={28} className="mx-auto animate-spin text-[#00C2C7]" />
                  <p className="text-sm font-semibold text-white/70">Gemini is reading this document now.</p>
                  <p className="text-xs text-white/25">You can move to another file while this one finishes.</p>
                </div>
              ) : activeItem.status === "pending" ? (
                <div className="space-y-4 px-4 py-10 text-center">
                  <RefreshCw size={28} className="mx-auto animate-spin text-white/25" />
                  <p className="text-sm font-semibold text-white/70">Queued for AI processing.</p>
                  <p className="text-xs text-white/25">This item will be extracted automatically.</p>
                </div>
              ) : activeItem.status === "skipped" ? (
                <div className="space-y-4 px-4 py-10 text-center">
                  <Trash2 size={28} className="mx-auto text-white/25" />
                  <p className="text-sm font-semibold text-white/70">This document was skipped.</p>
                  <p className="text-xs text-white/25">You can still pick it from the strip if you want to re-review it.</p>
                </div>
              ) : (
                <div className="space-y-4 px-4 py-4">
                  {activeItem.status === "error" && activeItem.errorStage === "ocr" && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                      <div className="flex items-start gap-2">
                        <XCircle size={16} className="mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold">AI extraction failed</p>
                          <p className="mt-1 text-sm text-red-200/80">{activeItem.error}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => retryOcr(activeItem.id)}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15"
                      >
                        <RefreshCw size={13} /> Retry AI
                      </button>
                    </div>
                  )}

                  {activeItem.status === "error" && activeItem.errorStage === "save" && (
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold">Saving failed</p>
                          <p className="mt-1 text-sm text-amber-100/80">{activeItem.error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3 md:grid-cols-2">
                    <TextField
                      label="Date"
                      value={activeItem.draft.date}
                      onChange={(value) => updateDraft(activeItem.id, { date: value })}
                      placeholder="03-06-26"
                    />
                    <TextField
                      label="Order No"
                      value={activeItem.draft.order_no}
                      onChange={(value) => updateDraft(activeItem.id, { order_no: value })}
                      placeholder="12345"
                    />
                    <TextField
                      label="Customer Name"
                      value={activeItem.draft.customer_name}
                      onChange={(value) => updateDraft(activeItem.id, { customer_name: value })}
                      placeholder="Customer name"
                    />
                    <TextField
                      label="Customer Phone"
                      value={activeItem.draft.customer_phone}
                      onChange={(value) => updateDraft(activeItem.id, { customer_phone: value })}
                      placeholder="Phone number"
                    />
                    <TextField
                      label="Make"
                      value={activeItem.draft.make}
                      onChange={(value) => updateDraft(activeItem.id, { make: value })}
                      placeholder="BMW"
                    />
                    <TextField
                      label="Model"
                      value={activeItem.draft.model}
                      onChange={(value) => updateDraft(activeItem.id, { model: value })}
                      placeholder="G30 / F15"
                    />
                    <TextField
                      label="VIN"
                      value={activeItem.draft.vin}
                      onChange={(value) => updateDraft(activeItem.id, { vin: value })}
                      placeholder="VIN / chassis number"
                    />
                    <TextField
                      label="Registration"
                      value={activeItem.draft.registration}
                      onChange={(value) => updateDraft(activeItem.id, { registration: value })}
                      placeholder="Plate number"
                    />
                    <TextField
                      label="Mileage"
                      value={activeItem.draft.mileage}
                      onChange={(value) => updateDraft(activeItem.id, { mileage: value })}
                      placeholder="123456"
                    />
                  </div>

                  <div className="grid gap-3">
                    <TextAreaField
                      label="Customer Concerns"
                      value={activeItem.draft.customers_concerns}
                      onChange={(value) => updateDraft(activeItem.id, { customers_concerns: value })}
                      placeholder="What the customer reported"
                      rows={3}
                    />
                    <TextAreaField
                      label="Additional Findings"
                      value={activeItem.draft.additional_findings}
                      onChange={(value) => updateDraft(activeItem.id, { additional_findings: value })}
                      placeholder="Inspection notes"
                      rows={3}
                    />
                    <TextAreaField
                      label="Suggestions"
                      value={activeItem.draft.suggestions}
                      onChange={(value) => updateDraft(activeItem.id, { suggestions: value })}
                      placeholder="Suggested work"
                      rows={2}
                    />
                    <TextAreaField
                      label="Remarks"
                      value={activeItem.draft.remarks}
                      onChange={(value) => updateDraft(activeItem.id, { remarks: value })}
                      placeholder="Any remarks"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <FieldLabel>Jobs Carried Out</FieldLabel>
                      <button
                        type="button"
                        onClick={() => addJobRow(activeItem.id)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/55 transition-colors hover:text-white"
                      >
                        Add Row
                      </button>
                    </div>
                    <div className="space-y-2">
                      {activeItem.draft.jobs_carried_out.map((row, index) => (
                        <JobRowEditor
                          key={`${activeItem.id}-${index}`}
                          row={row}
                          onChange={(patch) => updateJobRow(activeItem.id, index, patch)}
                          onRemove={() => removeJobRow(activeItem.id, index)}
                          canRemove={activeItem.draft.jobs_carried_out.length > 1}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
                    <button
                      type="button"
                      onClick={skipCurrent}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20"
                    >
                      <Trash2 size={15} /> Skip
                    </button>

                    <button
                      type="button"
                      onClick={saveCurrent}
                      disabled={savingId === activeItem.id || activeItem.status === "saving"}
                      className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00C2C7] to-[#0094FF] px-4 py-2.5 text-sm font-bold text-[#0A0A0A] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingId === activeItem.id || activeItem.status === "saving" ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Check size={15} />
                      )}
                      Tick & Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-white/35">
            Use the tick button to save the edited record to Supabase. The trash button skips the document without saving it.
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center text-sm text-white/20">
          No files uploaded yet. Drop job card images or PDFs above to begin the AI review flow.
        </div>
      )}
    </div>
  );
}

function StatChip({ label, value, tone = "text-white/55" }: { label: string; value: number; tone?: string }) {
  return (
    <span className={`rounded-full bg-white/5 px-3 py-1.5 ${tone}`}>
      {value} {label}
    </span>
  );
}
