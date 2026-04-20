-- Seed admin user Preciousarun@gmail.com with password Arun2708
-- The handle_new_user trigger will auto-create profile + admin role
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  encrypted_pw text;
BEGIN
  -- Skip if already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = 'preciousarun@gmail.com') THEN
    RAISE NOTICE 'User already exists, skipping';
    RETURN;
  END IF;

  encrypted_pw := crypt('Arun2708', gen_salt('bf'));

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'Preciousarun@gmail.com',
    encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Arun Kumar"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    format('{"sub":"%s","email":"%s"}', new_user_id, 'Preciousarun@gmail.com')::jsonb,
    'email',
    new_user_id::text,
    now(),
    now(),
    now()
  );
END $$;