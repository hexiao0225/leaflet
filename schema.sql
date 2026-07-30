-- Paste this into the Neon web console SQL editor. No migration framework.

create table if not exists pieces (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,          -- Auth0 sub
  title text not null,
  type text not null check (type in ('poem', 'fiction', 'review')),
  template text not null check (template in ('broadsheet', 'reader', 'verse')),
  body text not null,
  image_url text,                 -- optional, one image max
  slug text unique not null,
  created_at timestamptz default now()
);

create index if not exists pieces_user_id_created_at_idx
  on pieces (user_id, created_at desc);
