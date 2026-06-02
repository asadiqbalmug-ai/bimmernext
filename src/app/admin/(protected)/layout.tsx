import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminShell from "./admin-shell";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <AdminShell
      user={{
        email: user.email,
        name: profile?.full_name ?? undefined,
        role: profile?.role ?? "staff",
      }}
    >
      {children}
    </AdminShell>
  );
}
