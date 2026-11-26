'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenisRef, reducedMotion } from './SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const LABEL = { '/': 'Home', '/order': 'Menu', '/cart': 'Cart', '/about': 'About', '/contact': 'Contact', '/login': 'Log in' };

/** Site-wide motion, rebuilt on every page (ported from the portfolio's Motion.tsx, Pages Router version):
 *  - [data-parallax="0.2"] drifts against the scroll
 *  - [data-reveal] fades up when it enters; children of [data-reveal="stagger"] go one after another
 *  - .mask > .ln lines inside [data-lines] rise out of their masks on enter
 *  - internal links close a pink curtain with the page name, the route changes, the curtain lifts */
export default function Motion() {
  const router = useRouter();
  const curtain = useRef(null);
  const label = useRef(null);
  const covering = useRef(false);

  // scroll effects for the current page
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const s = parseFloat(el.dataset.parallax || '0.15');
        gsap.fromTo(el, { y: () => s * innerHeight * 0.5 }, {
          y: () => -s * innerHeight * 0.5, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        });
      });
      // already on screen at load: play now; further down: wait until scrolled into view
      const enter = (el, start) => (el.getBoundingClientRect().top < innerHeight * 0.9
        ? { delay: 0.1 } : { scrollTrigger: { trigger: el, start, once: true } });
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const items = el.dataset.reveal === 'stagger' ? el.children : el;
        gsap.from(items, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, ...enter(el, 'top 85%') });
      });
      gsap.utils.toArray('[data-lines]').forEach((el) => {
        gsap.from(el.querySelectorAll('.ln'), { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.08, ...enter(el, 'top 88%') });
      });
    });
    const id = setTimeout(() => ScrollTrigger.refresh(), 300); // after page pins have set up
    return () => { clearTimeout(id); ctx.revert(); };
  }, [router.pathname]);

  // lift the curtain once the new page is in
  useEffect(() => {
    const done = () => {
      const lenis = lenisRef.current;
      lenis?.resize();
      if (!location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
      if (!covering.current) return;
      covering.current = false;
      gsap.timeline()
        .to(label.current, { yPercent: -110, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.1)
        .to(curtain.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'power4.inOut' }, 0.15)
        .set(curtain.current, { visibility: 'hidden' });
    };
    const fail = () => { covering.current = true; done(); };
    router.events.on('routeChangeComplete', done);
    router.events.on('routeChangeError', fail);
    return () => { router.events.off('routeChangeComplete', done); router.events.off('routeChangeError', fail); };
  }, [router]);

  // intercept internal links before next/link (capture phase)
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reducedMotion()) return;
      const a = e.target.closest?.('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.closest('[data-no-pt]')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      if (covering.current) return;
      covering.current = true;
      label.current.textContent = LABEL[url.pathname] || '';
      gsap.timeline({ onComplete: () => router.push(url.pathname + url.search + url.hash) })
        .set(curtain.current, { visibility: 'visible', clipPath: 'inset(100% 0% 0% 0%)' })
        .set(label.current, { yPercent: 110, opacity: 1 })
        .to(curtain.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power4.inOut' })
        .to(label.current, { yPercent: 0, duration: 0.45, ease: 'power3.out' }, 0.3);
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [router]);

  return (
    <div ref={curtain} className="pt-curtain" aria-hidden="true">
      <span className="mask"><span ref={label} className="ln disp pt-label" /></span>
    </div>
  );
}
