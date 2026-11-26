-- Price every new order in the database (approved by Yousef 2026-11-26).
-- Browsers send items as [{id, name, price, quantity, image}]; price and total from the browser are ignored.
-- Each item's price and name come from `cookies`; total = items + 50 delivery fee (the live crumbsandco checkout's fee).
-- Hidden or out-of-stock cookies, unknown ids and bad quantities reject the order.
create or replace function public.price_order() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  it jsonb; c record; q int; subtotal numeric := 0; priced jsonb := '[]'::jsonb;
begin
  if jsonb_typeof(new.items) is distinct from 'array' or jsonb_array_length(new.items) = 0 then
    raise exception 'Order has no items';
  end if;
  for it in select value from jsonb_array_elements(new.items) loop
    q := (it->>'quantity')::int;
    if q is null or q < 1 or q > 50 then raise exception 'Invalid quantity'; end if;
    select id, name, price, in_stock, is_hidden into c from cookies where id = (it->>'id')::uuid;
    if not found or c.is_hidden is true or c.in_stock is false or c.price is null then
      raise exception '% is not available', coalesce(it->>'name', 'A cookie');
    end if;
    subtotal := subtotal + c.price * q;
    priced := priced || jsonb_build_object('id', c.id, 'name', c.name, 'price', c.price, 'quantity', q, 'image', it->'image');
  end loop;
  new.items := priced;
  new.total_amount := subtotal + 50;
  new.status := 'pending';
  return new;
end $$;
revoke execute on function public.price_order() from public, anon, authenticated;

drop trigger if exists orders_price on public.orders;
create trigger orders_price before insert on public.orders for each row execute function public.price_order();
