"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingBag, Home, Cookie, UserCircle, LogOut, ShieldCheck, Menu, X } from "lucide-react";

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <-- Controls the hamburger!
    const { items, setIsCartOpen } = useCart();
    const router = useRouter();

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMobileMenuOpen(false);
        router.push("/");
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#FDF6E3]/80 backdrop-blur-md border-b border-[#5C3317]/10 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">

                {/* Brand */}
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl md:text-2xl font-black tracking-tighter text-[#00008B] hover:scale-105 transition-transform z-50">
                    CRUMBS<span className="text-[#ffc0cb]">&</span>CO.
                </Link>

                {/* Desktop Links (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-8 font-bold text-[#5C3317] text-sm uppercase tracking-widest">
                    <Link href="/" className="flex items-center gap-2 hover:text-[#ffc0cb] transition-colors"><Home size={18} /> Home</Link>
                    <Link href="/menu" className="flex items-center gap-2 hover:text-[#ffc0cb] transition-colors"><Cookie size={18} /> Menu</Link>
                </div>

                {/* Desktop Actions + Mobile Hamburger Toggle */}
                <div className="flex items-center gap-4 z-50">
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <Link href="/admin" className="flex items-center gap-2 text-[#00008B] font-bold text-sm uppercase hover:text-[#ffc0cb] transition-colors">
                                    <ShieldCheck size={18} /> Admin
                                </Link>
                                <button onClick={handleLogout} className="text-[#5C3317] hover:text-red-500 transition-colors" title="Log Out">
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 text-[#5C3317] font-bold text-sm uppercase hover:text-[#ffc0cb] transition-colors">
                                <UserCircle size={20} /> Login
                            </Link>
                        )}
                    </div>

                    {/* Cart Button (Always Visible) */}
                    <button
                        onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                        className="relative p-2 text-[#00008B] hover:text-[#ffc0cb] transition-colors"
                    >
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-[#ffc0cb] text-[#00008B] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FDF6E3]">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Hamburger Menu Toggle (Mobile Only) */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-[#00008B] hover:text-[#ffc0cb] transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Slide-down Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 md:top-20 left-0 w-full h-screen bg-[#FDF6E3]/95 backdrop-blur-xl border-t border-[#5C3317]/10 flex flex-col items-center pt-12 gap-8 animate-in slide-in-from-top-4 duration-300">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-[#5C3317] uppercase tracking-widest hover:text-[#ffc0cb] flex items-center gap-2"><Home size={24} /> Home</Link>
                    <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-[#5C3317] uppercase tracking-widest hover:text-[#ffc0cb] flex items-center gap-2"><Cookie size={24} /> Menu</Link>

                    <div className="w-24 h-1 bg-[#5C3317]/10 rounded-full my-4"></div>

                    {user ? (
                        <>
                            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-[#00008B] uppercase tracking-widest hover:text-[#ffc0cb] flex items-center gap-2"><ShieldCheck size={20} /> Admin Dashboard</Link>
                            <button onClick={handleLogout} className="text-xl font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 mt-4"><LogOut size={20} /> Log Out</button>
                        </>
                    ) : (
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-[#5C3317] uppercase tracking-widest hover:text-[#ffc0cb] flex items-center gap-2"><UserCircle size={20} /> Login</Link>
                    )}
                </div>
            )}
        </nav>
    );
}