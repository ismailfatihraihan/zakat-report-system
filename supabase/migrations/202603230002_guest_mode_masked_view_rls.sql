-- Guest mode: provide masked public read access while keeping write access for authenticated users.

ALTER TABLE public.zakat_records ENABLE ROW LEVEL SECURITY;

-- Remove any anonymous policies on the base table to prevent accidental PII reads.
DO $$
DECLARE
  policy_name text;
BEGIN
  FOR policy_name IN
    SELECT pol.policyname
    FROM pg_policies pol
    WHERE pol.schemaname = 'public'
      AND pol.tablename = 'zakat_records'
      AND 'anon' = ANY (pol.roles)
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.zakat_records', policy_name);
  END LOOP;
END $$;

-- Authenticated users keep full CRUD on base table.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'zakat_records'
      AND policyname = 'zakat_records_authenticated_select'
  ) THEN
    CREATE POLICY zakat_records_authenticated_select
      ON public.zakat_records
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'zakat_records'
      AND policyname = 'zakat_records_authenticated_insert'
  ) THEN
    CREATE POLICY zakat_records_authenticated_insert
      ON public.zakat_records
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'zakat_records'
      AND policyname = 'zakat_records_authenticated_update'
  ) THEN
    CREATE POLICY zakat_records_authenticated_update
      ON public.zakat_records
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'zakat_records'
      AND policyname = 'zakat_records_authenticated_delete'
  ) THEN
    CREATE POLICY zakat_records_authenticated_delete
      ON public.zakat_records
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Public masked dataset for guest reads.
CREATE OR REPLACE VIEW public.zakat_records_public AS
SELECT
  zr.id,
  zr.period,
  zr.penginput,
  zr.pembayaran,
  zr.tanggal,
  ('Muzakki ' || row_number() OVER (ORDER BY zr.created_at, zr.id))::text AS nama,
  ''::text AS alamat,
  zr.zakat_fitrah_jiwa_beras,
  zr.zakat_fitrah_beras_kg,
  zr.zakat_fitrah_jiwa_uang,
  zr.zakat_fitrah_uang,
  zr.zakat_maal,
  zr.infaq_beras,
  zr.infaq_uang,
  zr.fidyah_beras,
  zr.fidyah_uang,
  zr.total_beras,
  zr.total_uang,
  zr.created_at,
  zr.updated_at
FROM public.zakat_records zr;

GRANT SELECT ON public.zakat_records_public TO anon;
GRANT SELECT ON public.zakat_records_public TO authenticated;
