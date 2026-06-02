-- BimmerNext Admin System — Full Schema
-- Run this in your Supabase SQL Editor (safe to re-run: uses IF NOT EXISTS)

-- Enable RLS on all tables

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  cars JSONB DEFAULT '[]',
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'VIP', 'New', 'Inactive')),
  total_jobs INTEGER DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Jobs Table
CREATE TABLE IF NOT EXISTS service_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  car_model TEXT NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Complete', 'Cancelled')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  assigned_to TEXT,
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  car_model TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'In Progress', 'Complete', 'No Show', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  job_id UUID REFERENCES service_jobs(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled')),
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (basic setup)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (admin role)
CREATE POLICY "Allow authenticated full access on customers"
  ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on service_jobs"
  ON service_jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on appointments"
  ON appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on invoices"
  ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_jobs_updated_at BEFORE UPDATE ON service_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- PROFILES  (mirrors auth.users for display)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'staff' CHECK (role IN ('owner', 'admin', 'staff', 'technician', 'receptionist')),
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_all_auth" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────────
-- JOB CARDS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Auto-generated human-readable ID  e.g. BN-2026-0001
  job_number TEXT UNIQUE NOT NULL,

  status TEXT DEFAULT 'Open'
    CHECK (status IN ('Open','In Progress','Waiting Parts','Ready','Completed','Cancelled')),
  priority TEXT DEFAULT 'Normal'
    CHECK (priority IN ('Low','Normal','High','Urgent')),

  -- ── Customer ──
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,

  -- ── Vehicle ──
  make TEXT,
  model TEXT,
  year TEXT,
  color TEXT,
  vin TEXT,
  registration TEXT,
  mileage_in INTEGER,
  mileage_out INTEGER,

  -- ── Dates ──
  date_in DATE DEFAULT CURRENT_DATE,
  estimated_completion DATE,
  date_completed DATE,

  -- ── Job detail ──
  customer_complaints TEXT,
  diagnosis TEXT,
  work_done TEXT,
  parts_notes TEXT,

  -- ── Line items: [{desc, qty, unit, amount, type: 'part'|'labour'}] ──
  items JSONB DEFAULT '[]'::jsonb,

  -- ── Totals ──
  parts_total DECIMAL(10,2) DEFAULT 0,
  labour_total DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) DEFAULT 0,

  -- ── Assignment ──
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_name TEXT,

  -- ── Attachments ──
  pdf_url TEXT,
  pdf_filename TEXT,

  -- ── Links ──
  invoice_id UUID,

  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "job_cards_all_auth" ON job_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER update_job_cards_updated_at BEFORE UPDATE ON job_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment job number:  BN-YYYY-NNNN
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  y TEXT := to_char(NOW(), 'YYYY');
  seq INT;
BEGIN
  SELECT COUNT(*) + 1 INTO seq FROM job_cards
    WHERE job_number LIKE 'BN-' || y || '-%';
  NEW.job_number := 'BN-' || y || '-' || lpad(seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS set_job_number ON job_cards;
CREATE TRIGGER set_job_number
  BEFORE INSERT ON job_cards FOR EACH ROW
  WHEN (NEW.job_number IS NULL OR NEW.job_number = '')
  EXECUTE FUNCTION generate_job_number();

-- ─────────────────────────────────────────────
-- STORAGE BUCKET for job card PDFs
-- ─────────────────────────────────────────────
-- Run manually in Supabase Dashboard → Storage → New Bucket:
--   Name: job-cards   |  Public: false
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
  VALUES ('job-cards', 'job-cards', false)
  ON CONFLICT (id) DO NOTHING;
