-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Found via the RLS audit: "Admin can delete events", "Admin can update
-- events", "Admin can delete suggestions", "Admin can update
-- suggestions" are all USING (true) for roles={public} — despite the
-- name, no admin check exists at all, so any caller (including a fully
-- anonymous request) could delete or modify any event or suggestion.
--
-- This was, until now, load-bearing: app/admin/page.tsx's browser
-- client calls supabase.from('events')/.from('suggestions') directly
-- with the anon key and no real Supabase auth session (the admin panel's
-- own login is just a separate `admin_auth` cookie, unrelated to
-- Supabase auth) — these wide-open policies were the only thing making
-- admin approve/reject/delete work at all.
--
-- Fixed properly instead of just patching the policy: added
-- app/api/admin-events and app/api/admin-suggestions routes (checking
-- the admin_auth cookie server-side, using the service-role key,
-- matching the existing app/api/admin-profiles pattern) and repointed
-- app/admin/page.tsx's fetch/approve/reject functions at them. The
-- service role already bypasses RLS entirely at the connection level —
-- it needs no policy to do anything — so these four are simply dropped,
-- not replaced.
--
-- Also discovered along the way: events/suggestions only ever had a
-- "read approved only" SELECT policy, so the admin panel's old
-- anon-key fetchEvents/fetchSuggestions could never actually see
-- pending (is_approved = false) rows — confirmed live, there was a
-- real pending suggestion in the database the admin panel could not
-- display. The new GET routes (service role) fix this as a side effect.

drop policy if exists "Admin can delete events" on public.events;
drop policy if exists "Admin can update events" on public.events;
drop policy if exists "Admin can delete suggestions" on public.suggestions;
drop policy if exists "Admin can update suggestions" on public.suggestions;
