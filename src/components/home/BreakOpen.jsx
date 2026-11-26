'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { P } from '@/lib/photos';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const half = (side) => ({
  backgroundImage: `url(${P.molten.src})`, backgroundSize: '200% 100%', backgroundPosition: side === 'l' ? '0% 50%' : '100% 50%',
});

/** "Crack one open": the photo is two halves of one image; scrolling pulls them apart (scrubbed, pinned)
 *  and the words underneath rise. Phones: same split, not pinned. Reduced motion: halves start open. */
export default function BreakOpen() {
  const root = useRef(null);

  useGSAP(() => {
    // each half moves far enough to clear the headline: half the text width plus a margin, measured live
    const open = () => {
      const text = root.current.querySelector('.bo-text').offsetWidth;
      const half = root.current.querySelector('.bo-l');
      // + the inward lean of the tilted edge (sin 9deg of half the height) so the corners clear the words too
      return Math.max(half.offsetWidth * 0.6, text / 2 + 24 + half.offsetHeight * 0.08);
    };
    const mm = gsap.matchMedia();
    const build = (pinned) => {
      const tl = gsap.timeline({ scrollTrigger: pinned
        ? { trigger: root.current, start: 'top top', end: '+=120%', pin: true, scrub: 0.6, invalidateOnRefresh: true }
        : { trigger: root.current, start: 'top 75%', end: 'center center', scrub: 0.6, invalidateOnRefresh: true } });
      tl.fromTo('.bo-l', { x: 0, rotation: 0 }, { x: () => -open(), rotation: -9, ease: 'power2.inOut' }, 0)
        .fromTo('.bo-r', { x: 0, rotation: 0 }, { x: () => open(), rotation: 9, ease: 'power2.inOut' }, 0)
        .from('.bo-ln', { yPercent: 115, stagger: 0.08, ease: 'power3.out', duration: 0.5 }, 0.25)
        .from('.bo-crumb', { scale: 0, opacity: 0, stagger: 0.03, ease: 'back.out(2)', duration: 0.3 }, 0.2);
    };
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => build(true));
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => build(false));
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.bo-l', { x: () => -open(), rotation: -9 });
      gsap.set('.bo-r', { x: () => open(), rotation: 9 });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="relative flex h-screen items-center justify-center overflow-hidden bg-ink text-cream">
      <div className="bo-text relative z-0 text-center">
        <p className="kicker text-blush"><span className="mask"><span className="bo-ln ln">Crack one open</span></span></p>
        <h2 className="disp mt-4 text-[clamp(52px,10vw,160px)] leading-[0.85]">
          <span className="mask"><span className="bo-ln ln">Gooey</span></span>
          <span className="mask"><span className="bo-ln ln text-pink">all the</span></span>
          <span className="mask"><span className="bo-ln ln">way in.</span></span>
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" aria-hidden="true">
        <div className="relative flex h-[62vh] w-[min(50vh,80vw)]">
          <div className="bo-l h-full w-1/2 rounded-l-[40px] shadow-2xl" style={half('l')} />
          <div className="bo-r h-full w-1/2 rounded-r-[40px] shadow-2xl" style={half('r')} />
        </div>
        {[[18, 30], [26, 70], [70, 24], [78, 66], [50, 84], [40, 16]].map(([l, t], i) => (
          <i key={i} className="bo-crumb absolute size-3 rounded-full bg-[#7a4b2a]" style={{ left: `${l}%`, top: `${t}%` }} />
        ))}
      </div>
    </section>
  );
}
