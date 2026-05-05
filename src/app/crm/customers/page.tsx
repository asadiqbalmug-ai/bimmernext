"use client";

import { useState } from "react";
import { Search, Plus, Phone, Mail, Car, Filter, Download } from "lucide-react";

const customers = [
  { id: "CU-1042", name: "Ahmed R.", phone: "+971 50 111 2222", email: "ahmed.r@email.com", cars: ["BMW M4 2021"], lastVisit: "May 5, 2026", totalJobs: 8, status: "Active" },
  { id: "CU-1041", name: "Saeed K.", phone: "+971 50 222 3333", email: "saeed.k@email.com", cars: ["MINI Cooper S 2019"], lastVisit: "May 4, 2026", totalJobs: 4, status: "Active" },
  { id: "CU-1040", name: "Faisal Al Harmoodi", phone: "+971 50 333 4444", email: "faisal.h@email.com", cars: ["Rolls-Royce Ghost 2020"], lastVisit: "May 3, 2026", totalJobs: 3, status: "VIP" },
  { id: "CU-1039", name: "Mohammed H.", phone: "+971 50 444 5555", email: "mohammed.h@email.com", cars: ["BMW X5 2018"], lastVisit: "May 2, 2026", totalJobs: 12, status: "Active" },
  { id: "CU-1038", name: "Khalid A.", phone: "+971 50 555 6666", email: "khalid.a@email.com", cars: ["BMW 7 Series 2022"], lastVisit: "May 1, 2026", totalJobs: 2, status: "Active" },
  { id: "CU-1037", name: "Omar S.", phone: "+971 50 666 7777", email: "omar.s@email.com", cars: ["MINI Countryman 2021"], lastVisit: "Apr 28, 2026", totalJobs: 5, status: "Active" },
  { id: "CU-1036", name: "Rashid B.", phone: "+971 50 777 8888", email: "rashid.b@email.com", cars: ["BMW 320i 2020"], lastVisit: "Apr 25, 2026", totalJobs: 1, status: "New" },
  { id: "CU-1035", name: "Hassan M.", phone: "+971 50 888 9999", email: "hassan.m@email.com", cars: ["BMW M3 2023"], lastVisit: "Apr 20, 2026", totalJobs: 3, status: "Active" },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.cars.some((car) => car.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl text-white uppercase tracking-tight font-bold"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Customers
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage your customer database
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
            <Download size={16} /> Export
          </button>
          <button className="inline-flex items-center gap-2 bg-cyan text-black-main px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#01A5B1] transition-colors">
            <Plus size={16} /> Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers or vehicles..."
            className="w-full bg-black-soft border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 bg-black-soft border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-black-soft border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] font-ui font-bold uppercase tracking-wider text-white/30 border-b border-white/5">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Vehicles</th>
                <th className="px-6 py-3">Last Visit</th>
                <th className="px-6 py-3 text-center">Jobs</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-white/40">{c.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="flex items-center gap-2 text-xs text-white/40">
                        <Phone size={12} className="text-cyan" /> {c.phone}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-white/40">
                        <Mail size={12} className="text-cyan" /> {c.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {c.cars.map((car) => (
                      <span key={car} className="flex items-center gap-1.5 text-xs text-white/60">
                        <Car size={12} className="text-cyan" /> {car}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40">{c.lastVisit}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan/10 text-cyan text-sm font-bold">
                      {c.totalJobs}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        c.status === "VIP"
                          ? "bg-amber-500/10 text-amber-400"
                          : c.status === "New"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-cyan/10 text-cyan"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <p className="text-xs text-white/30">Showing {filtered.length} of {customers.length} customers</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg text-xs text-white/30 border border-white/10 hover:border-white/20 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs text-white/30 border border-white/10 hover:border-white/20 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
