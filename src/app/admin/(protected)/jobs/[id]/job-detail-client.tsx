"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, Trash2, Plus, ChevronDown, ExternalLink } from "lucide-react";

interface LineItem { id: string; desc: string; qty: string; unit: string; amount: number }
interface StaffMember { id: string; full_name: string; role: string }

const STATUS_OPTIONS = ["Open","In Progress","Waiting Parts","Ready","Completed","Cancelled"];
const PRIORITY_OPTIONS = ["Low","Normal","High","Urgent"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JobDetailClient({ job, staff }: { job: any; staff: StaffMember[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const parseItems = (): LineItem[] => {
    try {
      const raw = Array.isArray(job.items) ? job.items : JSON.parse(job.items || "[]");
      return raw.map((i: Record<string, unknown>, idx: number) => ({
        id: String(idx), desc: String(i.desc ?? ""), qty: String(i.qty ?? "1"),
        unit: String(i.unit ?? ""), amount: Number(i.amount ?? 0),
      }));
    } catch { return []; }
  };

  const [status, setStatus]     = useState<string>(job.status);
  const [priority, setPriority] = useState<string>(job.priority);
  const [assignedTo, setAT]     = useState<string>(job.assigned_to || "");

  const [customerName, setCN]   = useState(job.customer_name || "");
  const [customerPhone, setCP]  = useState(job.customer_phone || "");
  const [customerEmail, setCE]  = useState(job.customer_email || "");

  const [make, setMake]         = useState(job.make || "");
  const [model, setModel]       = useState(job.model || "");
  const [year, setYear]         = useState(job.year || "");
  const [color, setColor]       = useState(job.color || "");
  const [vin, setVin]           = useState(job.vin || "");
  const [registration, setReg]  = useState(job.registration || "");
  const [mileageIn, setMI]      = useState(job.mileage_in ? String(job.mileage_in) : "");
  const [mileageOut, setMO]     = useState(job.mileage_out ? String(job.mileage_out) : "");
  const [dateIn, setDateIn]     = useState(job.date_in || "");
  const [est, setEst]           = useState(job.estimated_completion || "");

  const [complaints, setCo]     = useState(job.customer_complaints || "");
  const [diagnosis, setDi]      = useState(job.diagnosis || "");
  const [workDone, setWD]       = useState(job.work_done || "");
  const [notes, setNo]          = useState(job.notes || "");

  const [items, setItems]       = useState<LineItem[]>(parseItems().length ? parseItems() : [{ id: "0", desc: "", qty: "1", unit: "", amount: 0 }]);
  const [labourCost, setLC]     = useState(job.labour_total ? String(job.labour_total) : "");

  const newItem = (): LineItem => ({ id: crypto.randomUUID(), desc: "", qty: "1", unit: "", amount: 0 });

  const updateItem = (id: string, key: keyof LineItem, val: string) =>
    setItems((prev) => prev.map((it) => {
      if (it.id !== id) return it;
      const u = { ...it, [key]: val };
      if (key === "qty" || key === "unit")
        u.amount = Math.round((parseFloat(u.qty) || 0) * (parseFloat(u.unit) || 0) * 100) / 100;
      return u;
    }));

  const partsTot  = items.reduce((s, i) => s + (i.amount || 0), 0);
  const labourTot = parseFloat(labourCost) || 0;
  const grandTot  = partsTot + labourTot;

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const selectedStaff = staff.find((s) => s.id === assignedTo);
    const { error } = await supabase.from("job_cards").update({
      status, priority,
      customer_name: customerName, customer_phone: customerPhone || null,
      customer_email: customerEmail || null,
      make: make || null, model: model || null, year: year || null, color: color || null,
      vin: vin || null, registration: registration || null,
      mileage_in: mileageIn ? parseInt(mileageIn.replace(/,/g, "")) : null,
      mileage_out: mileageOut ? parseInt(mileageOut.replace(/,/g, "")) : null,
      date_in: dateIn || null, estimated_completion: est || null,
      customer_complaints: complaints || null, diagnosis: diagnosis || null,
      work_done: workDone || null, notes: notes || null,
      items: items.filter((i) => i.desc).map((i) => ({
        desc: i.desc, qty: i.qty, unit: parseFloat(i.unit) || 0, amount: i.amount,
      })),
      parts_total: partsTot, labour_total: labourTot, grand_total: grandTot,
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
      {/* PDF attachment */}
      {job.pdf_filename && (
        <div className="bg-[#0A0A0A] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-0.5">Attached PDF</p>
            <p className="text-white text-sm font-semibold">{job.pdf_filename}</p>
          </div>
          <ExternalLink size={16} className="text-white/30" />
        </div>
      )}

      {/* Status row */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <Select label="Priority" value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
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
      </div>

      {/* Customer */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Customer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <F label="Full Name *" value={customerName} onChange={setCN} />
          <F label="Phone" value={customerPhone} onChange={setCP} type="tel" />
          <F label="Email" value={customerEmail} onChange={setCE} type="email" />
        </div>
      </div>

      {/* Vehicle */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Vehicle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <F label="Make"  value={make}  onChange={setMake}  />
          <F label="Model" value={model} onChange={setModel} />
          <F label="Year"  value={year}  onChange={setYear}  />
          <F label="Color" value={color} onChange={setColor} />
          <F label="VIN / Chassis" value={vin} onChange={setVin} className="sm:col-span-2" />
          <F label="Registration" value={registration} onChange={setReg} />
          <F label="Mileage In"   value={mileageIn}   onChange={setMI} />
          <F label="Mileage Out"  value={mileageOut}  onChange={setMO} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <F label="Date In" value={dateIn} onChange={setDateIn} type="date" />
          <F label="Est. Completion" value={est} onChange={setEst} type="date" />
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Job Details</h2>
        <div className="space-y-4">
          <TA label="Customer Complaints" value={complaints} onChange={setCo} />
          <TA label="Diagnosis" value={diagnosis} onChange={setDi} />
          <TA label="Work Done" value={workDone} onChange={setWD} />
        </div>
      </div>

      {/* Parts & Services */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Parts & Services</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-white/10 text-white/30 text-xs tracking-wider uppercase">
                <th className="text-left pb-3 font-semibold">Description</th>
                <th className="text-center pb-3 w-16 font-semibold">Qty</th>
                <th className="text-center pb-3 w-24 font-semibold">Unit (AED)</th>
                <th className="text-right pb-3 w-24 font-semibold">Amount</th>
                <th className="w-8 pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-2 pr-2">
                    <input value={item.desc} onChange={(e) => updateItem(item.id, "desc", e.target.value)} className="input-style w-full text-sm" placeholder="Description" />
                  </td>
                  <td className="py-2 px-1">
                    <input value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} className="input-style w-full text-center text-sm" />
                  </td>
                  <td className="py-2 px-1">
                    <input value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} className="input-style w-full text-center text-sm" placeholder="0" />
                  </td>
                  <td className="py-2 pl-1 text-right text-[#00C2C7] font-bold text-sm">
                    {item.amount > 0 ? item.amount.toLocaleString() : "—"}
                  </td>
                  <td className="py-2 pl-1">
                    <button type="button" onClick={() => setItems((p) => p.filter((i) => i.id !== item.id))} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => setItems((p) => [...p, newItem()])} className="mt-3 flex items-center gap-2 text-[#00C2C7]/60 hover:text-[#00C2C7] text-xs font-semibold tracking-widest uppercase transition-colors">
          <Plus size={14} /> Add Item
        </button>
        <div className="mt-5 border-t border-white/5 pt-4 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="label-style whitespace-nowrap">Labour (AED)</label>
            <input value={labourCost} onChange={(e) => setLC(e.target.value)} placeholder="0" className="input-style w-28 text-center" />
          </div>
          <div className="text-right space-y-1">
            <p className="text-white/40 text-xs">Parts: <span className="text-white font-bold">{partsTot.toLocaleString()} AED</span></p>
            <p className="text-white/40 text-xs">Labour: <span className="text-white font-bold">{labourTot.toLocaleString()} AED</span></p>
            <p className="text-[#00C2C7] font-black">Grand Total: {grandTot.toLocaleString()} AED</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Internal Notes</h2>
        <TA label="" value={notes} onChange={setNo} rows={3} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pb-6">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          Delete Job Card
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-7 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#0094FF] hover:text-white transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function F({ label, value, onChange, type = "text", className = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; className?: string;
}) {
  return (
    <div className={className}>
      {label && <label className="label-style">{label}</label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-style w-full" />
    </div>
  );
}
function TA({ label, value, onChange, rows = 4 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      {label && <label className="label-style">{label}</label>}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="input-style w-full resize-y" />
    </div>
  );
}
function Select({ label, value, onChange, options }: {
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
