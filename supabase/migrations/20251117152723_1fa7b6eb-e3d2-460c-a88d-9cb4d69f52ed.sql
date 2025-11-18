-- Create table for honeymoon email opt-ins
create table public.honeymoon_emails (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  email text not null,
  created_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.honeymoon_emails enable row level security;

-- Create policy to allow anyone to insert (public form)
create policy "Anyone can opt-in to honeymoon updates"
  on public.honeymoon_emails
  for insert
  with check (true);

-- Create policy for you to view all opt-ins
create policy "Admins can view all opt-ins"
  on public.honeymoon_emails
  for select
  using (true);