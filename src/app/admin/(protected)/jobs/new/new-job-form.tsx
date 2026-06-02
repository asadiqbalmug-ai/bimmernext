"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Save, Loader2, ChevronDown } from "lucide-react";
import JobCardUploader, { type ExtractedJobCard } from "./pdf-extractor";

interface JobRow { id: string; job: string; technician: string }
interface StaffMember { id: string; full_name: string; role: string }

const STATUS_OPTIONS = ["Open","In Progress","Waiting Parts","Ready","Completed","Cancelled"];
const PRIORITY_OPTIONS = ["Low","Normal","High","Urgent"];

const newJobRow = (): JobRow => ({ id: crypto.randomUUID(), job: "", technician: "" });
const INITIAL_ROWS = 8;

export default function NewJobForm({ staff }: { staff: StaffMember[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Job header fields
  const [date, setDate]             = useState(new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"));
  const [orderNo, setOrderNo]       = useState("");
  const [make, setMake]             = useState("");
  const [model, setModel]           = useState("");
  const [vin, setVin]               = useState("");
  const [registration, setReg]      = useState("");
  const [customerName, setCN]       = useState("");
  const [customerPhone, setCP]      = useState("");
  const [mileage, setMileage]       = useState("");

  // Job detail fields
  const [concerns, setConcerns]     = useState("");
  const [findings, setFindings]     = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [remarks, setRemarks]       = useState("");
  const [internalNotes, setNotes]   = useState("");

  // Status / assignment
  const [status, setStatus]         = useState("Open");
  const [priority, setPriority]     = useState("Normal");
  const [assignedTo, setAT]         = useState("");

  // Jobs Carried Out rows
  const [jobRows, setJobRows]       = useState<JobRow[]>(
    Array.from({ length: INITIAL_ROWS }, newJobRow)
  );

  const updateRow = (id: string, key: keyof JobRow, val: string) =>
    setJobRows((p) => p.map((r) => r.id === id ? { ...r, [key]: val } : r));

  const handleExtracted = (data: ExtractedJobCard, file: File) => {
    setUploadedFile(file);
    if (data.date)                setDate(data.date);
    if (data.order_no)            setOrderNo(data.order_no);
    if (data.customer_name)       setCN(data.customer_name);
    if (data.customer_phone)      setCP(data.customer_phone);
    if (data.make)                setMake(data.make);
    if (data.model)               setModel(data.model);
    if (data.vin)                 setVin(data.vin);
    if (data.registration)        setReg(data.registration);
    if (data.mileage)             setMileage(data.mileage);
    if (data.customers_concerns)  setConcerns(data.customers_concerns);
    if (data.additional_findings) setFindings(data.additional_findings);
    if (data.suggestions)         setSuggestions(data.suggestions);
    if (data.remarks)             setRemarks(data.remarks);
    if (data.jobs_carried_out?.length) {
      const rows = data.jobs_carried_out.map((r) => ({ id: crypto.randomUUID(), job: r.job, technician: r.technician }));
      // Pad to at least INITIAL_ROWS
      while (rows.length < INITIAL_ROWS) rows.push(newJobRow());
      setJobRows(rows);
    }
  };

  const handleSave = async () => {
    if (!customerName.trim()) { alert("Customer name is required."); return; }
    setSaving(true);
    const supabase = createClient();

    let pdfUrl: string | null = null;
    let pdfFilename: string | null = null;
    if (uploadedFile) {
      const ext = uploadedFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { data: up } = await supabase.storage.from("job-cards").upload(path, uploadedFile);
      if (up) { pdfUrl = up.path; pdfFilename = uploadedFile.name; }
    }

    const selectedStaff = staff.find((s) => s.id === assignedTo);
    const filledRows = jobRows.filter((r) => r.job.trim());

    const { data, error } = await supabase.from("job_cards").insert({
      job_number: "",
      status, priority,
      order_no: orderNo || null,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim() || null,
      make: make.trim() || null,
      model: model.trim() || null,
      vin: vin.trim() || null,
      registration: registration.trim() || null,
      mileage_in: mileage ? parseInt(mileage.replace(/[^0-9]/g, "")) || null : null,
      date_in: date || null,
      customers_concerns: concerns.trim() || null,
      additional_findings: findings.trim() || null,
      suggestions: suggestions.trim() || null,
      remarks: remarks.trim() || null,
      jobs_carried_out: filledRows.map((r) => ({ job: r.job, technician: r.technician })),
      internal_notes: internalNotes.trim() || null,
      assigned_to: assignedTo || null,
      assigned_name: selectedStaff?.full_name || null,
      pdf_url: pdfUrl,
      pdf_filename: pdfFilename,
    }).select("id").single();

    setSaving(false);
    if (error) { alert("Error: " + error.message); return; }
    router.push(`/admin/jobs/${data.id}`);
  };

  return (
    <div className="space-y-5">
      {/* Upload section */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">
          Upload Job Card <span className="text-white/20 font-normal normal-case tracking-normal">— photo or scanned PDF, AI reads the handwriting</span>
        </h2>
        <JobCardUploader onExtracted={handleExtracted} onFileSelected={setUploadedFile} />
      </div>

      {/* ── Digital Job Card (mirrors physical layout) ── */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <div>
            <p className="text-xs text-white/30 font-semibold tracking-widest uppercase">BimmerNext Auto Maintenance</p>
          </div>
          <p className="text-white font-bold text-sm tracking-widest">JOB CARD</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Row 1: Date | Make | VIN | Customer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <F label="Date" value={date} onChange={setDate} type="date" />
            <F label="Make" value={make} onChange={setMake} placeholder="BMW" />
            <F label="VIN" value={vin} onChange={setVin} placeholder="L953348" />
            <F label="Customer" value={customerName} onChange={setCN} placeholder="Rajesh *" required />
          </div>

          {/* Row 2: Order No | Model | Registration | Mileage */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <F label="Order No" value={orderNo} onChange={setOrderNo} placeholder="Auto-assigned" />
            <F label="Model" value={model} onChange={setModel} placeholder="E71" />
            <F label="Registration" value={registration} onChange={setReg} placeholder="14106-P-DXB" />
            <F label="Mileage" value={mileage} onChange={setMileage} placeholder="57,066 km" />
          </div>

          {/* Contact (not on physical card, but useful) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F label="Customer Phone" value={customerPhone} onChange={setCP} placeholder="+971 50 000 0000" type="tel" />
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Customer's Concerns | Additional Findings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-style">Customer&apos;s Concerns</label>
              <textarea
                value={concerns}
                onChange={(e) => setConcerns(e.target.value)}
                rows={6}
                placeholder="What the customer reported…"
                className="input-style w-full resize-y"
              />
            </div>
            <div>
              <label className="label-style">Additional Findings</label>
              <textarea
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                rows={6}
                placeholder="Technician's additional findings…"
                className="input-style w-full resize-y"
              />
            </div>
          </div>

          {/* Suggestions */}
          <F label="Suggestions" value={suggestions} onChange={setSuggestions} placeholder="Suggestions for customer…" />

          <div className="border-t border-white/5" />

          {/* Jobs Carried Out */}
          <div>
            <p className="text-xs font-bold tracking-widest text-white/50 uppercase mb-3">Jobs Carried Out</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1">
              {jobRows.map((row) => (
                <div key={row.id} className="flex gap-2 items-center group py-0.5">
                  <input
                    value={row.job}
                    onChange={(e) => updateRow(row.id, "job", e.target.value)}
                    placeholder="Job description"
                    className="input-style flex-1 text-sm py-1.5 px-3 min-w-0"
                  />
                  <input
                    value={row.technician}
                    onChange={(e) => updateRow(row.id, "technician", e.target.value)}
                    placeholder="Technician"
                    className="input-style w-24 text-sm py-1.5 px-3 shrink-0"
                  />
                  <button
                    type="button"
                    onClick={() => setJobRows((p) => p.filter((r) => r.id !== row.id))}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setJobRows((p) => [...p, newJobRow()])}
              className="mt-3 flex items-center gap-2 text-[#00C2C7]/60 hover:text-[#00C2C7] text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              <Plus size={13} /> Add Row
            </button>
          </div>

          <div className="border-t border-white/5" />

          {/* Remarks */}
          <F label="Remarks" value={remarks} onChange={setRemarks} placeholder="Any remarks…" />
        </div>
      </div>

      {/* Status / Assignment (admin-only) */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Admin Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Sel label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <Sel label="Priority" value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
          <div>
            <label className="label-style">Assigned To</label>
            <div className="relative">
              <select value={assignedTo} onChange={(e) => setAT(e.target.value)} className="input-style w-full appearance-none pr-8">
                <option value="">— Unassigned —</option>
                {staff.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="label-style">Internal Notes</label>
          <textarea value={internalNotes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-style w-full resize-y" placeholder="Internal notes (not shown on invoice)…" />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end pb-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-7 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#0094FF] hover:text-white transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving…" : "Save Job Card"}
        </button>
      </div>
    </div>
  );
}

function F({ label, value, onChange, placeholder, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="label-style">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="input-style w-full" />
    </div>
  );
}

function Sel({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="label-style">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="input-style w-full appearance-none pr-8">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      </div>
    </div>
  );
}
