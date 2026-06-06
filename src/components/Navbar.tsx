"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingBag, Home, Cookie, LogOut, ShieldCheck } from "lucide-react";

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const { items, setIsCartOpen } = useCart();
    const router = useRouter();

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut({ scope: 'local' });
        router.push("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#ffc0cb]/70 backdrop-blur-md border-b border-[#5C3317]/10 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">

                {/* Brand */}
                <Link href="/" className="flex items-center z-50 hover:opacity-90 transition-opacity">
                    <img src="/Crumbs and Co Emblem.png" alt="Crumbs & Co" className="h-12 md:h-16 w-auto" />
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6 md:gap-8 font-bold text-[#5C3317] text-sm uppercase tracking-widest">
                    <Link href="/" className="flex items-center gap-2 hover:text-[#ffc0cb] transition-colors"><Home size={18} /> Home</Link>
                    <Link href="/menu" className="flex items-center gap-2 hover:text-[#ffc0cb] transition-colors"><Cookie size={18} /> Menu</Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 z-50">
                    <div className="hidden md:flex items-center gap-4">
                        {user && (
                            <>
                                <Link href="/admin" className="flex items-center gap-2 text-[#00008B] font-bold text-sm uppercase hover:text-[#ffc0cb] transition-colors">
                                    <ShieldCheck size={18} /> Admin
                                </Link>
                                <button onClick={handleLogout} className="text-[#5C3317] hover:text-red-500 transition-colors" title="Log Out">
                                    <LogOut size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Cart Button (Always Visible) */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative min-h-[44px] min-w-[44px] flex items-center justify-center p-3 text-[#00008B] hover:text-[#ffc0cb] transition-colors"
                    >
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-[#ffc0cb] text-[#00008B] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FDF6E3]">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}