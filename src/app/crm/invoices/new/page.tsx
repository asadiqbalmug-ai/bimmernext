"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface LineItem {
  id: string;
  desc: string;
  qty: string;
  unit: string;
  amount: number;
}

interface Section {
  id: string;
  title: string;
  items: LineItem[];
  labourCost: string;
}

function toWords(n: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + toWords(n % 100) : "");
  if (n < 100000) return toWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + toWords(n % 1000) : "");
  return toWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + toWords(n % 100000) : "");
}

const newItem = (): LineItem => ({
  id: crypto.randomUUID(),
  desc: "",
  qty: "01",
  unit: "",
  amount: 0,
});

const newSection = (): Section => ({
  id: crypto.randomUUID(),
  title: "",
  items: [newItem()],
  labourCost: "",
});

export default function NewInvoicePage() {
  const router = useRouter();

  const [customer, setCustomer] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");
  const [registration, setRegistration] = useState("");
  const [mileage, setMileage] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-GB"));
  const [sections, setSections] = useState<Section[]>([newSection()]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ [sections[0].id]: true });
  const [saving, setSaving] = useState(false);

  const toggleSection = (id: string) =>
    setOpenSections((s) => ({ ...s, [id]: !s[id] }));

  const updateSection = (id: string, key: keyof Section, val: string) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: val } : s)));

  const addSection = () => {
    const s = newSection();
    setSections((prev) => [...prev, s]);
    setOpenSections((prev) => ({ ...prev, [s.id]: true }));
  };

  const removeSection = (id: string) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const updateItem = (secId: string, itemId: string, key: keyof LineItem, val: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== secId) return s;
        return {
          ...s,
          items: s.items.map((it) => {
            if (it.id !== itemId) return it;
            const updated = { ...it, [key]: val };
            if (key === "qty" || key === "unit") {
              const q = parseFloat(updated.qty) || 0;
              const u = parseFloat(updated.unit) || 0;
              updated.amount = Math.round(q * u * 100) / 100;
            }
            return updated;
          }),
        };
      })
    );
  };

  const addItem = (secId: string) =>
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, items: [...s.items, newItem()] } : s))
    );

  const removeItem = (secId: string, itemId: string) =>
    setSections((prev) =>
      prev.map((s) =>
        s.id === secId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s
      )
    );

  const sectionParts = (s: Section) =>
    s.items.reduce((acc, it) => acc + (it.amount || 0), 0);

  const totalParts = sections.reduce((acc, s) => acc + sectionParts(s), 0);
  const totalLabour = sections.reduce((acc, s) => acc + (parseFloat(s.labourCost) || 0), 0);
  const grandTotal = totalParts + totalLabour;

  const handleSubmit = () => {
    if (!customer.trim() || !registration.trim()) {
      alert("Customer name and registration are required.");
      return;
    }
    setSaving(true);

    const existing = JSON.parse(localStorage.getItem("bn_invoices") || "[]");
    const nextNum = existing.length > 0
      ? Math.max(...existing.map((i: { number: number }) => Number(i.number))) + 1
      : 5172;

    const invoice = {
      number: String(nextNum),
      date,
      customer,
      make,
      model,
      vin,
      registration,
      mileage,
      sections: sections.map((s) => ({
        title: s.title || "Services",
        items: s.items.map((it) => ({
          desc: it.desc,
          qty: it.qty,
          unit: parseFloat(it.unit) || 0,
          amount: it.amount,
        })),
        parts: sectionParts(s),
        labour: parseFloat(s.labourCost) || 0,
      })),
      totalParts,
      totalLabour,
      grandTotal,
      grandTotalWords: toWords(Math.round(grandTotal)) + " Only",
    };

    localStorage.setItem("bn_invoices", JSON.stringify([...existing, invoice]));
    router.push(`/invoice/${invoice.number}`);
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">New Invoice</h1>
          <p className="text-white/40 text-sm mt-0.5">Fill in the details and line items below</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-cyan text-black-main px-6 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-blue transition-all disabled:opacity-50"
        >
          <FileText size={16} />
          {saving ? "Saving…" : "Save & Preview"}
        </button>
      </div>

      <div className="space-y-6">
        {/* ── VEHICLE & CUSTOMER ── */}
        <div className="bg-black-soft rounded-2xl p-6 border border-white/5">
          <h2 className="text-xs font-bold tracking-widest text-cyan uppercase mb-5">
            Customer & Vehicle Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Customer Name *" value={customer} onChange={setCustomer} placeholder="Mr Abu Mohd" />
            <Field label="Date" value={date} onChange={setDate} placeholder="DD/MM/YYYY" />
            <Field label="Make" value={make} onChange={setMake} placeholder="Mini" />
            <Field label="Model" value={model} onChange={setModel} placeholder="F56" />
            <Field label="VIN" value={vin} onChange={setVin} placeholder="TM31955" />
            <Field label="Registration *" value={registration} onChange={setRegistration} placeholder="110-B-AJM" />
            <Field label="Mileage" value={mileage} onChange={setMileage} placeholder="57,066 km" />
          </div>
        </div>

        {/* ── SECTIONS ── */}
        {sections.map((section, sIdx) => (
          <div key={section.id} className="bg-black-soft rounded-2xl border border-white/5 overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3 flex-1 mr-4">
                <div className="w-1 h-5 bg-cyan rounded-full shrink-0" />
                <input
                  value={section.title}
                  onChange={(e) => updateSection(section.id, "title", e.target.value)}
                  placeholder={`Section ${sIdx + 1} name (e.g. General Maintenance)`}
                  className="bg-transparent text-white font-bold text-sm tracking-wider w-full outline-none placeholder:text-white/20 border-b border-transparent focus:border-cyan/40 pb-0.5 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="text-white/40 hover:text-white transition-colors p-1"
                >
                  {openSections[section.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {sections.length > 1 && (
                  <button
                    onClick={() => removeSection(section.id)}
                    className="text-white/40 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {openSections[section.id] && (
              <div className="p-6">
                {/* Items table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[580px]">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-xs tracking-wider uppercase">
                        <th className="text-left pb-3 font-semibold">Description</th>
                        <th className="text-center pb-3 w-16 font-semibold">Qty</th>
                        <th className="text-center pb-3 w-24 font-semibold">Unit (AED)</th>
                        <th className="text-right pb-3 w-28 font-semibold">Amount</th>
                        <th className="w-8 pb-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {section.items.map((item) => (
                        <tr key={item.id} className="group">
                          <td className="py-2 pr-3">
                            <input
                              value={item.desc}
                              onChange={(e) => updateItem(section.id, item.id, "desc", e.target.value)}
                              placeholder="e.g. Engine oil service BMW 5w30"
                              className="w-full bg-black-elevated text-white text-sm px-3 py-2 rounded-lg outline-none border border-transparent focus:border-cyan/40 placeholder:text-white/20 transition-colors"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              value={item.qty}
                              onChange={(e) => updateItem(section.id, item.id, "qty", e.target.value)}
                              className="w-full bg-black-elevated text-white text-sm px-2 py-2 rounded-lg outline-none border border-transparent focus:border-cyan/40 text-center transition-colors"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              value={item.unit}
                              onChange={(e) => updateItem(section.id, item.id, "unit", e.target.value)}
                              placeholder="0"
                              className="w-full bg-black-elevated text-white text-sm px-2 py-2 rounded-lg outline-none border border-transparent focus:border-cyan/40 text-center transition-colors"
                            />
                          </td>
                          <td className="py-2 pl-2 text-right">
                            <span className="text-cyan font-bold text-sm">
                              {item.amount > 0 ? item.amount.toLocaleString() : "—"}
                            </span>
                          </td>
                          <td className="py-2 pl-2">
                            <button
                              onClick={() => removeItem(section.id, item.id)}
                              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
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
                  onClick={() => addItem(section.id)}
                  className="mt-3 flex items-center gap-2 text-cyan/70 hover:text-cyan text-xs font-semibold tracking-widest uppercase transition-colors"
                >
                  <Plus size={14} /> Add Line Item
                </button>

                {/* Section subtotals */}
                <div className="mt-5 flex items-end justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-3">
                    <label className="text-white/40 text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
                      Labour (AED)
                    </label>
                    <input
                      value={section.labourCost}
                      onChange={(e) => updateSection(section.id, "labourCost", e.target.value)}
                      placeholder="0"
                      className="w-28 bg-black-elevated text-white text-sm px-3 py-2 rounded-lg outline-none border border-transparent focus:border-cyan/40 text-center transition-colors"
                    />
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-white/40 text-xs">
                      Parts: <span className="text-white font-bold">{sectionParts(section).toLocaleString()}/-</span>
                    </p>
                    <p className="text-white/40 text-xs">
                      Labour: <span className="text-white font-bold">{(parseFloat(section.labourCost) || 0).toLocaleString()}/-</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add section */}
        <button
          onClick={addSection}
          className="w-full border-2 border-dashed border-white/10 rounded-2xl py-4 text-white/30 hover:text-white/60 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <Plus size={16} /> Add Section
        </button>

        {/* ── GRAND TOTAL PREVIEW ── */}
        <div className="bg-black-soft rounded-2xl p-6 border border-white/5">
          <h2 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Total Parts</span>
              <span className="text-white font-bold">{totalParts.toLocaleString()} AED</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Total Labour</span>
              <span className="text-white font-bold">{totalLabour.toLocaleString()} AED</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <span className="text-white font-bold">Grand Total</span>
              <span className="text-cyan text-xl font-black">{grandTotal.toLocaleString()} AED</span>
            </div>
            {grandTotal > 0 && (
              <p className="text-white/30 text-xs italic">
                ({toWords(Math.round(grandTotal))} Only)
              </p>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-cyan text-black-main px-8 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-blue transition-all disabled:opacity-50"
          >
            <FileText size={16} />
            {saving ? "Saving…" : "Save & Open Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-white/40 text-[10px] font-bold tracking-widest uppercase block mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black-elevated text-white text-sm px-4 py-2.5 rounded-xl outline-none border border-transparent focus:border-cyan/40 placeholder:text-white/20 transition-colors"
      />
    </div>
  );
}
