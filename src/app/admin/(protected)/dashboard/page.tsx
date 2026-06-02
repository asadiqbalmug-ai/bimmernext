import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardList, FileText, CheckCircle, Clock, Plus, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalJobs },
    { count: openJobs },
    { count: completedJobs },
    { count: totalInvoices },
    { data: recentJobs },
  ] = await Promise.all([
    supabase.from("job_cards").select("*", { count: "exact", head: true }),
    supabase.from("job_cards").select("*", { count: "exact", head: true }).in("status", ["Open", "In Progress", "Waiting Parts"]),
    supabase.from("job_cards").select("*", { count: "exact", head: true }).eq("status", "Completed"),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
    supabase.from("job_cards").select("id,job_number,customer_name,make,model,registration,status,date_in").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Total Jobs",    value: totalJobs ?? 0,     icon: ClipboardList, color: "text-[#00C2C7]",  bg: "bg-[#00C2C7]/10" },
    { label: "Active Jobs",   value: openJobs ?? 0,      icon: Clock,         color: "text-amber-400",  bg: "bg-amber-400/10" },
    { label: "Completed",     value: completedJobs ?? 0, icon: CheckCircle,   color: "text-green-400",  bg: "bg-green-400/10" },
    { label: "Invoices",      value: totalInvoices ?? 0, icon: FileText,      color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  const statusColor: Record<string, string> = {
    "Open":           "bg-blue-500/20 text-blue-300",
    "In Progress":    "bg-amber-500/20 text-amber-300",
    "Waiting Parts":  "bg-orange-500/20 text-orange-300",
    "Ready":          "bg-green-500/20 text-green-300",
    "Completed":      "bg-white/10 text-white/50",
    "Cancelled":      "bg-red-500/20 text-red-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {new Date().toLocaleDateString("en-AE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0094FF] hover:text-white transition-all"
        >
          <Plus size={16} /> New Job Card
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-white/40 text-xs font-semibold tracking-wider uppercase mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Job Cards */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white tracking-wide">Recent Job Cards</h2>
          <Link href="/admin/jobs" className="text-[#00C2C7] text-xs font-semibold flex items-center gap-1 hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {!recentJobs?.length ? (
          <div className="p-10 text-center">
            <ClipboardList size={36} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No job cards yet</p>
            <Link href="/admin/jobs/new" className="inline-flex items-center gap-2 mt-3 text-[#00C2C7] text-xs font-semibold hover:underline">
              <Plus size={12} /> Create first job card
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                href={`/admin/jobs/${job.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#00C2C7]/10 flex items-center justify-center shrink-0">
                    <ClipboardList size={16} className="text-[#00C2C7]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{job.customer_name}</p>
                    <p className="text-xs text-white/40 truncate">
                      {[job.make, job.model].filter(Boolean).join(" ")} · {job.registration || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-white/30 text-xs font-mono hidden sm:block">{job.job_number}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColor[job.status] || "bg-white/10 text-white/40"}`}>
                    {job.status}
                  </span>
                  <ArrowRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/jobs/new" className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-5 hover:border-[#00C2C7]/30 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-[#00C2C7]/10 flex items-center justify-center mb-3 group-hover:bg-[#00C2C7]/20 transition-colors">
            <ClipboardList size={20} className="text-[#00C2C7]" />
          </div>
          <p className="font-bold text-white text-sm">New Job Card</p>
          <p className="text-white/40 text-xs mt-0.5">Fill in or upload a PDF job card</p>
        </Link>
        <Link href="/admin/invoices/new" className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-5 hover:border-[#00C2C7]/30 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
            <FileText size={20} className="text-purple-400" />
          </div>
          <p className="font-bold text-white text-sm">Create Invoice</p>
          <p className="text-white/40 text-xs mt-0.5">Generate invoice from a job card</p>
        </Link>
      </div>
    </div>
  );
}
