import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, FileText, ArrowRight, ExternalLink } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  Draft:     "bg-white/10 text-white/40",
  Sent:      "bg-blue-500/20 text-blue-300",
  Paid:      "bg-green-500/20 text-green-300",
  Overdue:   "bg-red-500/20 text-red-300",
  Cancelled: "bg-red-900/20 text-red-500",
};

export default async function InvoicesAdminPage() {
  const supabase = await createClient();
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, customer_id, items, total_amount, status, created_at, job_id")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: jobCards } = await supabase
    .from("job_cards")
    .select("id, job_number, customer_name, invoice_id")
    .is("invoice_id", null)
    .in("status", ["Ready", "Completed"])
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Invoices</h1>
          <p className="text-white/40 text-sm mt-0.5">{invoices?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0094FF] hover:text-white transition-all"
        >
          <Plus size={16} /> New Invoice
        </Link>
      </div>

      {/* Ready jobs without invoice */}
      {(jobCards?.length ?? 0) > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
          <p className="text-amber-300 text-xs font-bold tracking-widest uppercase mb-3">
            {jobCards!.length} completed job{jobCards!.length > 1 ? "s" : ""} pending invoice
          </p>
          <div className="space-y-2">
            {jobCards!.map((job) => (
              <div key={job.id} className="flex items-center justify-between">
                <span className="text-white/70 text-sm">{job.customer_name} · <span className="text-white/40 font-mono text-xs">{job.job_number}</span></span>
                <Link href={`/admin/invoices/new?job=${job.id}`} className="text-[#00C2C7] text-xs font-bold hover:underline flex items-center gap-1">
                  Create Invoice <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice list */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
        {!invoices?.length ? (
          <div className="p-16 text-center">
            <FileText size={40} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No invoices yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-xs tracking-wider uppercase">
                  <th className="text-left px-5 py-3 font-semibold">Invoice #</th>
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                  <th className="text-right px-4 py-3 font-semibold">Total (AED)</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="text-[#00C2C7] font-bold font-mono text-xs">#{inv.invoice_number}</span>
                    </td>
                    <td className="px-4 py-3.5 text-white/40 text-xs">
                      {new Date(inv.created_at).toLocaleDateString("en-AE")}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-white">
                      {Number(inv.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[inv.status] || STATUS_COLORS.Draft}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/invoice/${inv.invoice_number}`} target="_blank" className="text-white/20 hover:text-[#00C2C7] transition-colors" title="View printable invoice">
                          <ExternalLink size={14} />
                        </Link>
                      </div>
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
