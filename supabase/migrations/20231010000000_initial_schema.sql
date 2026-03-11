-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create photos table
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  storage_path_full text not null,
  storage_path_thumb text not null,
  public_url_full text not null,
  public_url_thumb text not null,
  starred boolean not null default false,
  housed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Create site_content table
create table public.site_content (
  key text primary key,
  value text not null
);

-- Seed initial about_text
insert into public.site_content (key, value) values ('about_text', 'Welcome to Luxembourg Explorer.');

-- Create contact_messages table
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamptz not null default now()
);

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Create helper function to check if user is admin
create or replace function public.is_admin(uid uuid)
returns boolean as $$
declare
  admin_status boolean;
begin
  select is_admin into admin_status from public.profiles where id = uid;
  return coalesce(admin_status, false);
end;
$$ language plpgsql security definer;

-- Enable Row Level Security
alter table public.photos enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;
alter table public.profiles enable row level security;

-- RLS Policies for photos
create policy "Public can view photos"
  on public.photos for select
  using (true);

create policy "Admins can insert photos"
  on public.photos for insert
  with check (public.is_admin(auth.uid()));

create policy "Admins can update photos"
  on public.photos for update
  using (public.is_admin(auth.uid()));

create policy "Admins can delete photos"
  on public.photos for delete
  using (public.is_admin(auth.uid()));

-- RLS Policies for site_content
create policy "Public can view site content"
  on public.site_content for select
  using (true);

create policy "Admins can update site content"
  on public.site_content for update
  using (public.is_admin(auth.uid()));

create policy "Admins can insert site content"
  on public.site_content for insert
  with check (public.is_admin(auth.uid()));

-- RLS Policies for contact_messages
create policy "Public can insert contact messages"
  on public.contact_messages for insert
  with check (true);

create policy "Admins can view contact messages"
  on public.contact_messages for select
  using (public.is_admin(auth.uid()));

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin(auth.uid()));

create policy "Admins can update profiles"
  on public.profiles for update
  using (public.is_admin(auth.uid()));

-- Storage Policies for 'photos' bucket
-- Note: You must create the 'photos' bucket manually in the Supabase dashboard or via SQL if supported.
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict do nothing;

create policy "Public can view photos in storage"
  on storage.objects for select
  using ( bucket_id = 'photos' );

create policy "Admins can upload photos to storage"
  on storage.objects for insert
  with check ( bucket_id = 'photos' and public.is_admin(auth.uid()) );

create policy "Admins can update photos in storage"
  on storage.objects for update
  using ( bucket_id = 'photos' and public.is_admin(auth.uid()) );

create policy "Admins can delete photos from storage"
  on storage.objects for delete
  using ( bucket_id = 'photos' and public.is_admin(auth.uid()) );

-- Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, is_admin)
  values (new.id, false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
