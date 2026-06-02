"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

interface LineItem { id: string; desc: string; qty: string; unit: string; amount: number }

function toWords(n: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " "+ones[n%10] : "");
  if (n < 1000) return ones[Math.floor(n/100)] + " Hundred" + (n%100 ? " "+toWords(n%100) : "");
  if (n < 100000) return toWords(Math.floor(n/1000)) + " Thousand" + (n%1000 ? " "+toWords(n%1000) : "");
  return n.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NewInvoiceClient({ prefillJob }: { prefillJob: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const parseJobItems = (): LineItem[] => {
    if (!prefillJob?.items) return [{ id: "0", desc: "", qty: "1", unit: "", amount: 0 }];
    try {
      const raw = Array.isArray(prefillJob.items) ? prefillJob.items : JSON.parse(prefillJob.items);
      return raw.map((i: Record<string,unknown>, idx: number) => ({
        id: String(idx), desc: String(i.desc ?? ""),
        qty: String(i.qty ?? "1"), unit: String(i.unit ?? ""),
        amount: Number(i.amount ?? 0),
      }));
    } catch { return [{ id: "0", desc: "", qty: "1", unit: "", amount: 0 }]; }
  };

  const [customer, setCustomer]     = useState(prefillJob?.customer_name ?? "");
  const [make, setMake]             = useState(prefillJob?.make ?? "");
  const [model, setModel]           = useState(prefillJob?.model ?? "");
  const [vin, setVin]               = useState(prefillJob?.vin ?? "");
  const [registration, setReg]      = useState(prefillJob?.registration ?? "");
  const [mileage, setMileage]       = useState(prefillJob?.mileage_in ? String(prefillJob.mileage_in) : "");
  const [date, setDate]             = useState(new Date().toLocaleDateString("en-GB").replace(/\//g, "/"));
  const [items, setItems]           = useState<LineItem[]>(parseJobItems());
  const [labourCost, setLabourCost] = useState(prefillJob?.labour_total ? String(prefillJob.labour_total) : "");
  const [notes, setNotes]           = useState("");

  const newItem = (): LineItem => ({ id: crypto.randomUUID(), desc: "", qty: "1", unit: "", amount: 0 });

  const updateItem = (id: string, key: keyof LineItem, val: string) =>
    setItems((prev) => prev.map((it) => {
      if (it.id !== id) return it;
      const u = { ...it, [key]: val };
      if (key === "qty" || key === "unit")
        u.amount = Math.round((parseFloat(u.qty)||0) * (parseFloat(u.unit)||0) * 100) / 100;
      return u;
    }));

  const partsTot  = items.reduce((s, i) => s + (i.amount || 0), 0);
  const labourTot = parseFloat(labourCost) || 0;
  const grandTot  = partsTot + labourTot;

  const handleSave = async () => {
    if (!customer.trim()) { alert("Customer name required."); return; }
    setSaving(true);
    const supabase = createClient();

    // Generate invoice number
    const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true });
    const invNumber = String(5172 + (count || 0));

    const sections = [{
      title: "Services",
      items: items.filter((i) => i.desc).map((i) => ({
        desc: i.desc, qty: i.qty, unit: parseFloat(i.unit)||0, amount: i.amount,
      })),
      parts: partsTot,
      labour: labourTot,
    }];

    // Save to invoices table
    const { data: inv, error } = await supabase.from("invoices").insert({
      invoice_number: invNumber,
      job_id: prefillJob?.id ?? null,
      items: sections,
      subtotal: partsTot,
      total_amount: grandTot,
      status: "Draft",
    }).select("id").single();

    if (error) { alert("Error: " + error.message); setSaving(false); return; }

    // Mark job card as invoiced
    if (prefillJob?.id) {
      await supabase.from("job_cards").update({ invoice_id: inv.id, status: "Completed" }).eq("id", prefillJob.id);
    }

    // Build payload for printable invoice view
    const invoiceData = {
      number: invNumber,
      date,
      customer,
      make,
      model,
      vin,
      registration,
      mileage: mileage ? `${mileage} km` : "",
      sections,
      totalParts: partsTot,
      totalLabour: labourTot,
      grandTotal: grandTot,
      grandTotalWords: toWords(Math.round(grandTot)) + " Only",
    };

    // Store in localStorage for invoice view (fallback)
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem("bn_invoices") || "[]");
      localStorage.setItem("bn_invoices", JSON.stringify([...existing, invoiceData]));
    }

    router.push(`/invoice/${invNumber}`);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Customer & Vehicle */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Customer & Vehicle</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <F label="Customer Name *" value={customer} onChange={setCustomer} />
          <F label="Date" value={date} onChange={setDate} />
          <F label="Make" value={make} onChange={setMake} />
          <F label="Model" value={model} onChange={setModel} />
          <F label="VIN" value={vin} onChange={setVin} />
          <F label="Registration" value={registration} onChange={setReg} />
          <F label="Mileage (km)" value={mileage} onChange={setMileage} />
        </div>
      </div>

      {/* Line items */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-4">Parts & Services</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
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
                    <input value={item.desc} onChange={(e) => updateItem(item.id,"desc",e.target.value)} className="input-style w-full text-sm" placeholder="e.g. Engine oil" />
                  </td>
                  <td className="py-2 px-1">
                    <input value={item.qty} onChange={(e) => updateItem(item.id,"qty",e.target.value)} className="input-style w-full text-center text-sm" />
                  </td>
                  <td className="py-2 px-1">
                    <input value={item.unit} onChange={(e) => updateItem(item.id,"unit",e.target.value)} className="input-style w-full text-center text-sm" placeholder="0" />
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
            <input value={labourCost} onChange={(e) => setLabourCost(e.target.value)} placeholder="0" className="input-style w-28 text-center" />
          </div>
          <div className="text-right space-y-1">
            <p className="text-white/40 text-xs">Parts: <span className="text-white font-bold">{partsTot.toLocaleString()} AED</span></p>
            <p className="text-white/40 text-xs">Labour: <span className="text-white font-bold">{labourTot.toLocaleString()} AED</span></p>
            <p className="text-[#00C2C7] font-black text-lg">Grand Total: {grandTot.toLocaleString()} AED</p>
            {grandTot > 0 && <p className="text-white/30 text-xs italic">({toWords(Math.round(grandTot))} Only)</p>}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
        <label className="label-style">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input-style w-full resize-y" placeholder="Optional notes on invoice…" />
      </div>

      <div className="flex justify-end pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-7 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#0094FF] hover:text-white transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving…" : "Save & Open Invoice"}
        </button>
      </div>
    </div>
  );
}

function F({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label-style">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input-style w-full" />
    </div>
  );
}
