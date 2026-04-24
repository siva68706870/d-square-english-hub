# Live updates in Admin Console (no manual refresh)

## What's happening today
The admin console already uses TanStack Query and invalidates the cache after admin's *own* mutations. The reason you have to refresh is that when **someone else** changes data — most importantly when a new student submits the admission form, or a payment row is added in another tab/device — your open admin window has no signal that the database changed.

## The fix
Enable **Supabase Realtime** on the relevant tables and subscribe from the admin page. Whenever a row is inserted/updated/deleted, we invalidate the matching TanStack Query key, which triggers an immediate refetch — your UI updates within ~1 second, no refresh needed.

## Step 1 — Database migration
Add the affected tables to the `supabase_realtime` publication and set `REPLICA IDENTITY FULL` (so we get full row data on updates/deletes):

- `profiles` (new admissions, edits, status changes)
- `monthly_payments`
- `attendance`
- `test_marks`
- `tests`
- `commissions`

## Step 2 — Realtime subscription hook
Create `src/hooks/useRealtimeInvalidate.ts`. Given a table name and a query key, it:
1. Subscribes to all `postgres_changes` on that table
2. On any event, calls `queryClient.invalidateQueries({ queryKey })`
3. Cleans up the channel on unmount

## Step 3 — Wire it into the admin tabs
In `src/routes/admin.tsx`, call the hook once per tab (or once at the top of `AdminPage`):
- `profiles` → `["students"]`
- `monthly_payments` → `["monthly_payments"]` (invalidate the parent key so all student-scoped variants refetch)
- `attendance` → `["attendance"]`
- `test_marks` → `["marks"]`
- `tests` → `["tests"]`
- `commissions` → `["commissions_history"]` and `["commissions", dateStr]`

Also wire it into `src/routes/dashboard.tsx` so a student sees their own marks/attendance/payments update live when the admin enters them.

## Result
- New student signs up via admission → appears in your Students tab automatically
- You mark a payment / attendance / mark on one device → other open tabs and the student's dashboard update on their own
- No page refresh needed anywhere

## Files touched
- New: `supabase/migrations/<timestamp>_enable_realtime.sql`
- New: `src/hooks/useRealtimeInvalidate.ts`
- Edit: `src/routes/admin.tsx` (add hook calls)
- Edit: `src/routes/dashboard.tsx` (add hook calls for the student view)
