-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Run this AFTER 20260707_job_listings.sql, 20260709_job_listing_status.sql
-- and 20260707_job_favourites.sql — none of the three tables in that chain
-- exist in production yet (confirmed via PostgREST: "Could not find the
-- table 'public.job_listings'/'public.job_favourites' in the schema
-- cache"), so this is a from-scratch RLS pass rather than a fix to a live
-- gap.
--
-- Without this, both tables would come up with RLS disabled by default
-- (Supabase tables created via the SQL editor start open), which is the
-- same class of bug already found and fixed on profiles/events/suggestions:
-- any anon-key caller would be able to read and write every row.
--
-- job_listings: member-facing reads only. All writes (post/close/delete)
-- go through a service-role API route (app/api/admin-job-listings, added
-- alongside this migration) gated on the admin_auth cookie — mirroring the
-- fix already applied to events/suggestions, where the admin panel calling
-- .from(...).insert/update/delete directly with the anon key made the
-- "admin" RLS policies the only thing standing between an anonymous caller
-- and full table access. Service role bypasses RLS entirely, so no
-- insert/update/delete policy is needed or added here.
--
-- job_favourites: fully member-owned. Members can read/insert/update/
-- delete only their own rows (auth.uid() = user_id). Insert additionally
-- requires is_approved, matching the pattern used for posts/likes/replies
-- in 20260712_fix_insert_rls_use_is_approved.sql.

alter table public.job_listings enable row level security;
alter table public.job_favourites enable row level security;

drop policy if exists "Members can read all job listings" on public.job_listings;
create policy "Members can read all job listings" on public.job_listings
  for select to authenticated using (true);

drop policy if exists "Members can read their own job favourites" on public.job_favourites;
create policy "Members can read their own job favourites" on public.job_favourites
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Approved members can insert their own job favourites" on public.job_favourites;
create policy "Approved members can insert their own job favourites" on public.job_favourites
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.profiles where id = auth.uid() and is_approved = true)
  );

drop policy if exists "Members can update their own job favourites" on public.job_favourites;
create policy "Members can update their own job favourites" on public.job_favourites
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Members can delete their own job favourites" on public.job_favourites;
create policy "Members can delete their own job favourites" on public.job_favourites
  for delete to authenticated using (auth.uid() = user_id);
