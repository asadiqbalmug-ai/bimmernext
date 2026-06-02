"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Save, Loader2, ChevronDown } from "lucide-react";
import PdfExtractor, { type ExtractedJobCard } from "./pdf-extractor";

interface LineItem { id: string; desc: string; qty: string; unit: string; amount: number }
interface StaffMember { id: string; full_name: string; role: string }

const STATUS_OPTIONS = ["Open","In Progress","Waiting Parts","Ready","Completed","Cancelled"];
const PRIORITY_OPTIONS = ["Low","Normal","High","Urgent"];

const newItem = (): LineItem => ({
  id: crypto.randomUUID(), desc: "", qty: "1", unit: "", amount: 0,
});

export default function NewJobForm({ staff }: { staff: StaffMember[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extracted, setExtracted] = useState(false);

  // Form state
  const [status, setStatus]       = useState("Open");
  const [priority, setPriority]   = useState("Normal");
  const [assignedTo, setAssignedTo] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [make, setMake]           = useState("");
  const [model, setModel]         = useState("");
  const [year, setYear]           = useState("");
  const [color, setColor]         = useState("");
  const [vin, setVin]             = useState("");
  const [registration, setReg]    = useState("");
  const [mileageIn, setMileageIn] = useState("");
  const [dateIn, setDateIn]       = useState(new Date().toISOString().split("T")[0]);
  const [estCompletion, setEst]   = useState("");

  const [complaints, setComplaints] = useState("");
  const [diagnosis, setDiagnosis]   = useState("");
  const [workDone, setWorkDone]     = useState("");
  const [notes, setNotes]           = useState("");

  const [items, setItems]           = useState<LineItem[]>([newItem()]);
  const [labourCost, setLabourCost] = useState("");

  const updateItem = (id: string, key: keyof LineItem, val: string) => {
    setItems((prev) => prev.map((it) => {
      if (it.id !== id) return it;
      const updated = { ...it, [key]: val };
      if (key === "qty" || key === "unit") {
        updated.amount = Math.round((parseFloat(updated.qty) || 0) * (parseFloat(updated.unit) || 0) * 100) / 100;
      }
      return updated;
    }));
  };

  const partsTot = items.reduce((s, it) => s + (it.amount || 0), 0);
  const labourTot = parseFloat(labourCost) || 0;
  const grandTot  = partsTot + labourTot;

  const handleExtracted = (data: ExtractedJobCard, file: File) => {
    setPdfFile(file);
    setExtracted(true);
    if (data.customer_name)  setCustomerName(data.customer_name);
    if (data.customer_phone) setCustomerPhone(data.customer_phone);
    if (data.make)           setMake(data.make);
    if (data.model)          setModel(data.model);
    if (data.year)           setYear(data.year);
    if (data.vin)            setVin(data.vin);
    if (data.registration)   setReg(data.registration);
    if (data.mileage_in)     setMileageIn(data.mileage_in);
    if (data.date_in)        setDateIn(data.date_in);
    if (data.customer_complaints) setComplaints(data.customer_complaints);
    if (data.work_done)      setWorkDone(data.work_done);
    if (data.items?.length)  setItems(data.items.map((i) => ({ ...newItem(), ...i, unit: String(i.unit ?? ""), id: crypto.randomUUID() })));
    if (data.labour_total)   setLabourCost(String(data.labour_total));
  };

  const handleSave = async () => {
    if (!customerName.trim()) { alert("Customer name is required."); return; }
    setSaving(true);

    const supabase = createClient();

    let pdfUrl: string | null = null;
    let pdfFilename: string | null = null;

    if (pdfFile) {
      const { data: uploadData } = await supabase.storage
        .from("job-cards")
        .upload(`${Date.now()}-${pdfFile.name}`, pdfFile, { contentType: "application/pdf" });
      if (uploadData) {
        pdfUrl = uploadData.path;
        pdfFilename = pdfFile.name;
      }
    }

    const selectedStaff = staff.find((s) => s.id === assignedTo);

    const { data, error } = await supabase.from("job_cards").insert({
      job_number: "",
      status,
      priority,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim() || null,
      customer_email: customerEmail.trim() || null,
      make: make.trim() || null,
      model: model.trim() || null,
      year: year.trim() || null,
      color: color.trim() || null,
      vin: vin.trim() || null,
      registration: registration.trim() || null,
      mileage_in: mileageIn ? parseInt(mileageIn.replace(/,/g, "")) : null,
      date_in: dateIn || null,
      estimated_completion: estCompletion || null,
      customer_complaints: complaints.trim() || null,
      diagnosis: diagnosis.trim() || null,
      work_done: workDone.trim() || null,
      notes: notes.trim() || null,
      items: items.filter((i) => i.desc).map((i) => ({
        desc: i.desc, qty: i.qty, unit: parseFloat(i.unit) || 0, amount: i.amount,
      })),
      parts_total: partsTot,
      labour_total: labourTot,
      grand_total: grandTot,
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
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
      {/* PDF Upload */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">
          Upload Job Card PDF <span className="text-white/20 font-normal normal-case tracking-normal">(optional — auto-fills fields)</span>
        </h2>
        <PdfExtractor
          onExtracted={handleExtracted}
          onFileSelected={setPdfFile}
        />
        {extracted && (
          <p className="text-green-400 text-xs mt-3 font-semibold">
            ✓ Fields extracted — review and edit below before saving.
          </p>
        )}
      </div>

      {/* Status + Priority + Assignment */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Job Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <SelectField label="Priority" value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
          <div>
            <label className="label-style">Assigned To</label>
            <div className="relative">
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="input-style w-full appearance-none pr-8"
              >
                <option value="">— Unassigned —</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.full_name}</option>
                ))}
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
          <Field label="Full Name *" value={customerName} onChange={setCustomerName} placeholder="Mr Abu Mohd" />
          <Field label="Phone" value={customerPhone} onChange={setCustomerPhone} placeholder="+971 50 000 0000" type="tel" />
          <Field label="Email" value={customerEmail} onChange={setCustomerEmail} placeholder="customer@email.com" type="email" />
        </div>
      </div>

      {/* Vehicle */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Vehicle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Field label="Make"  value={make}  onChange={setMake}  placeholder="Mini"  />
          <Field label="Model" value={model} onChange={setModel} placeholder="F56"   />
          <Field label="Year"  value={year}  onChange={setYear}  placeholder="2022"  />
          <Field label="Color" value={color} onChange={setColor} placeholder="Red"   />
          <Field label="VIN / Chassis" value={vin} onChange={setVin} placeholder="TM31955" className="sm:col-span-2" />
          <Field label="Registration / Plate" value={registration} onChange={setReg} placeholder="110-B-AJM" />
          <Field label="Mileage In (km)" value={mileageIn} onChange={setMileageIn} placeholder="57,066" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Field label="Date In" value={dateIn} onChange={setDateIn} type="date" />
          <Field label="Estimated Completion" value={estCompletion} onChange={setEst} type="date" />
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Job Details</h2>
        <div className="space-y-4">
          <TextArea label="Customer Complaints / Requests" value={complaints} onChange={setComplaints} placeholder="What the customer reported…" />
          <TextArea label="Diagnosis" value={diagnosis} onChange={setDiagnosis} placeholder="Technician diagnosis…" />
          <TextArea label="Work Done" value={workDone} onChange={setWorkDone} placeholder="Work completed…" />
        </div>
      </div>

      {/* Line Items */}
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
                    <input
                      value={item.desc}
                      onChange={(e) => updateItem(item.id, "desc", e.target.value)}
                      placeholder="e.g. Engine oil BMW 5w30"
                      className="input-style w-full text-sm"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <input
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                      className="input-style w-full text-center text-sm"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <input
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                      placeholder="0"
                      className="input-style w-full text-center text-sm"
                    />
                  </td>
                  <td className="py-2 pl-1 text-right">
                    <span className="text-[#00C2C7] font-bold text-sm">
                      {item.amount > 0 ? item.amount.toLocaleString() : "—"}
                    </span>
                  </td>
                  <td className="py-2 pl-1">
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                      className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => setItems((p) => [...p, newItem()])}
          className="mt-3 flex items-center gap-2 text-[#00C2C7]/60 hover:text-[#00C2C7] text-xs font-semibold tracking-widest uppercase transition-colors"
        >
          <Plus size={14} /> Add Item
        </button>

        {/* Totals */}
        <div className="mt-5 border-t border-white/5 pt-4 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-white/40 text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
              Labour (AED)
            </label>
            <input
              value={labourCost}
              onChange={(e) => setLabourCost(e.target.value)}
              placeholder="0"
              className="input-style w-28 text-center"
            />
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
        <TextArea label="" value={notes} onChange={setNotes} placeholder="Any internal notes…" rows={3} />
      </div>

      {/* Save */}
      <div className="flex justify-end pb-6">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-7 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#0094FF] hover:text-white transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving…" : "Save Job Card"}
        </button>
      </div>
    </form>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder, type = "text", className = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; className?: string;
}) {
  return (
    <div className={className}>
      {label && <label className="label-style">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-style w-full"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder, rows = 4,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div>
      {label && <label className="label-style">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="input-style w-full resize-y"
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="label-style">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-style w-full appearance-none pr-8"
        >
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      </div>
    </div>
  );
}
