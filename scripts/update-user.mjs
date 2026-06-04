import pg from "pg";
const { Client } = pg;

const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtub3pmb2RseWd2anR5cHphd2tuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk2NzI4NiwiZXhwIjoyMDkzNTQzMjg2fQ.yEEIXloDVbbbnPEMI9ToenTceM2NFr42tsrJHQpZA0A";
const BASE = "https://knozfodlygvjtypzawkn.supabase.co";
const USER_ID = "859866e1-827f-4c4b-881d-85b250d7b8bd";

// Update email + password via Admin API
const res = await fetch(`${BASE}/auth/v1/admin/users/${USER_ID}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${KEY}`,
    apikey: KEY,
  },
  body: JSON.stringify({
    email: "admin@bimmernext.ae",
    password: "bimmer123",
    email_confirm: true,
  }),
});

const body = await res.json();
if (res.ok) {
  console.log("✓ User updated:", body.email);

  // Also update profiles table
  const client = new pg.Client({
    host: "aws-1-ap-northeast-1.pooler.supabase.com",
    port: 5432, database: "postgres",
    user: "postgres.knozfodlygvjtypzawkn",
    password: "Groot@21342134",
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(
    "UPDATE profiles SET full_name='BimmerNext Admin', role='owner' WHERE id=$1",
    [USER_ID]
  );
  await client.end();
  console.log("✓ Profile updated\n");
  console.log("Login:");
  console.log("  URL:      bimmernext.ae/admin");
  console.log("  Email:    admin@bimmernext.ae");
  console.log("  Password: bimmer123");
} else {
  console.error("✗ Error:", JSON.stringify(body, null, 2));
}
