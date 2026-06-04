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

// Check tables
const tables = await client.query(
  `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`
);
console.log("Tables:", tables.rows.map((r) => r.tablename).join(", ") || "NONE");

// Check triggers on auth.users
const triggers = await client.query(
  `SELECT tgname, proname FROM pg_trigger t JOIN pg_proc p ON t.tgfoid=p.oid WHERE t.tgrelid='auth.users'::regclass`
);
console.log("Auth triggers:", triggers.rows.map((r) => `${r.tgname}→${r.proname}`).join(", ") || "NONE");

// Check the handle_new_user function exists
const fn = await client.query(
  `SELECT prosrc FROM pg_proc WHERE proname='handle_new_user'`
);
console.log("handle_new_user function:", fn.rows.length ? "EXISTS" : "MISSING");

// Try creating a user directly via Supabase Auth API
console.log("\nCreating owner user via Auth API...");
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtub3pmb2RseWd2anR5cHphd2tuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk2NzI4NiwiZXhwIjoyMDkzNTQzMjg2fQ.yEEIXloDVbbbnPEMI9ToenTceM2NFr42tsrJHQpZA0A";

const res = await fetch("https://knozfodlygvjtypzawkn.supabase.co/auth/v1/admin/users", {
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
    user_metadata: { full_name: "Admin", role: "owner" },
  }),
});

const body = await res.json();
if (res.ok) {
  console.log("User created! ID:", body.id);
  // Now set role to owner in profiles
  await client.query(
    `UPDATE profiles SET role='owner' WHERE id=$1`,
    [body.id]
  );
  console.log("Role set to owner in profiles.");
} else {
  console.log("Auth API error:", JSON.stringify(body, null, 2));
}

await client.end();
