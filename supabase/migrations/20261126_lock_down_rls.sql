-- Lock down RLS on the live CrumbandCo project (approved by Yousef 2026-11-26).
-- Before: anyone could read every order (names, phones, addresses); any signed-up user could edit/delete
-- cookies, update orders and upload/delete menu images. After: only profiles.is_admin = true can.
-- Customers can still read the menu and place orders.

-- 1. one admin check, used by every policy (security definer: no RLS recursion on profiles)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. both bakery admins (the live site's allow-list) are admins in the database too
update public.profiles p set is_admin = true
from auth.users u
where u.id = p.id and lower(u.email) in ('crumbncobylana@gmail.com', 'yoyoalk@gmail.com');

-- 3. cookies: public read, admin write
drop policy if exists "Admin can modify menu" on public.cookies;
drop policy if exists "Admins can manage cookies" on public.cookies;
drop policy if exists "Allow deletes for authenticated users" on public.cookies;
drop policy if exists "Allow admins to delete" on public.cookies;
drop policy if exists "Allow inserts for authenticated users" on public.cookies;
drop policy if exists "Allow admins to insert" on public.cookies;
drop policy if exists "Allow admins to update" on public.cookies;
drop policy if exists "Allow updates for authenticated users" on public.cookies;
drop policy if exists "Allow anon read cookies" on public.cookies;
drop policy if exists "Allow public read access" on public.cookies;
drop policy if exists "Allow public read access to cookies" on public.cookies;
-- keep "Public can view menu" (select, true)
create policy "cookies admin insert" on public.cookies for insert to authenticated with check (public.is_admin());
create policy "cookies admin update" on public.cookies for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "cookies admin delete" on public.cookies for delete to authenticated using (public.is_admin());

-- 4. orders: anyone may place one; only admins read, update, delete
drop policy if exists "Allow anon read orders" on public.orders;
drop policy if exists "Admins can view orders" on public.orders;
drop policy if exists "Allow admin updates" on public.orders;
-- keep "Anyone can insert orders"
create policy "orders admin read" on public.orders for select to authenticated using (public.is_admin());
create policy "orders admin update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "orders admin delete" on public.orders for delete to authenticated using (public.is_admin());
-- TEMPORARY: the live checkout does insert().select() and needs to read back the row it just created.
-- Drop this policy once the live site generates the order id itself (see docs/db-security.md).
create policy "orders read just placed (temporary)" on public.orders for select to anon, authenticated
  using (created_at > now() - interval '30 seconds');

-- 5. profiles: each user sees their own row, admins see all; nobody can grant themselves admin
drop policy if exists "Allow public read access to profiles" on public.profiles;
create policy "profiles read own or admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());

-- 6. menu images: anyone can view, only admins upload/change/delete
drop policy if exists "Allow admins to delete cookie images" on storage.objects;
drop policy if exists "Allow admins to upload cookie images" on storage.objects;
drop policy if exists "Allow admins to update cookie images" on storage.objects;
drop policy if exists "Admin Upload" on storage.objects;
create policy "cookie images admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'cookie-images' and public.is_admin());
create policy "cookie images admin update" on storage.objects for update to authenticated using (bucket_id = 'cookie-images' and public.is_admin());
create policy "cookie images admin delete" on storage.objects for delete to authenticated using (bucket_id = 'cookie-images' and public.is_admin());

-- 7. (applied as harden_handle_new_user) the signup trigger function was callable through the API
alter function public.handle_new_user() set search_path = public;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 8. (applied as drop_temporary_orders_read, after the live checkout stopped reading orders back)
drop policy if exists "orders read just placed (temporary)" on public.orders;
