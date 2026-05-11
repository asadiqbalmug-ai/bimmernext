import type { Metadata } from "next";
import PrintButton from "./print-button";

export const metadata: Metadata = {
  title: "Invoice | BimmerNext",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [{ id: "5171" }];
}

const invoice = {
  number: "5171",
  date: "31/03/2026",
  make: "Mini",
  model: "F56",
  vin: "TM31955",
  registration: "110-B-AJM",
  mileage: "57,066 km",
  customer: "Mr Abu Mohd",
  sections: [
    {
      title: "General Maintenance",
      items: [
        { desc: "Starter motor (R/I and cleaning)", qty: "01", unit: 100, amount: 100 },
        { desc: "Engine oil service BMW 5w30", qty: "01", unit: 350, amount: 350 },
        { desc: "Spark plugs (OE)", qty: "04", unit: 95, amount: 380 },
        { desc: "Air filter (OEM)", qty: "01", unit: 80, amount: 80 },
        { desc: "AC filter (OEM)", qty: "01", unit: 140, amount: 140 },
        { desc: "Dual clutch gearbox oil service (OE)", qty: "7L", unit: 145, amount: 1015 },
        { desc: "Gearbox adaptation", qty: "01", unit: 100, amount: 100 },
      ],
      parts: 2165,
      labour: 150,
    },
    {
      title: "Miscellaneous",
      items: [
        { desc: "Engine mount upper (OE)", qty: "01", unit: 620, amount: 620 },
        { desc: "Washer pump (OE)", qty: "01", unit: 130, amount: 130 },
        { desc: "Wheel alignment", qty: "01", unit: 100, amount: 100 },
      ],
      parts: 850,
      labour: 300,
    },
  ],
  totalParts: 3015,
  totalLabour: 450,
  grandTotal: 3465,
  grandTotalWords: "Three Thousand Four Hundred and Sixty Five Only",
};

