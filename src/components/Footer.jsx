import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { Star } from './Doodles';
import { DeveloperBadge } from './ui/developer-badge';

import { IG_URL } from '@/lib/photos';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cocoa text-cream">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-20 pb-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div data-reveal>
            <p className="kicker text-blush">Sharing joy, crumb by crumb</p>
            <p className="script mt-3 whitespace-nowrap text-[clamp(52px,9vw,150px)] leading-[0.9] text-pink">Crumb &amp; Co.</p>
            <p className="mt-2 text-lg text-cream/80">by Lana · delivery available</p>
          </div>
          <div className="flex flex-col gap-3 text-lg">
            <Link href="/order" className="hover:text-pink">Menu</Link>
            <Link href="/about" className="hover:text-pink">About</Link>
            <Link href="/contact" className="hover:text-pink">Contact</Link>
            <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-pink"><Instagram className="size-5" /> @crumbnco.__</a>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-cream/15 pt-6 text-sm text-cream/60 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Crumb &amp; Co.</span>
          <span>Minimum order is a box of 2</span>
          <Link href="/admin" className="font-semibold uppercase tracking-widest hover:text-pink">Admin</Link>
        </div>
        <div className="mt-8 flex justify-center">
          <DeveloperBadge />
        </div>
      </div>
      <Star className="doodle spin-slow !text-pink/40 right-[6%] top-10 w-24" />
    </footer>
  );
}
