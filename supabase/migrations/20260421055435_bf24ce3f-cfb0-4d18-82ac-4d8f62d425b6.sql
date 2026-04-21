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

  INSERT INTO public.profiles (user_id, full_name, email, course, mobile_number, parent_name, status, payment_plan, payment_status, total_amount)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'course', '')::course_type,
    NEW.raw_user_meta_data->>'mobile_number',
    NEW.raw_user_meta_data->>'parent_name',
    CASE WHEN is_admin THEN 'approved'::approval_status ELSE 'pending'::approval_status END,
    NULLIF(NEW.raw_user_meta_data->>'payment_plan', '')::payment_plan,
    'not_paid'::payment_status,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'total_amount', '')::numeric, 0)
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_admin THEN 'admin'::app_role ELSE 'student'::app_role END);

  RETURN NEW;
END;
$function$;