'use client';
import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { P } from '@/lib/photos';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  { n: '01', title: "Pick 'em", text: 'Choose your flavours from the menu. A box starts at 2 cookies.', photo: P.box, bg: 'bg-cream' },
  { n: '02', title: "We bake 'em", text: 'Lana mixes the brown butter dough and bakes your box.', photo: P.dough, bg: 'bg-pink-deep text-cream' },
  { n: '03', title: "You eat 'em", text: 'Delivered to your door. Pay cash on delivery.', photo: P.bueno, bg: 'bg-cobalt text-cream' },
];

/** Portfolio card stack: cards are sticky; as the next one slides over, the one underneath sinks back and darkens. */
export default function HowItWorks() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray('.stack-card', root.current);
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(card, { scale: 1, '--stack-dim': 0 }, {
          scale: 0.93 - 0.02 * (cards.length - 2 - i), '--stack-dim': 0.45, ease: 'none', transformOrigin: '50% 0%',
          scrollTrigger: { trigger: next, start: 'top bottom', end: () => `top ${parseFloat(getComputedStyle(next).top)}px`, scrub: true, invalidateOnRefresh: true },
        });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div data-lines className="mb-12 md:mb-16">
        <p className="kicker text-pink-deep">How it works</p>
        <h2 className="disp mt-3 text-[clamp(48px,7vw,110px)]">
          <span className="mask"><span className="ln">Three steps</span></span>
          <span className="mask"><span className="ln">to a happy box.</span></span>
        </h2>
      </div>
      <div className="flex flex-col gap-6">
        {STEPS.map((s, i) => (
          <article key={s.n} style={{ top: `${88 + i * 22}px` }}
            className={`stack-card sticky grid min-h-[70vh] overflow-hidden rounded-[36px] shadow-soft md:grid-cols-2 ${s.bg}`}>
            <div className="relative z-[5] flex flex-col justify-between gap-10 p-8 md:p-12">
              <span className="disp text-[clamp(80px,12vw,180px)] opacity-90">{s.n}</span>
              <div>
                <h3 className="disp text-[clamp(40px,5vw,72px)]">{s.title}</h3>
                <p className="mt-4 max-w-md text-xl leading-snug opacity-90">{s.text}</p>
              </div>
            </div>
            <div className="relative min-h-[320px]">
              <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
