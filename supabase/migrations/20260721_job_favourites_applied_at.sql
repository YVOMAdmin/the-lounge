-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Supports the Favourited Jobs settings view: records when a member ticks
-- "Applied" on a favourited job, not just that they did. Nullable — unset
-- whenever applied is false (including if they untick it later), set to
-- the click time when they tick it.

alter table public.job_favourites
  add column if not exists applied_at timestamptz;
