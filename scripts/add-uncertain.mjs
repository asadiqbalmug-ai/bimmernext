import pg from "pg";
const { Client } = pg;
const client = new Client({
  host: "aws-1-ap-northeast-1.pooler.supabase.com", port: 5432,
  database: "postgres", user: "postgres.knozfodlygvjtypzawkn",
  password: "Groot@21342134", ssl: { rejectUnauthorized: false },
});
await client.connect();
await client.query(`ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS uncertain_fields JSONB DEFAULT '[]'`);
console.log("✓ uncertain_fields column added to job_cards");
await client.end();
