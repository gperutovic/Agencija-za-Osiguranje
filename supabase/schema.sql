-- ==============================================================================
-- VALIANT GLOBAL RISK: ENTERPRISE RELATIONAL DATABASE SPECIFICATION (POSTGRESQL / SUPABASE)
-- Multi-carrier transactional platform DDL schema with Row-Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Commercial Accounts Table
CREATE TABLE IF NOT EXISTS commercial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  tax_id_ein TEXT NOT NULL,
  naics_code TEXT NOT NULL,
  industry_category TEXT NOT NULL,
  annual_revenue NUMERIC(14,2) NOT NULL,
  full_time_employees INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on tax_id_ein and naics_code for rapid lookup
CREATE INDEX IF NOT EXISTS idx_commercial_accounts_tax_id ON commercial_accounts(tax_id_ein);
CREATE INDEX IF NOT EXISTS idx_commercial_accounts_naics ON commercial_accounts(naics_code);

-- 2. Policies Schedule Table
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES commercial_accounts(id) ON DELETE CASCADE,
  policy_number TEXT UNIQUE NOT NULL,
  carrier_name TEXT NOT NULL,
  line_of_business TEXT NOT NULL, -- 'General Liability', 'Cyber Extortion', 'Commercial Property', 'E&O'
  aggregate_limit NUMERIC(12,2) NOT NULL,
  occurrence_limit NUMERIC(12,2) NOT NULL,
  deductible NUMERIC(10,2) NOT NULL,
  effective_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'pending_renewal', 'lapsed', 'cancelled')),
  annual_premium NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_policies_policy_number ON policies(policy_number);
CREATE INDEX IF NOT EXISTS idx_policies_account_id ON policies(account_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_expiration ON policies(expiration_date);

-- 3. Certificates of Insurance (COI) Ledger
CREATE TABLE IF NOT EXISTS coi_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  holder_name TEXT NOT NULL,
  holder_address TEXT NOT NULL,
  additional_insured BOOLEAN DEFAULT FALSE,
  waiver_subrogation BOOLEAN DEFAULT FALSE,
  special_conditions TEXT,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verification_hash TEXT UNIQUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coi_policy_id ON coi_certificates(policy_id);
CREATE INDEX IF NOT EXISTS idx_coi_verification_hash ON coi_certificates(verification_hash);

-- 4. First Notice of Loss (FNOL) Claims Table
CREATE TABLE IF NOT EXISTS claims_fnol (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  incident_type TEXT NOT NULL, -- 'Property Damage', 'Bodily Injury', 'Cyber Breach', 'Third-Party Liability'
  description TEXT NOT NULL,
  injuries_reported BOOLEAN NOT NULL DEFAULT FALSE,
  police_report_filed BOOLEAN DEFAULT FALSE,
  estimated_loss NUMERIC(12,2),
  status TEXT NOT NULL CHECK (status IN ('triaged', 'adjuster_assigned', 'under_investigation', 'settled', 'rejected')),
  assigned_adjuster TEXT,
  document_urls TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_claims_policy_id ON claims_fnol(policy_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims_fnol(status);

-- ==============================================================================
-- Row-Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE commercial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE coi_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims_fnol ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Allow public read access for verification" ON coi_certificates
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read on commercial accounts" ON commercial_accounts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on policies" ON policies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated claims submission" ON claims_fnol
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated claims read" ON claims_fnol
  FOR SELECT TO authenticated USING (true);

-- ==============================================================================
-- Sample Enterprise Seed Data
-- ==============================================================================
INSERT INTO commercial_accounts (id, company_name, tax_id_ein, naics_code, industry_category, annual_revenue, full_time_employees)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Nexus Quantum Dynamics Inc.', '12-3456789', '541512', 'Computer Systems Design Services', 18500000.00, 84),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Vanguard Biopharma Logistics LLC', '98-7654321', '493110', 'General Warehousing and Cold Storage', 42000000.00, 210)
ON CONFLICT (id) DO NOTHING;

INSERT INTO policies (id, account_id, policy_number, carrier_name, line_of_business, aggregate_limit, occurrence_limit, deductible, effective_date, expiration_date, status, annual_premium)
VALUES 
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'VGR-GL-2026-8801', 'Chubb Global Risk Syndicate 1882', 'General Liability', 2000000.00, 1000000.00, 5000.00, '2026-01-01', '2027-01-01', 'active', 14850.00),
  ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'VGR-CY-2026-9412', 'Lloyd''s of London Specialty Syndicate 2003', 'Cyber Extortion & Tech E&O', 5000000.00, 5000000.00, 25000.00, '2026-03-01', '2027-03-01', 'active', 28400.00),
  ('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'VGR-CP-2025-4421', 'AIG Commercial Risk Solutions', 'Commercial Property', 10000000.00, 10000000.00, 10000.00, '2025-10-15', '2026-10-15', 'pending_renewal', 46200.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO coi_certificates (id, policy_id, holder_name, holder_address, additional_insured, waiver_subrogation, special_conditions, verification_hash)
VALUES
  ('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Metropolitan Enterprise Hub LLC', '100 Wall Street, Suite 2400, New York, NY 10005', true, true, 'Certificate Holder is named as Additional Insured with respects to General Liability per contract.', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
ON CONFLICT (id) DO NOTHING;

INSERT INTO claims_fnol (id, policy_id, incident_date, reported_date, incident_type, description, injuries_reported, police_report_filed, estimated_loss, status, assigned_adjuster, document_urls)
VALUES
  ('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2026-02-14 10:30:00+00', '2026-02-14 14:15:00+00', 'Third-Party Liability', 'Subcontractor equipment fell and damaged warehouse dock floor during staging.', false, false, 8500.00, 'adjuster_assigned', 'Marcus Vance (Senior Commercial Adjuster - ID: ADJ-9421)', ARRAY['https://images.unsplash.com/photo-1584622650111-993a426fbf0a'])
ON CONFLICT (id) DO NOTHING;
