-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.

create table job_listings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  location text not null,
  salary text,
  description text,
  url text not null,
  source text not null,
  role_category text not null,
  posted_date date not null default current_date,
  is_active boolean default true,
  created_at timestamptz default now()
);
