-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Root cause of the approval bug, found via pg_proc: the function
-- public.is_approved() — called by posts/likes/replies policies
-- ("posts: create", "posts: read all", "likes: toggle", "replies:
-- create", "replies: read all") — is misleadingly named. Its body is:
--
--   select approved from public.profiles where id = auth.uid();
--
-- It reads the legacy `approved` column, not the `is_approved` column
-- that app/api/admin-profiles/route.ts (the real approval flow) sets.
-- Fixing this one SECURITY DEFINER function fixes every policy that
-- calls it, in one place — no per-table policy duplication needed.
--
-- Supersedes 20260712_fix_insert_rls_use_is_approved.sql: that migration
-- added three new INSERT policies as a workaround before this root cause
-- was found. They're redundant now (the underlying policies they were
-- meant to patch around now work correctly via the fixed function) and
-- are dropped below to avoid leaving confusing duplicate policies.

create or replace function public.is_approved()
returns boolean
language sql
security definer
as $function$
  select is_approved from public.profiles where id = auth.uid();
$function$;

drop policy if exists "Approved members can insert their own posts (is_approved)" on public.posts;
drop policy if exists "Approved members can insert their own likes (is_approved)" on public.likes;
drop policy if exists "Approved members can insert their own replies (is_approved)" on public.replies;
