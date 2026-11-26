import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// The live Supabase project stores the menu in `cookies` (in_stock / is_hidden), not the `products` table from schema.sql.
// Rows are mapped onto the Product shape the UI uses.
const fromCookie = (r) => ({
  // admins type {..} / (..) round descriptions; the card adds its own braces
  id: r.id, name: r.name, description: r.description?.replace(/^[{(\s]+|[})\s]+$/g, '') || null,
  image_url: r.image_url || r.images?.[0] || null,
  price: typeof r.price === 'string' ? parseFloat(r.price) : r.price,
  is_available: r.in_stock !== false, is_visible: r.is_hidden !== true,
});

/** Visible menu items.
 *  @returns {{ products: import('@/types/products').Product[], loading: boolean, error: string | null }} */
export function useProducts() {
  const [state, setState] = useState(/** @type {any} */ ({ products: [], loading: true, error: null }));
  useEffect(() => {
    let live = true;
    supabase.from('cookies').select('*').or('is_hidden.is.null,is_hidden.eq.false').order('name')
      .then(({ data, error }) => {
        if (!live) return;
        setState({ products: (data ?? []).map(fromCookie), loading: false, error: error?.message ?? null });
      });
    return () => { live = false; };
  }, []);
  return state;
}
