// Cart lives in localStorage (same format as before: an array of products, one entry per cookie).
export function readCart() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}

export function writeCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart-update', { detail: cart.length }));
}

export function addToCart(product) {
  writeCart([...readCart(), product]);
  if (navigator.vibrate) navigator.vibrate(40);
}
