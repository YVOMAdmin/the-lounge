-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.

alter table public.profiles
  add column if not exists membership_type text,
  add column if not exists profession text,
  add column if not exists birth_month integer,
  add column if not exists birth_year integer;

-- profession, birth_month, and birth_year are intentionally never exposed
-- through any public-facing query in the app (only admin/profile-owner
-- access). If profiles has a public read policy (e.g. "anyone can view
-- profiles"), double check it doesn't select these columns for non-owners.

-- IMPORTANT: if a database trigger (e.g. handle_new_user) inserts into
-- public.profiles from auth.users' raw_user_meta_data on signup, it also
-- needs to be updated to read these new keys — 'membership_type',
-- 'profession', 'birth_month', 'birth_year' — the same way it already
-- reads 'username', 'avatar_emoji', and 'location'. This migration only
-- adds the columns; it does not know that trigger's current definition.
