-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Bug: the existing INSERT policies on posts/likes/replies gate on
-- profiles.approved (a legacy boolean), not profiles.is_approved (the
-- column the real approval flow in app/api/admin-profiles/route.ts
-- actually sets). Confirmed live with a temporary auth user: with
-- is_approved=true and approved=false, INSERT into all three tables
-- fails with 42501 "new row violates row-level security policy";
-- setting the legacy approved=true (bypassing the real approval flow)
-- was the only thing that made it succeed. DELETE is unaffected — only
-- INSERT checks approval. As of this migration, 3 of the 5 currently
-- approved (is_approved=true) member profiles have approved=false and
-- are silently unable to post, like, or reply.
--
-- Fix approach: add a new INSERT policy per table that checks
-- is_approved instead. Postgres RLS policies for the same command are
-- PERMISSIVE by default and combined with OR, so this does not require
-- knowing or dropping whatever the existing (buggy) policy is named —
-- it simply grants insert access in addition whenever is_approved is
-- true, which is exactly what's missing. The old policy is left
-- untouched; nothing is removed or backfilled.

drop policy if exists "Approved members can insert their own posts (is_approved)" on public.posts;
create policy "Approved members can insert their own posts (is_approved)"
on public.posts
for insert
to authenticated
with check (
  author_id = auth.uid()
  and exists (select 1 from public.profiles where id = auth.uid() and is_approved = true)
);

drop policy if exists "Approved members can insert their own likes (is_approved)" on public.likes;
create policy "Approved members can insert their own likes (is_approved)"
on public.likes
for insert
to authenticated
with check (
  profile_id = auth.uid()
  and exists (select 1 from public.profiles where id = auth.uid() and is_approved = true)
);

drop policy if exists "Approved members can insert their own replies (is_approved)" on public.replies;
create policy "Approved members can insert their own replies (is_approved)"
on public.replies
for insert
to authenticated
with check (
  author_id = auth.uid()
  and exists (select 1 from public.profiles where id = auth.uid() and is_approved = true)
);
