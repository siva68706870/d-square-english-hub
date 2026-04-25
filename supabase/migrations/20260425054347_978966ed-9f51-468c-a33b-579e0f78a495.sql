
-- 1. Recreate signup trigger function (idempotent, robust to missing fields)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_admin BOOLEAN;
BEGIN
  is_admin := lower(coalesce(NEW.email, '')) IN ('preciousarun@gmail.com', 'arunkumar@dsquare.local');

  INSERT INTO public.profiles (
    user_id, full_name, email, course, mobile_number, parent_name,
    status, payment_plan, payment_status, total_amount
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(coalesce(NEW.email, 'Student'), '@', 1)),
    coalesce(NEW.email, ''),
    NULLIF(NEW.raw_user_meta_data->>'course', '')::course_type,
    NEW.raw_user_meta_data->>'mobile_number',
    NEW.raw_user_meta_data->>'parent_name',
    CASE WHEN is_admin THEN 'approved'::approval_status ELSE 'pending'::approval_status END,
    NULLIF(NEW.raw_user_meta_data->>'payment_plan', '')::payment_plan,
    'not_paid'::payment_status,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'total_amount', '')::numeric, 0)
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_admin THEN 'admin'::app_role ELSE 'student'::app_role END)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- 2. Recreate signup trigger (drop if exists, then create)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Recreate profile updated_at trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Backfill profiles for any auth user that doesn't have one yet
INSERT INTO public.profiles (
  user_id, full_name, email, course, mobile_number, parent_name,
  status, payment_plan, payment_status, total_amount
)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(coalesce(u.email, 'Student'), '@', 1)),
  coalesce(u.email, ''),
  NULLIF(u.raw_user_meta_data->>'course', '')::course_type,
  u.raw_user_meta_data->>'mobile_number',
  u.raw_user_meta_data->>'parent_name',
  CASE
    WHEN lower(coalesce(u.email, '')) IN ('preciousarun@gmail.com', 'arunkumar@dsquare.local')
      THEN 'approved'::approval_status
    ELSE 'pending'::approval_status
  END,
  NULLIF(u.raw_user_meta_data->>'payment_plan', '')::payment_plan,
  'not_paid'::payment_status,
  COALESCE(NULLIF(u.raw_user_meta_data->>'total_amount', '')::numeric, 0)
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

-- 5. Backfill missing roles for any auth user
INSERT INTO public.user_roles (user_id, role)
SELECT
  u.id,
  CASE
    WHEN lower(coalesce(u.email, '')) IN ('preciousarun@gmail.com', 'arunkumar@dsquare.local')
      THEN 'admin'::app_role
    ELSE 'student'::app_role
  END
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;
