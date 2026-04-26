CREATE TABLE public.mock_test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  test_number integer NOT NULL CHECK (test_number BETWEEN 1 AND 10),
  test_title text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 40,
  band_score numeric(3,1) NOT NULL DEFAULT 0,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view own attempts"
  ON public.mock_test_attempts FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students insert own attempts"
  ON public.mock_test_attempts FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students update own attempts"
  ON public.mock_test_attempts FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Admins manage all attempts"
  ON public.mock_test_attempts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER mock_test_attempts_updated_at
  BEFORE UPDATE ON public.mock_test_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_mock_test_attempts_student ON public.mock_test_attempts(student_id, created_at DESC);