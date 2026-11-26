import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { P, IG_URL } from '@/lib/photos';
import { Star } from '@/components/Doodles';

/** Dark band built around the "cookie dealer" poster; lines rise, poster drifts. */
export function DealerBand() {
  return (
    <section className="relative overflow-hidden bg-cocoa text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-[1.2fr_1fr] md:px-8 md:py-32">
        <div data-lines>
          <h2 className="disp text-[clamp(50px,8vw,128px)]">
            <span className="mask"><span className="ln">Support</span></span>
            <span className="mask"><span className="ln">your local</span></span>
            <span className="mask"><span className="ln text-pink">cookie dealer.</span></span>
          </h2>
          <p className="script mt-6 text-3xl text-blush">Shhhh.</p>
        </div>
        <div data-parallax="0.15" className="relative mx-auto w-full max-w-[420px] rotate-3">
          <Image src={P.dealer.src} alt={P.dealer.alt} width={P.dealer.w} height={P.dealer.h} sizes="420px" className="rounded-[28px] shadow-2xl" />
          <Star className="doodle spin-slow -left-10 -top-10 w-20 !text-pink" />
        </div>
      </div>
    </section>
  );
}

const WALL = [P.midnight, P.tray2, P.ganache, P.classic, P.pretzel, P.oreo, P.soon, P.tray1, P.cheat];

/** Instagram wall: masonry columns, staggered reveal, each post links out. */
export function InstaWall() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div data-lines>
          <p className="kicker text-pink-deep">On the gram</p>
          <h2 className="disp mt-3 text-[clamp(44px,6vw,96px)]"><span className="mask"><span className="ln">@crumbnco.__</span></span></h2>
        </div>
        <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-pill solid" data-magnetic><Instagram className="size-5" /> Follow us</a>
      </div>
      <div data-reveal="stagger" className="columns-2 gap-4 md:columns-3 md:gap-6 [&>*]:mb-4 md:[&>*]:mb-6">
        {WALL.map((p) => (
          <a key={p.src} href={p.href || IG_URL} target="_blank" rel="noreferrer" data-cursor="view post"
            className="group block break-inside-avoid overflow-hidden rounded-[24px] bg-blush">
            <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width: 768px) 33vw, 50vw"
              className="h-auto w-full transition-transform duration-700 group-hover:scale-105" />
          </a>
        ))}
      </div>
    </section>
  );
}
