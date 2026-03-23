-- Add payment method column for zakat records.
ALTER TABLE public.zakat_records
ADD COLUMN IF NOT EXISTS pembayaran text;

-- Backfill existing rows.
UPDATE public.zakat_records
SET pembayaran = 'cash'
WHERE pembayaran IS NULL;

-- Set default and enforce allowed values.
ALTER TABLE public.zakat_records
ALTER COLUMN pembayaran SET DEFAULT 'cash';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'zakat_records_pembayaran_check'
  ) THEN
    ALTER TABLE public.zakat_records
    ADD CONSTRAINT zakat_records_pembayaran_check
    CHECK (pembayaran IN ('cash', 'transfer'));
  END IF;
END $$;

ALTER TABLE public.zakat_records
ALTER COLUMN pembayaran SET NOT NULL;
