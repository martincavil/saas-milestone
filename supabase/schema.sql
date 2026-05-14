-- Enable required extensions
create extension if not exists "uuid-ossp";

-- stripe_connections — multiple SaaS per user allowed
create table if not exists public.stripe_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_api_key_encrypted text not null,
  stripe_account_name text not null default 'My SaaS',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
  -- no unique(user_id): one user can connect multiple SaaS
);

-- milestones_hit — extended with category
create table if not exists public.milestones_hit (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null default 'mrr', -- mrr | followers | users | visits | stars | subscribers
  amount integer not null,
  hit_at timestamptz default now(),
  tweet_id text,
  image_url text,
  posted boolean default false,
  created_at timestamptz default now()
);

-- metric_connections — tracks last known value per metric per user
create table if not exists public.metric_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,               -- mrr | followers | users | visits | stars | subscribers
  config jsonb not null default '{}',   -- { github_repo: 'user/repo', website_url: '...' }
  last_value integer not null default 0,
  last_checked_at timestamptz,
  enabled boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, category)
);

-- user_subscriptions
create table if not exists public.user_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_sub_id text,
  status text not null default 'inactive',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- twitter_connections
create table if not exists public.twitter_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  twitter_user_id text not null,
  screen_name text not null,
  access_token text not null,
  access_token_secret text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- RLS
alter table public.stripe_connections enable row level security;
alter table public.milestones_hit enable row level security;
alter table public.metric_connections enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.twitter_connections enable row level security;

create policy "Users own stripe_connections" on public.stripe_connections
  for all using (auth.uid() = user_id);

create policy "Users own milestones_hit" on public.milestones_hit
  for all using (auth.uid() = user_id);

create policy "Users own metric_connections" on public.metric_connections
  for all using (auth.uid() = user_id);

create policy "Users own user_subscriptions" on public.user_subscriptions
  for all using (auth.uid() = user_id);

create policy "Users own twitter_connections" on public.twitter_connections
  for all using (auth.uid() = user_id);

-- Indexes
create index if not exists milestones_hit_user_id_idx on public.milestones_hit(user_id);
create index if not exists milestones_hit_category_idx on public.milestones_hit(category);
create index if not exists milestones_hit_user_category_idx on public.milestones_hit(user_id, category);
create index if not exists metric_connections_user_id_idx on public.metric_connections(user_id);
create index if not exists stripe_connections_user_id_idx on public.stripe_connections(user_id);

-- Migration helper: backfill category on existing rows
-- (run manually if upgrading an existing DB)
-- update public.milestones_hit set category = 'mrr' where category is null;
