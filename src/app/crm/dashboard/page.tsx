"use client";

import {
  Users,
  CalendarCheck,
  Wrench,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Car,
} from "lucide-react";

const stats = [
  { label: "Total Customers", value: "1,247", change: "+12%", up: true, icon: Users },
  { label: "Active Jobs", value: "23", change: "+3", up: true, icon: Wrench },
  { label: "Appointments Today", value: "7", change: "-2", up: false, icon: CalendarCheck },
  { label: "Monthly Revenue", value: "AED 184K", change: "+8%", up: true, icon: TrendingUp },
];

const recentJobs = [
  { id: "JO-2041", customer: "Ahmed R.", car: "BMW M4", service: "Engine Rebuild", status: "In Progress", date: "Today" },
  { id: "JO-2040", customer: "Saeed K.", car: "MINI Cooper S", service: "Transmission", status: "Complete", date: "Yesterday" },
  { id: "JO-2039", customer: "Faisal H.", car: "Rolls-Royce Ghost", service: "Detailing", status: "Complete", date: "2 days ago" },
  { id: "JO-2038", customer: "Mohammed H.", car: "BMW X5", service: "Suspension", status: "In Progress", date: "2 days ago" },
  { id: "JO-2037", customer: "Khalid A.", car: "BMW 7 Series", service: "Coding", status: "Pending", date: "3 days ago" },
];

const upcomingAppointments = [
  { time: "09:00", customer: "Omar S.", car: "MINI Countryman", service: "Oil Service" },
  { time: "10:30", customer: "Rashid B.", car: "BMW 320i", service: "Diagnostics" },
  { time: "14:00", customer: "Hassan M.", car: "BMW M3", service: "Brake Overhaul" },
  { time: "16:30", customer: "Ali T.", car: "Rolls-Royce Cullinan", service: "Inspection" },
];

export default function CRMDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl text-white uppercase tracking-tight font-bold"
          style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
        >
          Dashboard
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Overview of your workshop today, May 5, 2026
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-black-soft border border-white/5 rounded-2xl p-5 hover:border-cyan/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                <s.icon size={18} className="text-cyan" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-white/40 text-xs font-ui font-semibold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-black-soft border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="font-ui font-bold text-white uppercase tracking-wide text-sm">
              Recent Service Jobs
            </h2>
            <a href="/crm/services" className="text-cyan text-xs font-semibold hover:underline">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-ui font-bold uppercase tracking-wider text-white/30 border-b border-white/5">
                  <th className="px-6 py-3">Job ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-white/60">{job.id}</td>
                    <td className="px-6 py-4 text-sm text-white font-semibold">{job.customer}</td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      <span className="flex items-center gap-2">
                        <Car size={14} className="text-cyan" /> {job.car}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">{job.service}</td>
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
                    <td className="px-6 py-4 text-right text-sm text-white/30">{job.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-black-soft border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="font-ui font-bold text-white uppercase tracking-wide text-sm">
              Today&apos;s Appointments
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingAppointments.map((apt) => (
              <div key={apt.time} className="flex gap-4">
                <div className="shrink-0 w-14 text-right">
                  <p className="text-sm font-bold text-cyan">{apt.time}</p>
                </div>
                <div className="flex-1 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-white">{apt.customer}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {apt.car} — {apt.service}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
