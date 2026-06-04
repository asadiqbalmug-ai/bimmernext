import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import JobDetailClient from "./job-detail-client";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: job }, { data: staff }, { data: allIds }] = await Promise.all([
    supabase.from("job_cards").select("*").eq("id", id).single(),
    supabase.from("profiles").select("id, full_name, role").eq("is_active", true).order("full_name"),
    supabase.from("job_cards").select("id").order("created_at", { ascending: false }),
  ]);

  if (!job) notFound();

  const ids = (allIds ?? []).map((r) => r.id);
  const pos = ids.indexOf(id);
  const prevId = pos > 0 ? ids[pos - 1] : null;
  const nextId = pos < ids.length - 1 ? ids[pos + 1] : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/jobs" className="text-white/40 hover:text-white transition-colors p-1">
            <ArrowLeft size={20} />
          </Link>

          {/* Prev / Next arrows */}
          <Link
            href={prevId ? `/admin/jobs/${prevId}` : "#"}
            aria-disabled={!prevId}
            className={`p-1.5 rounded-lg transition-colors ${prevId ? "text-white/40 hover:text-white hover:bg-white/5" : "text-white/10 pointer-events-none"}`}
          >
            <ChevronLeft size={18} />
          </Link>
          <Link
            href={nextId ? `/admin/jobs/${nextId}` : "#"}
            aria-disabled={!nextId}
            className={`p-1.5 rounded-lg transition-colors ${nextId ? "text-white/40 hover:text-white hover:bg-white/5" : "text-white/10 pointer-events-none"}`}
          >
            <ChevronRight size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{job.job_number}</h1>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-white/40 text-sm">{job.customer_name}{pos >= 0 && <span className="ml-2 text-white/20">#{ids.length - pos} of {ids.length}</span>}</p>
          </div>
        </div>
        <Link
          href={`/admin/invoices/new?job=${id}`}
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0094FF] hover:text-white transition-all"
        >
          <FileText size={16} /> Create Invoice
        </Link>
      </div>

      <JobDetailClient job={job} staff={staff ?? []} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Draft":         "bg-purple-500/20 text-purple-300",
    "Open":          "bg-blue-500/20 text-blue-300",
    "In Progress":   "bg-amber-500/20 text-amber-300",
    "Waiting Parts": "bg-orange-500/20 text-orange-300",
    "Ready":         "bg-green-500/20 text-green-300",
    "Completed":     "bg-white/10 text-white/40",
    "Cancelled":     "bg-red-500/20 text-red-300",
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${map[status] || "bg-white/10 text-white/40"}`}>
      {status}
    </span>
  );
}
