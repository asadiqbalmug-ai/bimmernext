import { createClient } from "@/lib/supabase/server";
import StaffClient from "./staff-client";

export default async function StaffPage() {
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, email, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Staff</h1>
        <p className="text-white/40 text-sm mt-0.5">Manage team accounts</p>
      </div>
      <StaffClient staff={staff ?? []} />
    </div>
  );
}
