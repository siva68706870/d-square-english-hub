DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

INSERT INTO public.user_roles (user_id, role)
SELECT
  u.id,
  CASE
    WHEN lower(coalesce(u.email, '')) IN ('preciousarun@gmail.com', 'arunkumar@dsquare.local') THEN 'admin'::public.app_role
    ELSE 'student'::public.app_role
  END
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE ur.user_id IS NULL;

INSERT INTO public.profiles (
  user_id,
  full_name,
  email,
  course,
  mobile_number,
  parent_name,
  status,
  payment_plan,
  payment_status,
  total_amount
)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(coalesce(u.email, 'Student'), '@', 1)),
  coalesce(u.email, ''),
  NULLIF(u.raw_user_meta_data->>'course', '')::public.course_type,
  u.raw_user_meta_data->>'mobile_number',
  u.raw_user_meta_data->>'parent_name',
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM public.user_roles ur
      WHERE ur.user_id = u.id
        AND ur.role = 'admin'::public.app_role
    ) THEN 'approved'::public.approval_status
    ELSE 'pending'::public.approval_status
  END,
  NULLIF(u.raw_user_meta_data->>'payment_plan', '')::public.payment_plan,
  'not_paid'::public.payment_status,
  COALESCE(NULLIF(u.raw_user_meta_data->>'total_amount', '')::numeric, 0)
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;