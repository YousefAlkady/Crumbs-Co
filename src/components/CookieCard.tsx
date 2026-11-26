'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { Plus } from 'lucide-react';
import type { Product } from '@/types/products';
import { reducedMotion } from '@/components/motion/SmoothScroll';

interface CookieCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

/** Photo-first cookie card. Adding flies a copy of the photo into the nav cart pill. */
export default function CookieCard({ product, onAddToCart, className = '' }: CookieCardProps) {
  const img = useRef<HTMLDivElement>(null);
  const available = product.is_available;

  function add() {
    onAddToCart(product);
    const from = img.current, to = document.querySelector('[data-cart-pill]');
    if (!from || !to || reducedMotion()) return;
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const ghost = from.cloneNode(true) as HTMLElement;
    Object.assign(ghost.style, { position: 'fixed', left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, zIndex: '95', pointerEvents: 'none', margin: '0' });
    document.body.appendChild(ghost);
    gsap.to(ghost, {
      x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2),
      scale: 0.08, rotation: 200, borderRadius: '50%', duration: 0.75, ease: 'power3.in', onComplete: () => ghost.remove(),
    });
  }

  return (
    <article className={`group flex flex-col ${className}`} data-cursor={available ? 'grab one' : undefined}>
      <div ref={img} className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-blush">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] ${!available ? 'grayscale' : ''}`} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-7xl" aria-hidden>🍪</div>
        )}
        {!available && (
          <span className="disp absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-xl bg-cocoa px-5 py-3 text-3xl text-cream">Sold out</span>
        )}
        {available && (
          <button onClick={add} aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-4 right-4 flex size-14 items-center justify-center rounded-full bg-cocoa text-cream shadow-soft transition-transform duration-300 hover:scale-110 hover:bg-pink-deep active:scale-95">
            <Plus className="size-6" />
          </button>
        )}
      </div>
      <div className="mt-4 px-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="disp text-[26px] leading-[0.95] text-pink-deep">{product.name}</h3>
          <span className="disp shrink-0 text-xl">{product.price} L.E.</span>
        </div>
        <div>
          {product.description && <p className="mt-2 text-[15px] leading-snug text-cocoa/75">{`{${product.description}}`}</p>}
        </div>
      </div>
    </article>
  );
}
