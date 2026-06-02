import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import JobDetailClient from "./job-detail-client";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: job }, { data: staff }] = await Promise.all([
    supabase.from("job_cards").select("*").eq("id", id).single(),
    supabase.from("profiles").select("id, full_name, role").eq("is_active", true).order("full_name"),
  ]);

  if (!job) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/jobs" className="text-white/40 hover:text-white transition-colors p-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{job.job_number}</h1>
              <StatusBadge status={job.status} />
            </div>
            <p className="text-white/40 text-sm">{job.customer_name}</p>
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
