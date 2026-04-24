-- Enable Realtime for tables used by admin/student dashboards
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.monthly_payments REPLICA IDENTITY FULL;
ALTER TABLE public.attendance REPLICA IDENTITY FULL;
ALTER TABLE public.test_marks REPLICA IDENTITY FULL;
ALTER TABLE public.tests REPLICA IDENTITY FULL;
ALTER TABLE public.commissions REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.monthly_payments; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.test_marks; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.tests; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.commissions; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;