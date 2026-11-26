import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { P } from '@/lib/photos';
import { Star } from '@/components/Doodles';

// Copy uses only what the brand already says (Instagram bio, menu posters, the old about page). Lana can replace it.
export default function AboutPage() {
  return (
    <>
      <Head><title>About - Crumb & Co.</title></Head>
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 pb-20 pt-10 md:px-8 md:pt-16">
        <p className="script inline-block -rotate-3 text-3xl text-pink-deep">hi, it&apos;s Lana</p>
        <h1 data-lines className="disp mt-2 text-[clamp(52px,8.5vw,140px)]">
          <span className="mask"><span className="ln">Sharing joy,</span></span>
          <span className="mask"><span className="ln text-pink">crumb by crumb.</span></span>
        </h1>
        <Star className="doodle spin-slow right-4 top-6 w-20 md:w-28" />
        <div className="mt-14 grid items-start gap-10 md:grid-cols-2">
          <div data-reveal className="space-y-5 text-xl leading-relaxed">
            <p>Crumb &amp; Co. is a small home bakery in 6th of October, baking chunky brown butter cookies with love.</p>
            <p>From the classic sea salt chunk to Midnight &amp; Milk and the molten ganache, every flavour is made by hand and boxed for delivery.</p>
            <Link href="/order" className="btn-pill solid mt-4" data-magnetic>See the menu <ArrowRight className="size-5" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div data-parallax="0.1" className="overflow-hidden rounded-[28px]"><Image src={P.tray2.src} alt={P.tray2.alt} width={P.tray2.w} height={P.tray2.h} sizes="(min-width: 768px) 25vw, 50vw" /></div>
            <div data-parallax="-0.1" className="mt-16 overflow-hidden rounded-[28px]"><Image src={P.tray3.src} alt={P.tray3.alt} width={P.tray3.w} height={P.tray3.h} sizes="(min-width: 768px) 25vw, 50vw" /></div>
          </div>
        </div>
      </section>
    </>
  );
}
