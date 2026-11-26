'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChefHat, Package, Truck, Cookie } from 'lucide-react';
import { reducedMotion } from '@/components/motion/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const FLAVOURS = ['Brown butter', 'Sea salt', 'Oreo bits', 'Molten ganache', 'Pretzel party', 'Midnight & milk', 'White chocolate'];

/** Endless row that drifts on its own and speeds up with scroll velocity (direction follows the scroll). */
function Row({ dir = 1, className = '' }) {
  const track = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = track.current;
    const setX = gsap.quickSetter(el, 'xPercent');
    const wrap = gsap.utils.wrap(-50, 0);
    let x = 0, boost = 0, sign = 1;
    const st = ScrollTrigger.create({
      onUpdate: (self) => { sign = self.direction; boost = Math.min(8, Math.abs(self.getVelocity()) / 300); },
    });
    const tick = (_t, dt) => {
      boost *= 0.92; // velocity kick fades out
      x = wrap(x - dir * sign * (1 + boost) * dt * 0.0018);
      setX(x);
    };
    gsap.ticker.add(tick);
    return () => { st.kill(); gsap.ticker.remove(tick); };
  }, [dir]);
  const items = [...FLAVOURS, ...FLAVOURS];
  return (
    <div className={`marquee py-4 ${className}`}>
      <div ref={track} className="marquee-track">
        {[0, 1].map((k) => (
          <span key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((f, i) => (
              <span key={i} className="disp flex items-center text-[clamp(34px,5vw,64px)]">
                <span className="px-6">{f}</span><span className="text-[0.6em]">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FlavourMarquee() {
  return (
    <section aria-label="Flavours" className="relative z-10 -my-6 overflow-hidden py-10">
      <Row className="-rotate-2 bg-pink text-cream" />
      <Row dir={-1} className="-mt-3 rotate-1 bg-cobalt text-cream" />
    </section>
  );
}

const FEATURES = [
  { Icon: Cookie, title: 'Brown butter base', text: 'Every cookie starts from a brown butter dough.' },
  { Icon: ChefHat, title: 'Baked by Lana', text: 'Made by hand, one batch at a time.' },
  { Icon: Package, title: 'Box of 2 or more', text: 'Mix your favourites. Minimum order is a box of 2.' },
  { Icon: Truck, title: 'Delivered to you', text: 'Order online, pay cash on delivery.' },
];

/** Feature row in the style of the vercel.com/ai-sdk feature grid: small icon + label, one line, hairline dividers. */
export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div data-reveal="stagger" className="grid grid-cols-1 border-y border-cocoa/15 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ Icon, title, text }) => (
          <div key={title} className="border-cocoa/15 p-7 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0 [&:not(:last-child)]:border-b sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0">
            <div className="flex items-center gap-2.5 text-pink-deep"><Icon className="size-5" /><span className="kicker">{title}</span></div>
            <p className="mt-3 text-lg leading-snug">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
