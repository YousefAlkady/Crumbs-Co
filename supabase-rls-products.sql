-- RLS policies for `products` table
-- Grant INSERT and UPDATE to lana.mohamedsoliman@gmail.com only
-- Run this in Supabase SQL Editor

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing admin policies if you're replacing old ones (e.g. for yoyoalk@gmail.com)
-- DROP POLICY IF EXISTS "products_insert_admin" ON products;
-- DROP POLICY IF EXISTS "products_update_admin" ON products;

-- Policy: Allow INSERT only for Lana
CREATE POLICY "products_insert_lana_admin"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() ->> 'email') = 'lana.mohamedsoliman@gmail.com'
);

-- Policy: Allow UPDATE only for Lana
CREATE POLICY "products_update_lana_admin"
ON products
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'email') = 'lana.mohamedsoliman@gmail.com'
)
WITH CHECK (
  (auth.jwt() ->> 'email') = 'lana.mohamedsoliman@gmail.com'
);

-- Ensure public SELECT for visible products (typical for menu)
-- If you need anonymous read access, add:
-- CREATE POLICY "products_select_public" ON products FOR SELECT USING (is_visible = true);
-- (Adjust based on your existing SELECT policy)
