-- Enums for payment plan and status
CREATE TYPE public.payment_plan AS ENUM ('monthly', 'full');
CREATE TYPE public.payment_status AS ENUM ('paid', 'not_paid');

-- Add columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN payment_plan public.payment_plan,
  ADD COLUMN payment_status public.payment_status NOT NULL DEFAULT 'not_paid';

-- Update handle_new_user to capture payment_plan from signup metadata
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

  INSERT INTO public.profiles (user_id, full_name, email, course, mobile_number, parent_name, status, payment_plan, payment_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'course', '')::course_type,
    NEW.raw_user_meta_data->>'mobile_number',
    NEW.raw_user_meta_data->>'parent_name',
    CASE WHEN is_admin THEN 'approved'::approval_status ELSE 'pending'::approval_status END,
    NULLIF(NEW.raw_user_meta_data->>'payment_plan', '')::payment_plan,
    'not_paid'::payment_status
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_admin THEN 'admin'::app_role ELSE 'student'::app_role END);

  RETURN NEW;
END;
$function$;

-- Monthly payments table
CREATE TABLE public.monthly_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL,
  month text NOT NULL, -- format: YYYY-MM
  amount numeric NOT NULL DEFAULT 0,
  status public.payment_status NOT NULL DEFAULT 'not_paid',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (student_id, month)
);

ALTER TABLE public.monthly_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all monthly payments"
ON public.monthly_payments FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Students view own monthly payments"
ON public.monthly_payments FOR SELECT
USING (auth.uid() = student_id);

CREATE TRIGGER update_monthly_payments_updated_at
BEFORE UPDATE ON public.monthly_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();