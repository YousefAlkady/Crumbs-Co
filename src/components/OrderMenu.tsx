'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useProducts } from '@/hooks/useProducts';
import { addToCart } from '@/lib/cart';
import CookieCard from './CookieCard';
import { reducedMotion } from './motion/SmoothScroll';

export default function OrderMenu() {
  const { products, loading, error } = useProducts();
  const grid = useRef<HTMLDivElement>(null);

  // cards rise in one after another once the products have arrived
  useEffect(() => {
    if (!grid.current || !products.length || reducedMotion()) return;
    const t = gsap.from(grid.current.children, { y: 60, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
    return () => { t.revert(); };
  }, [products]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[28px] bg-blush/70" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] bg-blush px-6 py-16 text-center">
        <p className="text-lg font-semibold">Oops! {error}</p>
        <p className="mt-2 text-cocoa/75">Try refreshing the page.</p>
      </div>
    );
  }

  if (!products.length) return <p className="py-16 text-center text-lg">The menu is being restocked. Check back soon!</p>;

  return (
    <div ref={grid} className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => <CookieCard key={p.id} product={p} onAddToCart={addToCart} />)}
    </div>
  );
}
