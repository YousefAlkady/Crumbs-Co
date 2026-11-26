'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { P } from '@/lib/photos';
import { Star, LoopArrow, Crumbs } from '@/components/Doodles';
import { lenisRef, reducedMotion } from '@/components/motion/SmoothScroll';

const WORD = 'COOKIES';
const TAGLINE = 'Sharing joy, crumb by crumb.';

/** First visit per session: the badge spins in, the wordmark rises, a 0-100 "baking" count, then the cover wipes up. */
function Preloader({ onDone }) {
  const root = useRef(null);
  const count = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem('intro-seen'); } catch {}
    if (seen || reducedMotion()) { setGone(true); onDone(); return; }
    lenisRef.current?.stop();
    const q = gsap.utils.selector(root.current);
    const n = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => {
      try { sessionStorage.setItem('intro-seen', '1'); } catch {}
      lenisRef.current?.start();
      setGone(true);
    } })
      .fromTo(q('.pl-badge'), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)' }, 0)
      .fromTo(q('.pl-name i'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out' }, 0.2)
      .to(n, { v: 100, duration: 1.5, ease: 'power1.inOut', onUpdate: () => { if (count.current) count.current.textContent = Math.round(n.v); } }, 0)
      .add(onDone, 1.55)
      .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power4.inOut' }, 1.6);
    return () => { tl.kill(); lenisRef.current?.start(); };
  }, [onDone]);

  if (gone) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-6 bg-pink text-cream" style={{ clipPath: 'inset(0 0 0 0)' }}>
      <Image src="/instagram/logo-badge.jpg" alt="" width={110} height={110} className="pl-badge rounded-full ring-4 ring-cream" priority />
      <p className="pl-name script mask text-[clamp(48px,9vw,110px)] leading-none">
        {'Crumb & Co.'.split('').map((c, i) => <i key={i} className="inline-block not-italic">{c === ' ' ? ' ' : c}</i>)}
      </p>
      <p className="kicker">baking… <span ref={count} className="tabular-nums">0</span></p>
    </div>
  );
}

export default function Hero() {
  const root = useRef(null);
  const [ready, setReady] = useState(false);
  const onIntroDone = useCallback(() => setReady(true), []);

  // intro: lines rise out of their masks, photos scale in
  useEffect(() => {
    if (!ready || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.hero-ln', { yPercent: 115, duration: 1.1, stagger: 0.09, ease: 'power4.out' })
        .from('.hero-photo', { scale: 0.85, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out' }, 0.1)
        .from('.hero-fade', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.45);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // tagline words slide away from the pointer and settle back (portfolio "cursor repel")
  useEffect(() => {
    if (reducedMotion() || !matchMedia('(pointer: fine)').matches) return;
    const words = gsap.utils.toArray('.repel i', root.current);
    const movers = words.map((w) => ({ w, x: gsap.quickTo(w, 'x', { duration: 0.6, ease: 'power3' }), y: gsap.quickTo(w, 'y', { duration: 0.6, ease: 'power3' }), r: gsap.quickTo(w, 'rotation', { duration: 0.6, ease: 'power3' }) }));
    // skip the per-word layout reads once the hero is scrolled away
    const repel = (e) => root.current.getBoundingClientRect().bottom > 0 && movers.forEach(({ w, x, y, r }) => {
      const b = w.getBoundingClientRect();
      const cx = b.left + b.width / 2 - gsap.getProperty(w, 'x'), cy = b.top + b.height / 2 - gsap.getProperty(w, 'y');
      const dx = cx - e.clientX, dy = cy - e.clientY, d = Math.hypot(dx, dy), R = 140;
      const f = d < R ? (1 - d / R) ** 2 * 60 : 0;
      x(d ? (dx / d) * f : 0); y(d ? (dy / d) * f : 0); r(d ? (dx / d) * f * 0.25 : 0);
    });
    window.addEventListener('pointermove', repel, { passive: true });
    return () => window.removeEventListener('pointermove', repel);
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden">
      <Preloader onDone={onIntroDone} />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-8 md:grid-cols-[1.1fr_1fr] md:px-8 md:pb-24 md:pt-14">
        <div className="relative z-10">
          <p className="hero-fade kicker text-pink-deep">by Lana · fresh cookies, delivered</p>
          <h1 className="disp mt-5 text-[clamp(64px,9vw,150px)] text-cocoa">
            <span className="mask"><span className="hero-ln ln">Crumb</span></span>
            <span className="mask"><span className="hero-ln ln">&amp; Co.</span></span>
            <span className="mask"><span className="hero-ln ln sweep whitespace-nowrap text-pink" aria-label={WORD}>
              {WORD.split('').map((c, i) => <i key={i} style={{ '--i': i }} aria-hidden="true">{c}</i>)}
            </span></span>
          </h1>
          <p className="hero-fade repel mt-6 text-2xl md:text-3xl font-medium">
            <span className="sr-only">{TAGLINE}</span>
            {TAGLINE.split(' ').map((w, i) => <i key={i} className="mr-[0.28em] inline-block not-italic" aria-hidden="true">{w}</i>)}
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3">
            <Link href="/order" className="btn-pill solid text-base" data-magnetic data-cursor="pick a box">
              Order a box <ArrowRight className="size-5" />
            </Link>
            <a href="#menu" className="btn-pill ghost text-base">See the menu</a>
          </div>
          <p className="hero-fade mt-5 text-sm text-cocoa/70">Minimum order is a box of 2</p>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
          <div data-parallax="0.12" className="hero-photo absolute inset-0 overflow-hidden rounded-t-full rounded-b-[40px] bg-blush shadow-soft">
            <Image src={P.nutella.src} alt={P.nutella.alt} fill priority sizes="(min-width: 768px) 520px, 90vw" className="object-cover" />
          </div>
          <div data-parallax="-0.18" className="hero-photo absolute -bottom-8 -left-6 w-[42%] overflow-hidden rounded-full border-[6px] border-cream shadow-soft md:-left-14">
            <Image src={P.molten.src} alt={P.molten.alt} width={P.molten.w} height={P.molten.h} sizes="240px" className="aspect-square object-cover" />
          </div>
          <Star className="doodle spin-slow -right-4 -top-6 w-20 md:w-28" />
          <Star className="doodle spin-slow -right-10 top-32 w-12 [animation-direction:reverse]" />
          <div data-parallax="0.3" className="absolute -left-24 top-10 hidden w-56 lg:block">
            <p className="script -rotate-6 text-2xl text-cobalt">molten middle</p>
            <LoopArrow className="mt-1 w-44 text-cobalt" />
          </div>
          <Crumbs className="doodle -bottom-14 right-8 w-16 text-cocoa/60" />
        </div>
      </div>
    </section>
  );
}
