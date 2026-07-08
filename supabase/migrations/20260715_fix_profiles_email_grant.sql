-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Corrects 20260714_lockdown_profiles_rls.sql's email fix. That
-- migration's "revoke select (email) on profiles from authenticated,
-- anon" ran successfully but had no actual effect — confirmed live with
-- a temporary authenticated test user, which could still read
-- profiles.email afterwards.
--
-- Root cause: Supabase grants a blanket table-level SELECT on every
-- exposed table to authenticated/anon by default (required for
-- PostgREST + RLS to function at all). Table-level and column-level
-- grants in Postgres are additive, not subtractive — revoking a
-- column-level privilege has no effect when a broader table-level grant
-- already covers that column. The only way to actually exclude one
-- column is to revoke the table-level grant entirely and re-grant
-- SELECT explicitly on just the columns that should be visible.
--
-- Verified before writing this: no client code (grepped the whole app)
-- does select('*') on profiles or reads .email anywhere except
-- app/api/admin-profiles/route.ts, which uses the service-role key and
-- is unaffected by grants on authenticated/anon.
--
-- Column list below is exactly what's live today per a PostgREST schema
-- check (17 columns, not counting email). It does NOT include
-- signed_up_as_member — that column doesn't exist yet on this database
-- (the migration that was meant to add it, 20260710_signed_up_as_member.sql,
-- appears not to have been run — a first attempt at this file errored
-- with "column signed_up_as_member does not exist"). If you run that
-- migration later, also add signed_up_as_member to the grant list below,
-- otherwise it'll silently be unreadable by authenticated/anon.

revoke select on public.profiles from authenticated, anon;

grant select (
  id, username, avatar_emoji, location, bio, approved, created_at,
  updated_at, is_approved, membership_type, profession, birth_month,
  birth_year, is_founder, terms_accepted, newsletter_opted_in
) on public.profiles to authenticated, anon;
