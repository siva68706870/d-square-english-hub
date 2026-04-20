-- 1. Update the handle_new_user trigger to recognise the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  is_admin BOOLEAN;
BEGIN
  is_admin := lower(NEW.email) IN ('preciousarun@gmail.com', 'arunkumar@dsquare.local');

  INSERT INTO public.profiles (user_id, full_name, email, course, mobile_number, parent_name, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'course', '')::course_type,
    NEW.raw_user_meta_data->>'mobile_number',
    NEW.raw_user_meta_data->>'parent_name',
    CASE WHEN is_admin THEN 'approved'::approval_status ELSE 'pending'::approval_status END
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_admin THEN 'admin'::app_role ELSE 'student'::app_role END);

  RETURN NEW;
END;
$function$;

-- 2. Create tests catalogue
CREATE TABLE public.tests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  course course_type NULL,
  max_score numeric NOT NULL DEFAULT 100,
  test_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage tests"
  ON public.tests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can view tests"
  ON public.tests FOR SELECT
  TO authenticated
  USING (true);

CREATE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON public.tests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Link marks to a specific test (optional, keeps old data working)
ALTER TABLE public.test_marks
  ADD COLUMN test_id uuid NULL REFERENCES public.tests(id) ON DELETE SET NULL;

CREATE INDEX idx_test_marks_test_id ON public.test_marks(test_id);