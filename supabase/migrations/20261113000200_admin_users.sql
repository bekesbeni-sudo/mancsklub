-- Each admin gets an own login. The shared "admin" login from the environment stays as a fallback.
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  name text not null,
  -- Empty until the admin sets a password through the emailed link.
  password_hash text,
  active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

-- One-time links for setting a password. Only a hash of each link is stored.
create table admin_password_tokens (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references admin_users (id),
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index admin_password_tokens_admin on admin_password_tokens (admin_id, created_at);

alter table admin_users enable row level security;
alter table admin_password_tokens enable row level security;
revoke all on admin_users, admin_password_tokens from anon, authenticated;
