-- Add payment fields to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method text, -- upi|cod
  ADD COLUMN IF NOT EXISTS payment_status text, -- pending|paid|cod
  ADD COLUMN IF NOT EXISTS payment_reference text; -- optional txn id / note

-- Optional check constraints
DO $$ BEGIN
  ALTER TABLE orders
    ADD CONSTRAINT valid_payment_status CHECK (payment_status IS NULL OR payment_status IN ('pending','paid','cod'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


