'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
              <span key={i} className="font-chewy flex items-center text-[clamp(28px,4vw,48px)]">
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
      <Row className="-rotate-2 border-y-4 border-chocolate bg-pastel-hotpink text-white" />
      <Row dir={-1} className="-mt-3 rotate-1 border-y-4 border-chocolate bg-mint text-chocolate" />
    </section>
  );
}
