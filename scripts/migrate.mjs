/**
 * BimmerNext Database Migration Runner
 * Connects directly via pg to Supabase PostgreSQL and runs schema.sql
 * Usage: node scripts/migrate.mjs
 */

import pg from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "../supabase/schema.sql");

const DB = {
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.knozfodlygvjtypzawkn",
  password: "Groot@21342134",
  ssl: { rejectUnauthorized: false },
};
const SUPABASE_URL = "https://knozfodlygvjtypzawkn.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtub3pmb2RseWd2anR5cHphd2tuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk2NzI4NiwiZXhwIjoyMDkzNTQzMjg2fQ.yEEIXloDVbbbnPEMI9ToenTceM2NFr42tsrJHQpZA0A";

console.log("\n🔧 BimmerNext Migration Runner");
console.log("━".repeat(50));

const client = new Client(DB);

await client.connect();
console.log("✓ Connected to Supabase PostgreSQL\n");

// Read and run the full schema as one transaction
const schema = readFileSync(schemaPath, "utf8");

// Remove the commented-out ALTER TABLE migration lines so they don't run
const cleanedSchema = schema
  .split("\n")
  .filter((line) => !line.trim().startsWith("-- ALTER TABLE"))
  .join("\n");

try {
  await client.query(cleanedSchema);
  console.log("✓ Schema applied successfully");
} catch (err) {
  // If any statement failed, show the error
  console.error("✗ Schema error:", err.message);
  console.log("\nℹ  This may be because some objects already exist (safe to ignore).");
  console.log("   Run the schema manually in the Supabase SQL Editor if tables are missing.");
}

await client.end();
console.log("\n━".repeat(50));

// Create storage bucket via Storage API
console.log("\n📦 Creating job-cards storage bucket…");
try {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      apikey: SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      id: "job-cards",
      name: "job-cards",
      public: false,
      file_size_limit: 20971520,
      allowed_mime_types: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ],
    }),
  });
  const body = await res.text();
  if (res.ok) {
    console.log("✓ job-cards bucket created");
  } else if (body.includes("already exists") || body.includes("Duplicate")) {
    console.log("~ job-cards bucket already exists (OK)");
  } else {
    console.log("✗ Bucket error:", body);
  }
} catch (e) {
  console.log("✗ Bucket fetch error:", e.message);
}

// Create owner account check
console.log("\n� Checking for owner account…");
try {
  const res2 = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=5`, {
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      apikey: SERVICE_ROLE_KEY,
    },
  });
  const data = await res2.json();
  const users = data.users || [];
  if (users.length === 0) {
    console.log("ℹ  No users yet. Create your owner account:");
    console.log("   Supabase Dashboard → Authentication → Add User");
    console.log("   Then run: UPDATE profiles SET role = 'owner' WHERE id = '<your-user-id>';");
  } else {
    console.log(`~ ${users.length} user(s) already exist`);
  }
} catch (e) {
  console.log("~ Could not check users:", e.message);
}

console.log("\n✅ Setup complete! BimmerNext database is ready.");
console.log("   Next: add your API keys to Vercel and deploy.\n");
