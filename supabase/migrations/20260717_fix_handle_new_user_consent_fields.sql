-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Root-causes a bug confirmed by a live signup round-trip test: every real
-- signup on this project ends up with terms_accepted = false and
-- newsletter_opted_in = false on record, regardless of what the user
-- actually ticked, because supabase.auth.signUp() never returns an active
-- session here (email confirmation is required) — so the "best-effort"
-- follow-up .update() call in app/auth/signup/page.tsx always ran as the
-- unauthenticated `anon` Postgres role, which has never held UPDATE
-- privilege on public.profiles at all. It failed every time with 401
-- "permission denied for table profiles" (42501), silently, because the
-- app code never checked the call's returned error. Same root cause also
-- meant membership_type, profession, birth_month, birth_year, and
-- signed_up_as_member never landed either.
--
-- Fix: read all of these directly in handle_new_user() from
-- raw_user_meta_data, the same way it already reads username,
-- avatar_emoji, and location — this runs as the trigger's own privileged
-- role regardless of session state, so it can never hit the anon-grant
-- wall the client-side update did.
--
-- Deliberately does NOT set is_founder, is_approved, approved, bio,
-- created_at, or updated_at — left to their column defaults exactly as
-- before (is_founder defaults true per 20260626_add_is_founder.sql;
-- is_approved/approved default false). This repo has no psql/SQL-console
-- access from the codebase, so there is no way to read
-- handle_new_user()'s previous live source to diff against — this was
-- reconstructed from confirmed behavior (a live signup round-trip showed
-- username/avatar_emoji/location land correctly, every other metadata key
-- does not) rather than from the prior body. Worth a quick manual glance
-- at the function's current definition in the SQL Editor before running
-- this, in case it does anything beyond a plain insert into profiles that
-- this replacement would otherwise drop.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, username, avatar_emoji, location, profession,
    membership_type, signed_up_as_member, birth_month, birth_year,
    terms_accepted, newsletter_opted_in
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_emoji',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'profession',
    new.raw_user_meta_data->>'membership_type',
    coalesce((new.raw_user_meta_data->>'signed_up_as_member')::boolean, false),
    nullif(new.raw_user_meta_data->>'birth_month', '')::integer,
    nullif(new.raw_user_meta_data->>'birth_year', '')::integer,
    coalesce((new.raw_user_meta_data->>'terms_accepted')::boolean, false),
    coalesce((new.raw_user_meta_data->>'newsletter_opted_in')::boolean, false)
  );
  return new;
end;
$$;

-- Existing-data backfill, decided per-field on whether the true value is
-- actually recoverable:
--
-- terms_accepted: safe to backfill to true for every pre-existing row.
-- The signup form structurally blocks submission unless this box is
-- ticked (app/auth/signup/page.tsx's handleSubmit returns early with an
-- error otherwise) — so every existing account necessarily had it ticked
-- at signup even though the value never made it to the database. This is
-- inferring a known fact, not guessing.
update public.profiles set terms_accepted = true where created_at < now();

-- newsletter_opted_in: NOT backfilled. This is a genuine, unrecoverable
-- yes/no choice — unlike terms_accepted there is no structural constraint
-- forcing one answer, so leaving existing rows at false (the same default
-- the column already has, meaning "no assumed consent") is the only safe
-- option.
--
-- membership_type, profession, birth_month, birth_year: also NOT
-- backfilled, for the same reason as newsletter_opted_in — each is a
-- genuine per-user value (a free/member choice, free-text profession, and
-- an actual birth date) that was never persisted anywhere, so there is no
-- source to recover it from. All 5 existing profiles as of this migration
-- predate this bug's era and have every one of these fields null. Unlike
-- newsletter_opted_in there is no safe "no" default here — leaving them
-- null is a data-completeness gap, not a settled default, and the app has
-- no existing UI to let a member fill these in after signup (saveProfile
-- in app/components/Lounge.tsx only edits username/location). Flagged for
-- a product decision rather than guessed at here.
