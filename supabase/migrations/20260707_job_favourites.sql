-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.

create table job_favourites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references job_listings(id) on delete cascade,
  applied boolean not null default false,
  created_at timestamptz default now()
);
