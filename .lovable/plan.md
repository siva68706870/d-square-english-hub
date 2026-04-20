

## The problem

The admin email `Preciousarun@gmail.com` has never been registered. The trigger that assigns admin role only runs when a *new* user signs up with that email — it doesn't retroactively create the account. So login fails with "Invalid login credentials" because the user simply doesn't exist.

The old admin (`arunkumar@dsquare.local` / `Arun2708`) does exist and still works.

## Two ways to fix — pick one

**Option A — Just sign up Preciousarun@gmail.com via the Admission tab (no code needed)**
1. Go to the Admission tab on the login page.
2. Sign up with email `Preciousarun@gmail.com` and any password you want (the trigger will auto-assign admin role + auto-approve because the email matches the admin list).
3. Fill the other required fields with anything (full name "Arun Kumar", course IELTS, mobile, parent name — they're required by the form but don't matter for an admin).
4. Sign in with that email + the password you just chose.

This is fastest and needs no migration.

**Option B — Seed Preciousarun@gmail.com directly into the database via migration**

Create a one-time SQL migration that:
1. Inserts a new auth user with email `Preciousarun@gmail.com`, password `Arun2708`, email pre-confirmed.
2. The existing `handle_new_user` trigger fires automatically and creates the profile + admin role.

After approval I'll run this migration. Result: you can immediately log in with `Preciousarun@gmail.com` / `Arun2708` without manually signing up.

## My recommendation

**Option B** — since you specifically want those exact credentials. Option A would still work but you'd have to choose a different password during signup (and also fill placeholder fields).

Tell me **A** or **B** and I'll proceed.

