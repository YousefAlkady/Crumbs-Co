'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import UserDropdown from './UserDropdown';
import { useIsAdmin } from '@/hooks/useIsAdmin';

const navBtnBase =
  'px-5 py-2.5 rounded-full font-fredoka font-semibold text-base border-4 border-chocolate transition-all duration-150 shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-pressed';

const navBtnActive = 'bg-pastel-hotpink text-white';
const navBtnInactive = 'bg-transparent text-chocolate hover:bg-pastel-pink/40';

export default function Navbar({ activePage = 'home', cartCount = 0, user, onLogout }) {
  const isActive = (page) => activePage === page;
  const { isAdmin } = useIsAdmin({ user });
  const cartBtn = useRef(null);
  useEffect(() => {
    const bump = () => { const el = cartBtn.current; if (el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } };
    window.addEventListener('cart-update', bump);
    return () => window.removeEventListener('cart-update', bump);
  }, []);

  return (
    <nav className="sticky top-0 z-[100] flex justify-between items-center px-5 md:px-8 lg:px-12 py-4 bg-white border-b-4 border-chocolate flex-wrap gap-3">
      <Link href="/" className="font-chewy text-2xl md:text-3xl text-pastel-hotpink">
        Crumb & Co.
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/">
          <motion.button
            whileTap={{ x: 4, y: 4 }}
            className={`${navBtnBase} ${isActive('home') ? navBtnActive : navBtnInactive}`}
          >
            HOME
          </motion.button>
        </Link>
        <Link href="/order">
          <motion.button
            whileTap={{ x: 4, y: 4 }}
            className={`${navBtnBase} ${isActive('order') ? navBtnActive : navBtnInactive}`}
          >
            ORDER
          </motion.button>
        </Link>
        <Link href="/cart">
          <motion.button
            ref={cartBtn}
            whileTap={{ x: 4, y: 4 }}
            className={`${navBtnBase} ${isActive('cart') ? navBtnActive : navBtnInactive}`}
          >
            CART ({cartCount})
          </motion.button>
        </Link>
        {user ? (
          <UserDropdown user={user} isAdmin={isAdmin} onLogout={onLogout} />
        ) : (
          <Link href="/login">
            <motion.button
              whileTap={{ x: 4, y: 4 }}
              className={`${navBtnBase} ${navBtnInactive}`}
            >
              LOGIN
            </motion.button>
          </Link>
        )}
      </div>
    </nav>
  );
}
