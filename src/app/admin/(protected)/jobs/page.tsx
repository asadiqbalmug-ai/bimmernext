import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, ClipboardList, ArrowRight } from "lucide-react";
import JobsSearch from "./jobs-search";

const STATUS_STYLES: Record<string, string> = {
  "Open":          "bg-blue-500/20 text-blue-300",
  "In Progress":   "bg-amber-500/20 text-amber-300",
  "Waiting Parts": "bg-orange-500/20 text-orange-300",
  "Ready":         "bg-green-500/20 text-green-300",
  "Completed":     "bg-white/10 text-white/40",
  "Cancelled":     "bg-red-500/20 text-red-300",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("job_cards")
    .select("id,job_number,customer_name,customer_phone,make,model,registration,vin,status,date_in,grand_total,assigned_name")
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (q) {
    query = query.or(
      `customer_name.ilike.%${q}%,registration.ilike.%${q}%,job_number.ilike.%${q}%,vin.ilike.%${q}%,make.ilike.%${q}%,model.ilike.%${q}%`
    );
  }

  const { data: jobs } = await query.limit(100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Job Cards</h1>
          <p className="text-white/40 text-sm mt-0.5">{jobs?.length ?? 0} records</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0094FF] hover:text-white transition-all"
        >
          <Plus size={16} /> New Job Card
        </Link>
      </div>

      {/* Search + filter */}
      <JobsSearch defaultQ={q} defaultStatus={status} />

      {/* Table */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
        {!jobs?.length ? (
          <div className="p-16 text-center">
            <ClipboardList size={40} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              {q || status ? "No results found." : "No job cards yet."}
            </p>
            {!q && !status && (
              <Link href="/admin/jobs/new" className="inline-flex items-center gap-2 mt-4 text-[#00C2C7] text-xs font-semibold hover:underline">
                <Plus size={12} /> Create first job card
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-xs tracking-wider uppercase">
                  <th className="text-left px-5 py-3 font-semibold">Job #</th>
                  <th className="text-left px-4 py-3 font-semibold">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Plate</th>
                  <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-semibold hidden lg:table-cell">Total</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="w-8 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="text-[#00C2C7] font-bold font-mono text-xs">{job.job_number}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-white font-semibold">{job.customer_name}</p>
                      <p className="text-white/30 text-xs">{job.customer_phone || "—"}</p>
                    </td>
                    <td className="px-4 py-3.5 text-white/60">
                      {[job.make, job.model].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-white/60 hidden md:table-cell">{job.registration || "—"}</td>
                    <td className="px-4 py-3.5 text-white/40 text-xs hidden lg:table-cell">{job.date_in || "—"}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-white hidden lg:table-cell">
                      {job.grand_total ? `${Number(job.grand_total).toLocaleString()} AED` : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[job.status] || "bg-white/10 text-white/40"}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/jobs/${job.id}`} className="text-white/20 group-hover:text-white/60 transition-colors">
                        <ArrowRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
