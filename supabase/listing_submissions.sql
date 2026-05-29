create table if not exists public.listing_submissions (
  id uuid primary key,
  owner_token text,
  kind text not null check (kind in ('store', 'service', 'growth', 'business')),
  name text not null,
  type text not null,
  whatsapp text not null,
  whatsapp_normalized text,
  phone text,
  brand_color text,
  description text,
  address text not null,
  district text not null,
  google_maps_url text,
  latitude double precision,
  longitude double precision,
  image_name text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists listing_submissions_status_created_at_idx
  on public.listing_submissions (status, created_at desc);

alter table public.listing_submissions
  add column if not exists owner_token text;

alter table public.listing_submissions
  add column if not exists whatsapp_normalized text;

alter table public.listing_submissions
  add column if not exists brand_color text;

alter table public.listing_submissions
  add column if not exists google_maps_url text;

alter table public.listing_submissions
  add column if not exists latitude double precision;

alter table public.listing_submissions
  add column if not exists longitude double precision;

create index if not exists listing_submissions_owner_token_idx
  on public.listing_submissions (owner_token, created_at desc);

create index if not exists listing_submissions_whatsapp_normalized_idx
  on public.listing_submissions (whatsapp_normalized, created_at desc);

alter table public.listing_submissions enable row level security;

drop policy if exists "Service role can manage listing submissions" on public.listing_submissions;

create policy "Service role can manage listing submissions"
  on public.listing_submissions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create table if not exists public.whatsapp_otp_requests (
  id uuid primary key,
  whatsapp text not null,
  whatsapp_normalized text not null,
  code text not null,
  verification_token text,
  expires_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_otp_requests_lookup_idx
  on public.whatsapp_otp_requests (whatsapp_normalized, code, created_at desc);

create index if not exists whatsapp_otp_requests_token_idx
  on public.whatsapp_otp_requests (whatsapp_normalized, verification_token);

alter table public.whatsapp_otp_requests enable row level security;

drop policy if exists "Service role can manage WhatsApp OTP requests" on public.whatsapp_otp_requests;

create policy "Service role can manage WhatsApp OTP requests"
  on public.whatsapp_otp_requests
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
