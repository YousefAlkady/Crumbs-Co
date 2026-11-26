'use client';
import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { addToCart } from '@/lib/cart';
import CookieCard from '@/components/CookieCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TITLE = 'THE MENU';
// width also follows window height so the pinned strip fits short / zoomed-in screens
const CARD = 'w-[78vw] max-w-[340px] md:w-[clamp(200px,calc((100svh-280px)*0.72),340px)]';

/** Portfolio "experience strip": on wide screens the section pins and vertical scroll slides the cookies sideways,
 *  while the title's letters ride a weight wave. Phones and reduced motion: a plain swipe row. */
export default function MenuStrip() {
  const { products, loading } = useProducts();
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(() => {
    if (loading) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (min-height: 520px) and (prefers-reduced-motion: no-preference)', () => {
      const t = track.current, el = root.current;
      const dist = () => Math.max(0, t.scrollWidth - innerWidth + 64);
      const letters = gsap.utils.toArray('.mq i', el);
      const sweep = (p) => letters.forEach((l, i) => { l.style.fontWeight = String(Math.round(500 + 300 * Math.sin(p * Math.PI * 4 - i * 0.45))); });
      gsap.to(t, {
        x: () => -dist(), ease: 'none',
        // created after the cookies load, i.e. after the pins below it: refreshPriority makes it measure first,
        // so the sections underneath place themselves after its pinned scroll distance
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, refreshPriority: 1, onUpdate: (s) => sweep(s.progress) },
      });
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => mm.revert();
  }, { dependencies: [loading, products.length], scope: root });

  return (
    <section id="menu" ref={root} className="relative overflow-hidden bg-blush py-16 md:flex md:min-h-screen md:flex-col md:justify-center md:py-12">
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-5 md:px-8">
        <div>
          <p className="kicker text-pink-deep">Fresh this week</p>
          <h2 className="mq disp mt-3 text-[clamp(48px,min(9vw,13vh),140px)]" aria-label={TITLE}>
            {TITLE.split('').map((c, i) => <i key={i} className="not-italic" aria-hidden="true">{c}</i>)}
          </h2>
        </div>
        <Link href="/order" className="btn-pill ghost hidden shrink-0 sm:inline-flex" data-magnetic>Full menu <ArrowRight className="size-5" /></Link>
      </div>

      <div className="swipe mt-6 md:mt-[4vh] md:overflow-visible">
        <div ref={track} className="flex w-max gap-6 px-5 md:gap-8 md:px-8">
          {loading && [0, 1, 2, 3].map((i) => <div key={i} className={`aspect-[4/5] ${CARD} animate-pulse rounded-[28px] bg-cream/70`} />)}
          {products.map((p) => <CookieCard key={p.id} product={p} onAddToCart={addToCart} className={CARD} />)}
          {!loading && (
            <Link href="/order" className={`flex aspect-[4/5] ${CARD} flex-col items-center justify-center gap-4 rounded-[28px] bg-cocoa text-cream`} data-cursor="open menu">
              <span className="disp text-5xl text-center leading-[0.9]">See<br />everything</span>
              <ArrowRight className="size-8" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
