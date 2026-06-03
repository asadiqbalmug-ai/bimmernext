"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, Trash2, Plus, ChevronDown } from "lucide-react";

interface JobRow { id: string; job: string; technician: string }
interface StaffMember { id: string; full_name: string; role: string }

const STATUS_OPTIONS = ["Open","In Progress","Waiting Parts","Ready","Completed","Cancelled"];
const PRIORITY_OPTIONS = ["Low","Normal","High","Urgent"];
const newJobRow = (): JobRow => ({ id: crypto.randomUUID(), job: "", technician: "" });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JobDetailClient({ job, staff }: { job: any; staff: StaffMember[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const parseJobRows = (): JobRow[] => {
    try {
      const raw = Array.isArray(job.jobs_carried_out) ? job.jobs_carried_out : JSON.parse(job.jobs_carried_out || "[]");
      const rows = raw.map((r: Record<string,unknown>, idx: number) => ({
        id: String(idx), job: String(r.job ?? ""), technician: String(r.technician ?? ""),
      }));
      while (rows.length < 8) rows.push(newJobRow());
      return rows;
    } catch { return Array.from({ length: 8 }, newJobRow); }
  };

  const [status, setStatus]   = useState<string>(job.status || "Open");
  const [priority, setPriority] = useState<string>(job.priority || "Normal");
  const [assignedTo, setAT]   = useState<string>(job.assigned_to || "");

  const [date, setDate]       = useState(job.date_in || "");
  const [orderNo, setOrderNo] = useState(job.order_no || "");
  const [customerName, setCN] = useState(job.customer_name || "");
  const [customerPhone, setCP] = useState(job.customer_phone || "");
  const [make, setMake]       = useState(job.make || "");
  const [model, setModel]     = useState(job.model || "");
  const [vin, setVin]         = useState(job.vin || "");
  const [registration, setReg] = useState(job.registration || "");
  const [mileage, setMileage] = useState(job.mileage_in ? String(job.mileage_in) : "");

  const [concerns, setConcerns]   = useState(job.customers_concerns || "");
  const [findings, setFindings]   = useState(job.additional_findings || "");
  const [suggestions, setSugg]    = useState(job.suggestions || "");
  const [remarks, setRemarks]     = useState(job.remarks || "");
  const [internalNotes, setNotes] = useState(job.internal_notes || "");

  const [jobRows, setJobRows] = useState<JobRow[]>(parseJobRows());

  const updateRow = (id: string, key: keyof JobRow, val: string) =>
    setJobRows((p) => p.map((r) => r.id === id ? { ...r, [key]: val } : r));

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const selectedStaff = staff.find((s) => s.id === assignedTo);
    const filledRows = jobRows.filter((r) => r.job.trim());
    const { error } = await supabase.from("job_cards").update({
      status, priority,
      order_no: orderNo || null,
      customer_name: customerName,
      customer_phone: customerPhone || null,
      make: make || null, model: model || null,
      vin: vin || null, registration: registration || null,
      mileage_in: mileage ? parseInt(mileage.replace(/[^0-9]/g, "")) || null : null,
      date_in: date || null,
      customers_concerns: concerns || null,
      additional_findings: findings || null,
      suggestions: suggestions || null,
      remarks: remarks || null,
      jobs_carried_out: filledRows.map((r) => ({ job: r.job, technician: r.technician })),
      internal_notes: internalNotes || null,
      assigned_to: assignedTo || null,
      assigned_name: selectedStaff?.full_name || null,
    }).eq("id", job.id);
    setSaving(false);
    if (error) { alert("Error: " + error.message); return; }
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete job card ${job.job_number}? This cannot be undone.`)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("job_cards").delete().eq("id", job.id);
    router.push("/admin/jobs");
  };

  return (
    <div className="space-y-5">
      {/* Attachment badge */}
      {job.pdf_filename && (
        <div className="bg-[#0A0A0A] rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00C2C7]/10 flex items-center justify-center text-[#00C2C7] text-xs font-bold shrink-0">
            {job.pdf_filename.split(".").pop()?.toUpperCase()}
          </div>
          <p className="text-white/60 text-sm">{job.pdf_filename}</p>
        </div>
      )}

      {/* ── Job Card body ── */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <p className="text-xs text-white/30 font-semibold tracking-widest uppercase">BimmerNext Auto Maintenance</p>
          <p className="text-white font-bold text-sm tracking-widest">JOB CARD</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <F label="Date" value={date} onChange={setDate} type="date" />
            <F label="Make" value={make} onChange={setMake} placeholder="BMW" />
            <F label="VIN" value={vin} onChange={setVin} />
            <F label="Customer" value={customerName} onChange={setCN} />
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <F label="Order No" value={orderNo} onChange={setOrderNo} />
            <F label="Model" value={model} onChange={setModel} placeholder="E71" />
            <F label="Registration" value={registration} onChange={setReg} />
            <F label="Mileage" value={mileage} onChange={setMileage} />
          </div>
          {/* Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <F label="Customer Phone" value={customerPhone} onChange={setCP} type="tel" />
          </div>

          <div className="border-t border-white/5" />

          {/* Concerns + Findings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label-style">Customer&apos;s Concerns</label>
              <textarea value={concerns} onChange={(e) => setConcerns(e.target.value)} rows={6} className="input-style w-full resize-y" />
            </div>
            <div>
              <label className="label-style">Additional Findings</label>
              <textarea value={findings} onChange={(e) => setFindings(e.target.value)} rows={6} className="input-style w-full resize-y" />
            </div>
          </div>
          <F label="Suggestions" value={suggestions} onChange={setSugg} />

          <div className="border-t border-white/5" />

          {/* Jobs Carried Out */}
          <div>
            <p className="text-xs font-bold tracking-widest text-white/50 uppercase mb-3">Jobs Carried Out</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1">
              {jobRows.map((row) => (
                <div key={row.id} className="flex gap-2 items-center group py-0.5">
                  <input value={row.job} onChange={(e) => updateRow(row.id, "job", e.target.value)} placeholder="Job description" className="input-style flex-1 text-sm py-1.5 px-3 min-w-0" />
                  <input value={row.technician} onChange={(e) => updateRow(row.id, "technician", e.target.value)} placeholder="Technician" className="input-style w-24 text-sm py-1.5 px-3 shrink-0" />
                  <button type="button" onClick={() => setJobRows((p) => p.filter((r) => r.id !== row.id))} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setJobRows((p) => [...p, newJobRow()])} className="mt-3 flex items-center gap-2 text-[#00C2C7]/60 hover:text-[#00C2C7] text-xs font-semibold tracking-widest uppercase transition-colors">
              <Plus size={13} /> Add Row
            </button>
          </div>

          <div className="border-t border-white/5" />
          <F label="Remarks" value={remarks} onChange={setRemarks} />
        </div>
      </div>

      {/* Admin settings */}
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
          <textarea value={internalNotes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-style w-full resize-y" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pb-6">
        <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all">
          {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          Delete Job Card
        </button>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-7 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#0094FF] hover:text-white transition-all disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function F({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="label-style">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-style w-full" />
    </div>
  );
}
function Sel({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
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
