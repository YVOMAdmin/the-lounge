-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Supports item 49 (Job Board auto-expiry). Closed/filled jobs are no
-- longer deleted outright — they stay visible on the calendar (greyed out
-- with a CLOSED/FILLED stamp, see app/components/Lounge.tsx) for 90 days
-- after closing, then should be purged. is_active keeps its existing
-- meaning ("counts as a live, open listing" — used by the admin panel's
-- active-jobs table and by JobListing inserts), status/closed_at are
-- additive and only meaningful once is_active is false.

alter table public.job_listings
  add column if not exists status text not null default 'open',
  add column if not exists closed_at timestamptz;

create index if not exists job_listings_closed_at_idx on public.job_listings (closed_at);

-- No automated detection (daily URL check / keyword scan / Reed API) or
-- scheduled 90-day purge is wired up yet — this migration only adds the
-- columns. Right now a job is marked closed/filled manually from the
-- admin panel (app/admin/page.tsx: "Mark Closed" / "Mark Filled" buttons),
-- which sets is_active=false, status, and closed_at=now(). Building the
-- automated checker and a cron-based purge (e.g. Vercel Cron hitting a
-- new API route that runs:
--   delete from public.job_listings where is_active = false and closed_at < now() - interval '90 days'
-- ) is a separate follow-up task.
