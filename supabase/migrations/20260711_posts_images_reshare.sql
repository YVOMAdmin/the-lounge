-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Purely additive — does not touch any existing column, table, view,
-- policy, or the poll_* tables. Confirmed via a live schema check
-- (PostgREST OpenAPI description) that public.posts currently has no
-- column for image URLs or for marking/targeting a reshare, even though
-- both features (photo uploads, reshare button) are already live in
-- app/components/Lounge.tsx.

alter table public.posts
  add column if not exists images text[] not null default '{}',
  add column if not exists original_post_id uuid references public.posts(id) on delete set null;

-- A post is a reshare when original_post_id is not null (no separate
-- boolean needed). Reshare rows still need non-null content and
-- category_id to satisfy the existing NOT NULL constraints on those
-- columns — the app inserts content:'' and reuses the original post's
-- category_id for reshare rows rather than adding a new category.

create index if not exists posts_original_post_id_idx on public.posts (original_post_id);
