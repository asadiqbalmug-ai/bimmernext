"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, ExternalLink, Trash2, Search } from "lucide-react";

interface Invoice {
  number: string;
  date: string;
  customer: string;
  make: string;
  model: string;
  registration: string;
  grandTotal: number;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bn_invoices") || "[]");
    setInvoices(stored.reverse());
  }, []);

  const filtered = invoices.filter(
    (inv) =>
      inv.customer?.toLowerCase().includes(search.toLowerCase()) ||
      inv.registration?.toLowerCase().includes(search.toLowerCase()) ||
      inv.number?.includes(search)
  );

  const deleteInvoice = (number: string) => {
    if (!confirm("Delete this invoice?")) return;
    const updated = invoices.filter((i) => i.number !== number);
    localStorage.setItem("bn_invoices", JSON.stringify([...updated].reverse()));
    setInvoices(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Invoices</h1>
          <p className="text-white/40 text-sm mt-0.5">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link
          href="/crm/invoices/new"
          className="flex items-center gap-2 bg-cyan text-black-main px-5 py-2.5 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-blue transition-all"
        >
          <Plus size={16} /> New Invoice
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, plate, or invoice no."
          className="w-full bg-black-soft text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none border border-transparent focus:border-cyan/30 placeholder:text-white/20 transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-black-soft rounded-2xl border border-white/5 p-16 text-center">
          <FileText size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">
            {invoices.length === 0 ? "No invoices yet." : "No results found."}
          </p>
          {invoices.length === 0 && (
            <Link
              href="/crm/invoices/new"
              className="inline-flex items-center gap-2 mt-4 bg-cyan text-black-main px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-blue transition-all"
            >
              <Plus size={14} /> Create First Invoice
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-black-soft rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs tracking-wider uppercase">
                <th className="text-left px-6 py-4 font-semibold">Invoice #</th>
                <th className="text-left px-4 py-4 font-semibold">Customer</th>
                <th className="text-left px-4 py-4 font-semibold hidden md:table-cell">Vehicle</th>
                <th className="text-left px-4 py-4 font-semibold hidden md:table-cell">Plate</th>
                <th className="text-left px-4 py-4 font-semibold hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-4 font-semibold">Total (AED)</th>
                <th className="w-24 px-4 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((inv) => (
                <tr key={inv.number} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-cyan font-bold">#{inv.number}</span>
                  </td>
                  <td className="px-4 py-4 text-white font-semibold">{inv.customer}</td>
                  <td className="px-4 py-4 text-white/60 hidden md:table-cell">
                    {[inv.make, inv.model].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-4 text-white/60 hidden md:table-cell">{inv.registration || "—"}</td>
                  <td className="px-4 py-4 text-white/60 hidden lg:table-cell">{inv.date}</td>
                  <td className="px-4 py-4 text-right font-bold text-white">
                    {(inv.grandTotal || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/invoice/${inv.number}`}
                        target="_blank"
                        className="text-white/40 hover:text-cyan transition-colors"
                        title="View Invoice"
                      >
                        <ExternalLink size={15} />
                      </Link>
                      <button
                        onClick={() => deleteInvoice(inv.number)}
                        className="text-white/40 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
