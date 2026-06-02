import { createClient } from "@/lib/supabase/server";
import NewInvoiceClient from "./new-invoice-client";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string }>;
}) {
  const { job: jobId } = await searchParams;
  const supabase = await createClient();

  let job = null;
  if (jobId) {
    const { data } = await supabase.from("job_cards").select("*").eq("id", jobId).single();
    job = data;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Invoice</h1>
        <p className="text-white/40 text-sm mt-0.5">
          {job ? `From job card ${job.job_number}` : "Fill in details below"}
        </p>
      </div>
      <NewInvoiceClient prefillJob={job} />
    </div>
  );
}
