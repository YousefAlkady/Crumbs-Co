'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { readCart } from '@/lib/cart';
import UserDropdown from './UserDropdown';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/order', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

/** One nav for every page: logo, links, cart pill (bounces when something is added), account. */
export default function Nav() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pill = useRef(null);
  const { isAdmin } = useIsAdmin({ user });

  useEffect(() => {
    setCount(readCart().length);
    const onCart = (e) => {
      setCount(e.detail ?? readCart().length);
      const el = pill.current;
      if (el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    };
    window.addEventListener('cart-update', onCart);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    const onScroll = () => setScrolled(scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('cart-update', onCart); window.removeEventListener('scroll', onScroll); sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => { setOpen(false); setCount(readCart().length); }, [router.asPath]);

  async function logout() {
    await supabase.auth.signOut();
    router.reload();
  }

  const active = (href) => router.pathname === href;

  return (
    <header className={`fixed inset-x-0 top-0 z-[80] transition-[background,box-shadow] duration-300 ${scrolled || open ? 'bg-cream/90 backdrop-blur-md shadow-[0_1px_0_rgba(74,30,27,.12)]' : ''}`}>
      <div className="mx-auto grid h-16 md:h-20 max-w-7xl grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 justify-self-start" data-cursor="home">
          <Image src="/instagram/logo-badge.jpg" alt="" width={40} height={40} className="rounded-full" priority />
          <span className="script whitespace-nowrap text-xl sm:text-2xl md:text-[28px] text-pink leading-none">Crumb &amp; Co.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full bg-white/70 p-1.5 shadow-[inset_0_0_0_1px_rgba(74,30,27,.12)]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${active(l.href) ? 'bg-cocoa text-cream' : 'hover:bg-blush'}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <Link ref={pill} href="/cart" aria-label={`Cart, ${count} cookies`} data-cart-pill
            className="flex items-center gap-2 rounded-full bg-pink px-4 py-2.5 text-[15px] font-semibold text-white">
            <ShoppingBag className="size-4" /> <span className="tabular-nums">{count}</span>
          </Link>
          <div className="hidden md:block">
            {user ? <UserDropdown user={user} isAdmin={isAdmin} onLogout={logout} /> : (
              <Link href="/login" className="rounded-full px-4 py-2.5 text-[15px] font-semibold hover:bg-blush">Log in</Link>
            )}
          </div>
          <button className="md:hidden rounded-full p-2.5 hover:bg-blush" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-cocoa/10 px-5 pb-6 pt-2">
          {[...LINKS, isAdmin ? { href: '/admin', label: 'Admin' } : null, user ? null : { href: '/login', label: 'Log in' }].filter(Boolean).map((l) => (
            <Link key={l.href} href={l.href} className="disp block py-3 text-4xl">{l.label}</Link>
          ))}
          {user && <button onClick={logout} className="mt-2 text-lg font-semibold underline">Log out</button>}
        </nav>
      )}
    </header>
  );
}
