'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/** Fine pointers only: a cocoa dot that turns pink and shows a hint pill over [data-cursor="..."],
 *  and pulls [data-magnetic] elements toward the pointer (ported from the portfolio). */
export default function Cursor() {
  const dot = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const el = dot.current;
    if (!el || !matchMedia('(pointer: fine)').matches) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const x = gsap.quickTo(el, 'x', { duration: reduced ? 0 : 0.35, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: reduced ? 0 : 0.35, ease: 'power3' });
    let mag = null;
    const release = () => { if (mag) gsap.to(mag, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }); mag = null; };
    const move = (e) => {
      el.classList.add('is-on');
      x(e.clientX); y(e.clientY);
      const c = e.target.closest?.('[data-cursor]');
      el.classList.toggle('is-label', !!c);
      if (c) label.current.textContent = c.dataset.cursor;
      if (reduced) return;
      const m = e.target.closest?.('[data-magnetic]') ?? null;
      if (m !== mag) release();
      if (m) {
        mag = m;
        const r = m.getBoundingClientRect();
        gsap.to(m, { x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.3, ease: 'power3.out', overwrite: true });
      }
    };
    const leave = () => { el.classList.remove('is-on'); release(); };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, []);

  return <div ref={dot} className="cursor" aria-hidden="true"><span ref={label} /></div>;
}
