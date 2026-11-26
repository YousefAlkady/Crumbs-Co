'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// phones: the address bar resizing the window would re-measure every pin on each scroll direction change
ScrollTrigger.config({ ignoreMobileResize: true });

export const lenisRef = { current: null };
export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Lenis smooth scroll driven by the GSAP ticker, so ScrollTrigger reads the same frame (ported from the portfolio). */
export default function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick, false, true);
    gsap.ticker.lagSmoothing(0);
    const fit = () => lenis.resize();
    ScrollTrigger.addEventListener('refresh', fit);
    return () => {
      ScrollTrigger.removeEventListener('refresh', fit);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
  return null;
}
