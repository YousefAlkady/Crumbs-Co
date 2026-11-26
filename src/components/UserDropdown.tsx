'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface UserDropdownProps {
  user: { email?: string | null } | null;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function UserDropdown({ user, isAdmin, onLogout }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative ml-2">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ x: 2, y: 2 }}
        className="
          w-12 h-12 rounded-full
          border-4 border-chocolate bg-pastel-peach
          flex items-center justify-center text-xl
          shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-pressed
          transition-shadow duration-150
        "
        aria-expanded={open}
        aria-haspopup="true"
      >
        👤
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute right-0 top-full mt-2
              min-w-[180px]
              rounded-2xl border-4 border-chocolate
              bg-white shadow-sticker
              py-2 overflow-hidden
              z-[200]
            "
          >
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="
                  block w-full px-4 py-2.5 text-left
                  font-fredoka font-medium text-chocolate
                  hover:bg-pastel-pink/50
                  transition-colors
                  border-b-2 border-dashed border-chocolate/30
                "
              >
                🔒 Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="
                block w-full px-4 py-2.5 text-left
                font-fredoka font-medium text-chocolate
                hover:bg-pastel-pink/50
                transition-colors
              "
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
