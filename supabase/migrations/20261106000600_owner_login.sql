-- One-time login links for pet owners. Only a hash of each link is stored.
create table owner_login_tokens (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references owners (id),
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index owner_login_tokens_owner on owner_login_tokens (owner_id, created_at);

alter table owner_login_tokens enable row level security;
revoke all on owner_login_tokens from anon, authenticated;
