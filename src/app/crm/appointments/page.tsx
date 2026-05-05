"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, Car, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const appointments = [
  { id: "AP-3051", customer: "Omar S.", car: "MINI Countryman 2021", service: "Oil Service", date: "May 5, 2026", time: "09:00", status: "Confirmed" },
  { id: "AP-3052", customer: "Rashid B.", car: "BMW 320i 2020", service: "Diagnostics", date: "May 5, 2026", time: "10:30", status: "Confirmed" },
  { id: "AP-3053", customer: "Hassan M.", car: "BMW M3 2023", service: "Brake Overhaul", date: "May 5, 2026", time: "14:00", status: "In Progress" },
  { id: "AP-3054", customer: "Ali T.", car: "Rolls-Royce Cullinan 2022", service: "Inspection", date: "May 5, 2026", time: "16:30", status: "Pending" },
  { id: "AP-3048", customer: "Ahmed R.", car: "BMW M4 2021", service: "Follow-up Check", date: "May 6, 2026", time: "10:00", status: "Confirmed" },
  { id: "AP-3049", customer: "Mohammed H.", car: "BMW X5 2018", service: "Suspension Alignment", date: "May 6, 2026", time: "13:00", status: "Pending" },
  { id: "AP-3050", customer: "Khalid A.", car: "BMW 7 Series 2022", service: "Software Update", date: "May 6, 2026", time: "15:30", status: "Pending" },
  { id: "AP-3045", customer: "Saeed K.", car: "MINI Cooper S 2019", service: "Transmission Check", date: "May 7, 2026", time: "11:00", status: "Confirmed" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekDates = [5, 6, 7, 8, 9, 10, 11];

export default function AppointmentsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = appointments.filter((a) =>
    filter === "all" ? true : a.status.toLowerCase() === filter
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
            Appointments
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage workshop bookings and schedules
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-cyan text-black-main px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#01A5B1] transition-colors">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      {/* Week Calendar Strip */}
      <div className="bg-black-soft border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <button className="text-white/20 hover:text-white/60 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-sm font-semibold text-white">May 2026</h2>
          <button className="text-white/20 hover:text-white/60 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => (
            <button
              key={day}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                weekDates[i] === 5 ? "bg-cyan/10 border border-cyan/20" : "hover:bg-white/5"
              }`}
            >
              <span className="text-[10px] text-white/30 font-semibold uppercase">{day}</span>
              <span className={`text-lg font-bold ${weekDates[i] === 5 ? "text-cyan" : "text-white"}`}>
                {weekDates[i]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {["all", "pending", "confirmed", "in progress", "complete"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-colors ${
              filter === f
                ? "bg-cyan text-black-main"
                : "bg-black-soft border border-white/10 text-white/40 hover:text-white/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="bg-black-soft border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] font-ui font-bold uppercase tracking-wider text-white/30 border-b border-white/5">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Vehicle</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr
                  key={apt.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-white/40">{apt.id}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-white font-semibold">
                      <Clock size={14} className="text-cyan" /> {apt.time}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-semibold">{apt.customer}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs text-white/60">
                      <Car size={14} className="text-cyan" /> {apt.car}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">{apt.service}</td>
                  <td className="px-6 py-4 text-sm text-white/40">{apt.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        apt.status === "Complete"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : apt.status === "Confirmed"
                          ? "bg-cyan/10 text-cyan"
                          : apt.status === "In Progress"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {apt.status === "Complete" ? (
                        <CheckCircle2 size={12} />
                      ) : apt.status === "Confirmed" ? (
                        <Calendar size={12} />
                      ) : apt.status === "In Progress" ? (
                        <Clock size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      {apt.status}
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
