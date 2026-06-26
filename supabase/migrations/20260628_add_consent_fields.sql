-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.

alter table public.profiles
  add column if not exists terms_accepted boolean not null default false,
  add column if not exists newsletter_opted_in boolean not null default false;

-- terms_accepted is enforced client-side at signup (the form blocks
-- submission until the checkbox is ticked) and is sent through
-- supabase.auth.signUp()'s options.data the same way as the other
-- profile fields added in earlier migrations.
--
-- IMPORTANT: if a database trigger (e.g. handle_new_user) inserts into
-- public.profiles from auth.users' raw_user_meta_data on signup, it also
-- needs to read the new 'terms_accepted' and 'newsletter_opted_in' keys
-- the same way it already reads 'username', 'avatar_emoji', etc. This
-- migration only adds the columns; it does not know that trigger's
-- current definition.
