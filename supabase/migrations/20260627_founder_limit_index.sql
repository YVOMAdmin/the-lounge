-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.

-- Supports the founder-count lookups in lib/founders.ts (used by
-- /api/founder-count and the admin approval route), which filter on both
-- is_founder and is_approved.
create index if not exists profiles_founder_approved_idx
  on public.profiles (is_founder, is_approved);

-- No new column is needed here — is_founder already exists (see
-- 20260626_add_is_founder.sql) and continues to default to true on
-- insert. Founder status is now decided authoritatively at approval
-- time instead (POST /api/admin-profiles), which counts existing
-- approved founders and sets is_founder to false once 100 is reached,
-- overwriting whatever the column default put there at signup.
