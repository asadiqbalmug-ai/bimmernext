import pg from "pg";
const { Client } = pg;

const client = new Client({
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.knozfodlygvjtypzawkn",
  password: "Groot@21342134",
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log("Connected\n");

// 1. Drop the trigger temporarily
await client.query("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users");
console.log("✓ Trigger dropped");

// 2. Add insert bypass policies for the roles that the trigger runs as
await client.query("DROP POLICY IF EXISTS profiles_service_insert ON profiles");
await client.query("DROP POLICY IF EXISTS profiles_anon_insert ON profiles");
await client.query(
  "CREATE POLICY profiles_service_insert ON profiles FOR INSERT TO service_role WITH CHECK (true)"
);
await client.query(
  "CREATE POLICY profiles_anon_insert ON profiles FOR INSERT TO anon WITH CHECK (true)"
);
console.log("✓ Bypass RLS policies added for service_role and anon");

// 3. Recreate function with correct search_path (Supabase required practice)
const fnSQL = `
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $func$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$func$;
`;

await client.query(fnSQL);
console.log("✓ handle_new_user function recreated with search_path");

// 4. Re-attach trigger
await client.query(
  "CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()"
);
console.log("✓ Trigger re-attached\n");

// 5. Now create the owner user via Auth API
console.log("Creating owner user...");
const KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtub3pmb2RseWd2anR5cHphd2tuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk2NzI4NiwiZXhwIjoyMDkzNTQzMjg2fQ.yEEIXloDVbbbnPEMI9ToenTceM2NFr42tsrJHQpZA0A";

const res = await fetch(
  "https://knozfodlygvjtypzawkn.supabase.co/auth/v1/admin/users",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
      apikey: KEY,
    },
    body: JSON.stringify({
      email: "admin@bimmernext.com",
      password: "Admin@BN2026",
      email_confirm: true,
      user_metadata: { full_name: "BimmerNext Admin", role: "owner" },
    }),
  }
);

const body = await res.json();

if (res.ok) {
  console.log("✓ User created:", body.email, "| ID:", body.id);
  // Force set role to owner
  await client.query("UPDATE profiles SET role = 'owner' WHERE id = $1", [body.id]);
  console.log("✓ Role set to owner in profiles");
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Login credentials:");
  console.log("  Email:    admin@bimmernext.com");
  console.log("  Password: Admin@BN2026");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
} else {
  console.error("✗ Auth error:", JSON.stringify(body, null, 2));
}

await client.end();
