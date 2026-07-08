-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Supports item 30 (free tier + Upgrade Membership). membership_type is
-- the user's CURRENT tier and changes when a free user upgrades — it is
-- no longer a safe signal for Founder eligibility. signed_up_as_member
-- is a frozen snapshot of what they chose at signup, set once and never
-- updated afterwards, so upgrading later never retroactively grants the
-- Founder badge.

alter table public.profiles
  add column if not exists signed_up_as_member boolean not null default false;

-- Backfill: existing rows predate the free tier entirely, so treat every
-- account created before this feature shipped as having "signed up as
-- member" — this preserves is_founder for anyone who already earned it
-- and avoids retroactively disqualifying existing members. Only NEW
-- signups after this migration runs will actually have this captured
-- from the signup form's membership_type choice (see
-- app/auth/signup/page.tsx).
update public.profiles set signed_up_as_member = true where created_at < now();

-- IMPORTANT: if a database trigger (e.g. handle_new_user) inserts into
-- public.profiles from auth.users' raw_user_meta_data on signup, it also
-- needs to read the new 'signed_up_as_member' key the same way it
-- already reads 'membership_type'. This migration only adds the column
-- — app/auth/signup/page.tsx's best-effort direct profiles.update() call
-- covers the gap for now, same pattern as prior signup-field migrations.
--
-- app/api/admin-profiles/route.ts (member approval) now checks this
-- field before assigning is_founder — a free-tier signup can never
-- become a Founder even while slots remain open, and upgrading via the
-- Upgrade Membership button does not change this field.
