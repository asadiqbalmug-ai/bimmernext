import BulkImportClient from "./bulk-import-review-client";
import { createClient } from "@/lib/supabase/server";

export default async function BulkImportPage() {
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("is_active", true)
    .order("full_name");

  return <BulkImportClient staff={staff ?? []} />;
}
