-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Supports showing work arrangement (Remote / Hybrid / Office-based) on the
-- Job Board calendar post-it. Nullable text rather than an enum/constraint
-- — the admin form (app/admin/page.tsx, JOB_WORK_TYPES) is the only writer
-- and already constrains it to those three values; existing rows predate
-- this field and are left null (unknown), not guessed at.

alter table public.job_listings
  add column if not exists work_type text;
