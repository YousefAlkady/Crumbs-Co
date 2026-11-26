/**
 * Crumb & Co. - Product schema types
 * Shape the UI uses; mapped from the live `cookies` table in src/hooks/useProducts.js
 */
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  /** Whether the product is visible on the menu */
  is_visible: boolean;
  /** Whether the product can be added to cart (e.g. not sold out) */
  is_available: boolean;
}
