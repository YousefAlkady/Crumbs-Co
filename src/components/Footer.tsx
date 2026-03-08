"use client";

import Link from 'next/link';
import { Instagram, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#00008B] text-[#FDF6E3] mt-auto border-t-8 border-[#ffc0cb] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">

        {/* Newsletter Section */}
        <div className="text-center mb-12 md:mb-20 bg-[#FDF6E3]/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-[#FDF6E3]/10">
          <h3 className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tighter text-[#ffc0cb] mb-4">
            JOIN THE CRUMB CLUB
          </h3>
          <p className="text-[#FDF6E3]/80 font-medium mb-8 max-w-xl mx-auto text-lg">
            Get exclusive drops, early access, and sweet deals. No spam—just cookies.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full flex-1 px-6 py-4 rounded-2xl bg-[#FDF6E3] text-[#5C3317] font-bold outline-none focus:ring-4 focus:ring-[#ffc0cb] placeholder-[#5C3317]/40 shadow-inner"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 bg-[#ffc0cb] text-[#00008B] font-black tracking-widest uppercase rounded-2xl hover:bg-[#FDF6E3] transition-colors shadow-lg"
            >
              Subscribe <Send size={18} />
            </button>
          </form>
        </div>

        {/* Links & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 border-b border-[#FDF6E3]/20 pb-8 md:pb-12 mb-6 md:mb-8">
          <div className="text-2xl md:text-3xl font-black tracking-tighter text-[#FDF6E3] text-center md:text-left">
            CRUMBS<span className="text-[#ffc0cb]">&</span>CO.
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/menu" className="text-[#FDF6E3] font-bold uppercase tracking-widest hover:text-[#ffc0cb] transition-colors">
              Menu
            </Link>
            <Link href="/login" className="text-[#FDF6E3] font-bold uppercase tracking-widest hover:text-[#ffc0cb] transition-colors">
              Admin
            </Link>
            <Link href="#" className="text-[#FDF6E3] font-bold uppercase tracking-widest hover:text-[#ffc0cb] transition-colors">
              FAQ
            </Link>
            <Link href="#" className="text-[#FDF6E3] font-bold uppercase tracking-widest hover:text-[#ffc0cb] transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/crumbnco.__/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#ffc0cb] text-[#00008B] rounded-full hover:bg-[#FDF6E3] hover:scale-110 transition-all shadow-lg"
              title="Follow us on Instagram"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-[#FDF6E3]/50 text-sm font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Crumbs & Co. Baked with love in Egypt.
        </p>
      </div>
    </footer>
  );
}