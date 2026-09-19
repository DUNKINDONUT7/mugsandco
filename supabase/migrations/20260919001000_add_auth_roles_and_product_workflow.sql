create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "Profiles are readable by their owner" on public.profiles;
create policy "Profiles are readable by their owner"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, display_name)
select id, coalesce(raw_user_meta_data ->> 'display_name', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

alter table public.products add column if not exists submitted_by uuid references auth.users(id) on delete set null;
alter table public.products add column if not exists status text not null default 'approved' check (status in ('pending', 'approved', 'rejected'));

update public.products set status = 'approved' where status is null;

alter table public.products enable row level security;
drop policy if exists "Products are public" on public.products;
drop policy if exists "Approved products are public" on public.products;
drop policy if exists "Users can submit products" on public.products;
drop policy if exists "Users can view their submissions" on public.products;
drop policy if exists "Users can update their pending products" on public.products;
drop policy if exists "Admins manage all products" on public.products;

create policy "Approved products are public"
  on public.products for select
  using (status = 'approved');

create policy "Users can submit products"
  on public.products for insert
  to authenticated
  with check (submitted_by = auth.uid());

create policy "Users can view their submissions"
  on public.products for select
  to authenticated
  using (submitted_by = auth.uid());

create policy "Users can update their pending products"
  on public.products for update
  to authenticated
  using (submitted_by = auth.uid() and status = 'pending')
  with check (submitted_by = auth.uid() and status = 'pending');

create policy "Admins manage all products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public product images" on storage.objects;
drop policy if exists "Authenticated users upload product images" on storage.objects;
drop policy if exists "Users manage their product images" on storage.objects;

create policy "Public product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated users upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users manage their product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
