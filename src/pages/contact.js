import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, MapPin, Truck } from 'lucide-react';
import { P, IG_URL } from '@/lib/photos';

export default function ContactPage() {
  return (
    <>
      <Head><title>Contact - Crumb & Co.</title></Head>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-10 md:grid-cols-[1.2fr_1fr] md:px-8 md:pt-16">
        <div>
          <h1 data-lines className="disp text-[clamp(52px,8.5vw,140px)]">
            <span className="mask"><span className="ln">Say hi</span></span>
            <span className="mask"><span className="ln text-pink">or DM us.</span></span>
          </h1>
          <p className="mt-6 max-w-md text-xl">Questions, big orders or a box for someone special? Message us on Instagram or order straight from the menu.</p>
          <div data-reveal="stagger" className="mt-10 flex flex-col gap-4 text-lg">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-semibold hover:text-pink-deep"><Instagram className="size-6" /> @crumbnco.__</a>
            <p className="flex items-center gap-3"><MapPin className="size-6" /> 6th of October, Egypt</p>
            <p className="flex items-center gap-3"><Truck className="size-6" /> Delivery to your door</p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-pill solid" data-magnetic><Instagram className="size-5" /> Message us</a>
            <Link href="/order" className="btn-pill ghost">Order online</Link>
          </div>
        </div>
        <div data-parallax="0.12" className="mx-auto w-full max-w-[420px] -rotate-2 overflow-hidden rounded-[32px] shadow-soft">
          <Image src={P.oreo.src} alt={P.oreo.alt} width={P.oreo.w} height={P.oreo.h} sizes="420px" />
        </div>
      </section>
    </>
  );
}
