-- Enable required extensions
create extension if not exists "uuid-ossp";

-- stripe_connections
create table if not exists public.stripe_connections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_api_key_encrypted text not null,
  stripe_account_name text not null default 'My SaaS',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- milestones_hit
create table if not exists public.milestones_hit (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  hit_at timestamptz default now(),
  tweet_id text,
  image_url text,
  posted boolean default false,
  created_at timestamptz default now()
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

-- RLS policies
alter table public.stripe_connections enable row level security;
alter table public.milestones_hit enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.twitter_connections enable row level security;

-- Users can only read their own data
create policy "Users own stripe_connections" on public.stripe_connections
  for all using (auth.uid() = user_id);

create policy "Users own milestones_hit" on public.milestones_hit
  for all using (auth.uid() = user_id);

create policy "Users own user_subscriptions" on public.user_subscriptions
  for all using (auth.uid() = user_id);

create policy "Users own twitter_connections" on public.twitter_connections
  for all using (auth.uid() = user_id);

-- Indexes
create index if not exists milestones_hit_user_id_idx on public.milestones_hit(user_id);
create index if not exists milestones_hit_amount_idx on public.milestones_hit(amount);
create index if not exists stripe_connections_user_id_idx on public.stripe_connections(user_id);
