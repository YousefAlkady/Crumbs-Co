import Head from 'next/head';
import OrderMenu from '../components/OrderMenu';
import { LoopArrow, Star } from '../components/Doodles';

export default function OrderPage() {
  return (
    <div className="relative overflow-hidden">
      <Head><title>Menu - Crumb & Co.</title></Head>
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-10 md:px-8 md:pt-16">
        <header className="relative mb-14 md:mb-20">
          <p className="script text-3xl text-pink-deep -rotate-3 inline-block">by Lana</p>
          <h1 data-lines className="disp mt-2 text-[clamp(72px,14vw,200px)]">
            <span className="mask"><span className="ln">The Menu</span></span>
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <LoopArrow className="w-36 text-cocoa/60 md:w-48" />
            <p className="text-xl font-medium md:text-2xl">Minimum order is a box of 2</p>
          </div>
          <Star className="doodle spin-slow right-0 top-0 w-20 md:w-32" />
        </header>
        <OrderMenu />
      </div>
    </div>
  );
}
