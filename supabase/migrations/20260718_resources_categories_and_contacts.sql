-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Wires up the previously-unused `resources` table (see the earlier
-- investigation: it had 4 rows matching the hardcoded RESOURCES array in
-- Lounge.tsx byte-for-byte, an abandoned artifact from the initial
-- prototype) and adds a new `useful_contacts` table, both now admin-
-- editable and actually fetched by the app instead of hardcoded.
--
-- `resources` currently has RLS enabled with zero policies (confirmed via
-- a live anon-key probe: SELECT returned [] rather than an error, INSERT
-- returned 401) — i.e. already fully locked down, just unused. This adds
-- the one policy it needs: authenticated members can read it. Writes are
-- intentionally not granted to anon/authenticated at all — they only
-- happen through /api/admin-resources and /api/admin-contacts, which use
-- the service-role key (bypasses RLS) and are gated by the same
-- `admin_auth` cookie check as every other admin-only route.

alter table public.resources
  add column if not exists category text not null default 'templates'
    check (category in ('templates', 'courses'));

alter table public.resources enable row level security;

create policy "resources: read for authenticated" on public.resources
  for select using (auth.role() = 'authenticated');

-- Placeholder content so the "Courses" grouping isn't empty before real
-- content is added — the 4 existing rows already default to 'templates'
-- and become the "Templates & Guides" grouping as-is.
insert into public.resources (emoji, title, description, category, position) values
  ('🎓', '[Course name]', '[Add a short description of what this course covers and who it is for]', 'courses', 5),
  ('🎓', '[Course name]', '[Add a short description of what this course covers and who it is for]', 'courses', 6);

create table if not exists public.useful_contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text,
  photo_url text,
  email text not null,
  position integer not null default 0,
  created_at timestamptz default now()
);

alter table public.useful_contacts enable row level security;

create policy "useful_contacts: read for authenticated" on public.useful_contacts
  for select using (auth.role() = 'authenticated');

insert into public.useful_contacts (name, role, bio, email, position) values
  ('[Career coach name]', 'Career Coach', '[Add a short bio here — background, specialties, how members can work with them.]', 'placeholder@example.com', 1),
  ('[Accountant name]', 'Accountant', '[Add a short bio here — background, specialties, how members can work with them.]', 'placeholder@example.com', 2),
  ('[Insurance provider name]', 'Insurance Provider', '[Add a short bio here — background, specialties, how members can work with them.]', 'placeholder@example.com', 3);
