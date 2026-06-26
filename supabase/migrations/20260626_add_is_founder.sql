-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.

alter table public.profiles
  add column if not exists is_founder boolean not null default true;

-- Defaults to true for now since every signup during beta is a founder.
-- When beta ends, flip the column default to false (or backfill/update
-- existing rows as needed) so new signups after that point are not
-- automatically marked as founders:
--   alter table public.profiles alter column is_founder set default false;

-- IMPORTANT: if a database trigger (e.g. handle_new_user) inserts into
-- public.profiles from auth.users' raw_user_meta_data on signup, the
-- column default above covers it automatically — no trigger change is
-- required for is_founder specifically, since every row gets true by
-- default regardless of what (if anything) the trigger explicitly sets.
