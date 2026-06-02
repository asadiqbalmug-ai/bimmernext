import { createClient } from "@/lib/supabase/server";
import NewJobForm from "./new-job-form";

export default async function NewJobPage() {
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("is_active", true)
    .order("full_name");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">New Job Card</h1>
        <p className="text-white/40 text-sm mt-0.5">Upload a PDF or fill in manually</p>
      </div>
      <NewJobForm staff={staff ?? []} />
    </div>
  );
}
