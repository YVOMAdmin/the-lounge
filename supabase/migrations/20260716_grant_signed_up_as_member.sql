-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Run this AFTER both 20260710_signed_up_as_member.sql (adds the column
-- — it didn't exist yet, discovered while running today's email-grant
-- fix) and 20260715_fix_profiles_email_grant.sql (which revoked the
-- blanket table-level SELECT and re-granted only a fixed column list
-- that couldn't include signed_up_as_member yet, since it didn't exist
-- at the time).
--
-- app/components/Lounge.tsx reads signed_up_as_member for the logged-in
-- user's own profile as part of a multi-column select. Since Postgres
-- fails a query entirely if it requests even one column the role lacks
-- privilege on (not just that column silently omitted), leaving this
-- ungranted would break that fetch the same way the missing column
-- broke app/api/admin-profiles just now.

grant select (signed_up_as_member) on public.profiles to authenticated, anon;
