## Plan

### 1. Fix the account refresh failure at the source
- Add a backend migration that safely restores the user bootstrap flow so every new signup gets both a role and a profile automatically.
- Recreate the missing database triggers for profile/timestamp handling if they are absent.
- Backfill profile rows for existing users who currently have a role but no profile, so current admin and student accounts start working after refresh.

### 2. Make auth/profile loading resilient in the app
- Update `AuthProvider` so a missing profile does not leave the app stuck in a spinner forever.
- Return a clear fallback state for users whose account exists but whose profile is still missing or incomplete.
- Refresh role/profile data more reliably after sign-in and after page reload.

### 3. Fix protected-page refresh behavior for both admin and students
- Update `admin.tsx` and `dashboard.tsx` so they handle loading, missing-profile, and permission states cleanly.
- Prevent false redirects/spinners during the brief auth restore window after refresh.
- Keep realtime updates, but separate them from the core refresh/auth fix so the screens remain usable even before realtime fires.

### 4. Upgrade the UI to feel more interactive and premium
- Enhance the landing page hero with layered motion, animated highlights, stronger image presentation, and more engaging CTA sections.
- Add richer hover/focus/entrance effects using the existing animation utilities and Tailwind styling patterns.
- Improve cards, stats, and key surfaces in the public, admin, and student views with more visual depth, gradients, and motion feedback.

### 5. Polish mobile experience and copy consistency
- Keep the current mobile title behavior (`D Square` / `English Hub`) while improving spacing and hierarchy.
- Refresh key text so the homepage better reflects the broader offering, including AI App Development & Digital Marketing where appropriate.
- Preserve the uploaded gallery rotation timing while making the gallery controls feel more intentional.

## Expected result
- Refreshing the page will no longer break admin or student accounts.
- Existing affected users will regain access without needing to create new accounts.
- The app will look more modern, animated, and interactive instead of plain/static.

## Technical details
- Files likely updated: `src/auth/AuthProvider.tsx`, `src/routes/admin.tsx`, `src/routes/dashboard.tsx`, `src/routes/index.tsx`, `src/components/AppHeader.tsx`, `src/styles.css`.
- Backend work: one new migration to restore triggers/functions and backfill missing `profiles` rows.
- Root cause found: the backend currently has users with `user_roles` rows but no matching `profiles` rows, and the app currently treats missing profiles as a permanent loading/blocking state.