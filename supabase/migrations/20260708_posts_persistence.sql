-- Run this in the Supabase SQL Editor (Database > SQL Editor) — it is not
-- applied automatically. This repo has no Supabase CLI project linked, so
-- there's no way to run migrations from the codebase itself.
--
-- Creates real storage for Lounge feed posts, likes and comments, replacing
-- the client-side-only SEED_POSTS array in app/components/Lounge.tsx.
-- Written defensively (create + add column if not exists) since an earlier
-- migration (20260707_add_images_to_posts.sql) already assumed a
-- public.posts table would exist by the time this one runs.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid()
);

alter table public.posts
  add column if not exists user_id uuid not null references auth.users(id) on delete cascade,
  add column if not exists content text,
  add column if not exists category text,
  add column if not exists images text[] not null default '{}',
  add column if not exists is_reshare boolean not null default false,
  add column if not exists original_post_id uuid references public.posts(id) on delete set null,
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid()
);

alter table public.post_likes
  add column if not exists user_id uuid not null references auth.users(id) on delete cascade,
  add column if not exists post_id uuid not null references public.posts(id) on delete cascade,
  add column if not exists created_at timestamptz not null default now();

create unique index if not exists post_likes_user_post_idx on public.post_likes (user_id, post_id);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid()
);

alter table public.post_comments
  add column if not exists user_id uuid not null references auth.users(id) on delete cascade,
  add column if not exists post_id uuid not null references public.posts(id) on delete cascade,
  add column if not exists parent_comment_id uuid references public.post_comments(id) on delete cascade,
  add column if not exists content text not null,
  add column if not exists created_at timestamptz not null default now();

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists post_likes_post_id_idx on public.post_likes (post_id);
create index if not exists post_comments_post_id_idx on public.post_comments (post_id);
create index if not exists post_comments_parent_idx on public.post_comments (parent_comment_id);

alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;

-- Posts: any signed-in member can read, insert their own, delete their own
-- or (as admin) delete anyone's.
drop policy if exists "Members can read all posts" on public.posts;
create policy "Members can read all posts" on public.posts
  for select to authenticated using (true);

drop policy if exists "Members can insert their own posts" on public.posts;
create policy "Members can insert their own posts" on public.posts
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Members can delete their own posts" on public.posts;
create policy "Members can delete their own posts" on public.posts
  for delete to authenticated using (
    auth.uid() = user_id or auth.jwt() ->> 'email' = 'hello@theloungecommunity.co.uk'
  );

-- Likes: readable by all members (to compute counts), insert/delete own only.
drop policy if exists "Members can read all likes" on public.post_likes;
create policy "Members can read all likes" on public.post_likes
  for select to authenticated using (true);

drop policy if exists "Members can like posts" on public.post_likes;
create policy "Members can like posts" on public.post_likes
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Members can remove their own likes" on public.post_likes;
create policy "Members can remove their own likes" on public.post_likes
  for delete to authenticated using (auth.uid() = user_id);

-- Comments: readable by all members, insert own, delete own or admin.
drop policy if exists "Members can read all comments" on public.post_comments;
create policy "Members can read all comments" on public.post_comments
  for select to authenticated using (true);

drop policy if exists "Members can insert their own comments" on public.post_comments;
create policy "Members can insert their own comments" on public.post_comments
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Members can delete their own comments" on public.post_comments;
create policy "Members can delete their own comments" on public.post_comments
  for delete to authenticated using (
    auth.uid() = user_id or auth.jwt() ->> 'email' = 'hello@theloungecommunity.co.uk'
  );
