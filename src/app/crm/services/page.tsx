"use client";

import { useState } from "react";
import { Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, Wrench, Car, User, Tag } from "lucide-react";

const jobs = [
  { id: "JO-2041", customer: "Ahmed R.", car: "BMW M4 2021", service: "Engine Rebuild", status: "In Progress", priority: "High", assigned: "Technician A", estCost: "AED 12,500", startDate: "May 1", dueDate: "May 8" },
  { id: "JO-2040", customer: "Saeed K.", car: "MINI Cooper S 2019", service: "Transmission Rebuild", status: "Complete", priority: "High", assigned: "Technician B", estCost: "AED 8,200", startDate: "Apr 28", dueDate: "May 4" },
  { id: "JO-2039", customer: "Faisal H.", car: "Rolls-Royce Ghost 2020", service: "Detailing & Polish", status: "Complete", priority: "Medium", assigned: "Technician C", estCost: "AED 4,500", startDate: "Apr 25", dueDate: "May 3" },
  { id: "JO-2038", customer: "Mohammed H.", car: "BMW X5 2018", service: "Suspension Overhaul", status: "In Progress", priority: "Medium", assigned: "Technician A", estCost: "AED 6,800", startDate: "Apr 30", dueDate: "May 7" },
  { id: "JO-2037", customer: "Khalid A.", car: "BMW 7 Series 2022", service: "Coding & Features", status: "Pending", priority: "Low", assigned: "Technician D", estCost: "AED 2,200", startDate: "—", dueDate: "May 10" },
  { id: "JO-2036", customer: "Omar S.", car: "MINI Countryman 2021", service: "Oil Service + Filters", status: "Complete", priority: "Low", assigned: "Technician B", estCost: "AED 950", startDate: "May 2", dueDate: "May 3" },
  { id: "JO-2035", customer: "Rashid B.", car: "BMW 320i 2020", service: "Diagnostic Scan", status: "Pending", priority: "Medium", assigned: "—", estCost: "AED 400", startDate: "—", dueDate: "May 6" },
  { id: "JO-2034", customer: "Hassan M.", car: "BMW M3 2023", service: "Brake System Overhaul", status: "In Progress", priority: "High", assigned: "Technician A", estCost: "AED 5,500", startDate: "May 3", dueDate: "May 6" },
];

const statusCounts = [
  { label: "Total Jobs", value: jobs.length, color: "bg-white/5 text-white" },
  { label: "In Progress", value: jobs.filter((j) => j.status === "In Progress").length, color: "bg-cyan/10 text-cyan" },
  { label: "Pending", value: jobs.filter((j) => j.status === "Pending").length, color: "bg-amber-500/10 text-amber-400" },
  { label: "Complete", value: jobs.filter((j) => j.status === "Complete").length, color: "bg-emerald-500/10 text-emerald-400" },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.customer.toLowerCase().includes(search.toLowerCase()) ||
      j.car.toLowerCase().includes(search.toLowerCase()) ||
      j.service.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-3xl text-white uppercase tracking-tight font-bold"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Service Jobs
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Track active and completed workshop jobs
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-cyan text-black-main px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#01A5B1] transition-colors">
          <Plus size={16} /> Create Job
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCounts.map((s) => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.label.toLowerCase() === "total jobs" ? "all" : s.label.toLowerCase().replace(" ", " "))}
            className={`p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors text-left ${
              statusFilter === (s.label.toLowerCase() === "total jobs" ? "all" : s.label.toLowerCase())
                ? "bg-cyan/5 border-cyan/20"
                : "bg-black-soft"
            }`}
          >
            <p className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</p>
            <p className="text-[11px] text-white/30 font-bold uppercase tracking-wider mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, customers, vehicles..."
            className="w-full bg-black-soft border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan transition-colors"
          />
        </div>
        <button className="inline-flex items-center gap-2 bg-black-soft border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
          <Filter size={16} /> More Filters
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-black-soft border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] font-ui font-bold uppercase tracking-wider text-white/30 border-b border-white/5">
                <th className="px-6 py-3">Job ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Vehicle</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Assigned</th>
                <th className="px-6 py-3">Est. Cost</th>
                <th className="px-6 py-3">Timeline</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-white/40">{job.id}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-white font-semibold">
                      <User size={14} className="text-cyan" /> {job.customer}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs text-white/60">
                      <Car size={14} className="text-cyan" /> {job.car}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-white/60">
                      <Wrench size={14} className="text-cyan" /> {job.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40">{job.assigned}</td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">{job.estCost}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-white/40 space-y-0.5">
                      <p>Start: {job.startDate}</p>
                      <p>Due: {job.dueDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        job.status === "Complete"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : job.status === "In Progress"
                          ? "bg-cyan/10 text-cyan"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {job.status === "Complete" ? (
                        <CheckCircle2 size={12} />
                      ) : job.status === "In Progress" ? (
                        <Clock size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