export default function InvoicePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 print:bg-white print:p-0">
      <div
        className="w-full max-w-[800px] bg-white print:shadow-none shadow-2xl"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* ── HEADER ── */}
        <div className="bg-[#0A0A0A] px-10 pt-8 pb-6">
          <div className="flex items-start justify-between">
            {/* Logo + name */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bnlogo__1_-removebg-preview.png"
                alt="BimmerNext"
                className="h-12 w-auto object-contain invert mb-3"
              />
              <p className="text-[#8A8A8A] text-xs tracking-widest font-semibold uppercase">
                Auto Maintenance — Ajman, UAE
              </p>
            </div>

            {/* Invoice badge */}
            <div className="text-right">
              <div className="inline-block border border-[#00C2C7] px-4 py-1.5 rounded mb-2">
                <span className="text-[#00C2C7] text-sm font-bold tracking-[0.2em] uppercase">
                  Invoice
                </span>
              </div>
              <p className="text-[#8A8A8A] text-xs">
                No. <span className="text-white font-bold">#{invoice.number}</span>
              </p>
              <p className="text-[#8A8A8A] text-xs mt-0.5">{invoice.date}</p>
            </div>
          </div>
        </div>

        {/* ── CYAN STRIPE ── */}
        <div className="h-1 bg-gradient-to-r from-[#00C2C7] via-[#0094FF] to-[#00C2C7]" />

        {/* ── VEHICLE & CUSTOMER DETAILS ── */}
        <div className="bg-[#F5EFE6] px-10 py-5 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <DetailRow label="Customer" value={invoice.customer} highlight />
            <DetailRow label="Date" value={invoice.date} />
            <DetailRow label="Order No." value={`#${invoice.number}`} />
          </div>
          <div className="space-y-2">
            <DetailRow label="Vehicle" value={`${invoice.make} ${invoice.model}`} highlight />
            <DetailRow label="VIN" value={invoice.vin} />
            <DetailRow label="Registration" value={invoice.registration} />
            <DetailRow label="Mileage" value={invoice.mileage} />
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div className="px-10 py-6 space-y-8">
          {invoice.sections.map((section) => (
            <div key={section.title}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-5 bg-[#00C2C7] rounded-full" />
                <h3 className="text-[#0A0A0A] font-bold text-sm tracking-widest uppercase">
                  {section.title}
                </h3>
              </div>

              {/* Table */}
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0A0A0A] text-white">
                    <th className="text-left px-4 py-2.5 font-semibold text-xs tracking-wider rounded-tl-lg">
                      Description
                    </th>
                    <th className="text-center px-4 py-2.5 font-semibold text-xs tracking-wider w-14">
                      Qty
                    </th>
                    <th className="text-center px-4 py-2.5 font-semibold text-xs tracking-wider w-20">
                      Unit
                    </th>
                    <th className="text-right px-4 py-2.5 font-semibold text-xs tracking-wider w-28 rounded-tr-lg">
                      Amount (AED)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}
                    >
                      <td className="px-4 py-2.5 text-[#0A0A0A]">{item.desc}</td>
                      <td className="px-4 py-2.5 text-center text-[#8A8A8A]">{item.qty}</td>
                      <td className="px-4 py-2.5 text-center text-[#8A8A8A]">{item.unit.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-[#0A0A0A]">
                        {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Section subtotals */}
              <div className="mt-1 flex justify-end">
                <div className="min-w-[260px] border-t border-[#0A0A0A]/10">
                  <SubRow label="Parts" value={`${section.parts.toLocaleString()}/-`} />
                  <SubRow label="Labour" value={`${section.labour.toLocaleString()}/-`} />
                </div>
              </div>
            </div>
          ))}

          {/* ── GRAND TOTAL ── */}
          <div className="mt-4">
            <div className="bg-[#0A0A0A] rounded-xl overflow-hidden">
              <div className="flex justify-between px-6 py-3 border-b border-white/10">
                <span className="text-[#8A8A8A] text-sm font-semibold tracking-wider uppercase">Parts</span>
                <span className="text-white font-bold">{invoice.totalParts.toLocaleString()}/-</span>
              </div>
              <div className="flex justify-between px-6 py-3 border-b border-white/10">
                <span className="text-[#8A8A8A] text-sm font-semibold tracking-wider uppercase">Labour</span>
                <span className="text-white font-bold">{invoice.totalLabour.toLocaleString()}/-</span>
              </div>
              <div className="flex justify-between px-6 py-4 bg-[#00C2C7]">
                <span className="text-[#0A0A0A] text-base font-bold tracking-wider uppercase">Grand Total (AED)</span>
                <span className="text-[#0A0A0A] text-xl font-black">{invoice.grandTotal.toLocaleString()}/-</span>
              </div>
            </div>
            <p className="text-[#8A8A8A] text-xs italic mt-2 px-1">
              ({invoice.grandTotalWords})
            </p>
          </div>

          {/* ── NOTES ── */}
          <div className="bg-[#F5EFE6] rounded-xl px-6 py-4 mt-2">
            <p className="text-[#0A0A0A] text-xs font-bold tracking-widest uppercase mb-1">Notes</p>
            <p className="text-[#8A8A8A] text-xs leading-relaxed">
              All parts carry a 3-month / 5,000 km warranty (whichever comes first).
              Labour warranty is 30 days from date of service.
              Payment is due upon collection of the vehicle.
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="bg-[#0A0A0A] px-10 py-5 flex items-center justify-between">
          <div>
            <p className="text-[#8A8A8A] text-[10px] leading-relaxed">
              BimmerNext Auto Maintenance · Al Jurf 1 Industrial Area, Ajman, UAE
            </p>
            <p className="text-[#8A8A8A] text-[10px]">
              Phone: +971 52 384 2422 · bimmernext100@gmail.com
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#00C2C7] text-[10px] font-bold tracking-widest uppercase">bimmernext.ae</p>
            <div className="w-16 h-0.5 bg-gradient-to-l from-[#00C2C7] to-transparent ml-auto mt-1" />
          </div>
        </div>

        {/* Print button — hidden in print */}
        <div className="print:hidden flex justify-center py-6 bg-[#F5EFE6]">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#8A8A8A] w-24 shrink-0 text-xs font-semibold tracking-wider uppercase">
        {label}
      </span>
      <span className={`font-semibold ${highlight ? "text-[#0A0A0A]" : "text-[#1A1A1A]"}`}>
        {value}
      </span>
    </div>
  );
}

function SubRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-2 text-sm">
      <span className="text-[#8A8A8A] font-semibold tracking-wider uppercase text-xs">{label}</span>
      <span className="font-bold text-[#0A0A0A]">{value}</span>
    </div>
  );
}
