import CookieCard from "@/components/ui/CookieCard";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Order Menu | Crumbs & Co.",
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function LiveCookieMenuPage() {
    const { data: cookies, error } = await supabase
        .from('cookies')
        .select('*')
        .or('is_hidden.eq.false,is_hidden.is.null')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching cookies:", error);
    }

    return (
        <main className="menu-watermark min-h-screen bg-[#FDF6E3] text-[#5C3317] font-sans pb-24 overflow-x-hidden">
            <header className="w-full py-8 md:py-12 px-4 md:px-6 flex flex-col items-center text-center">
                <Link href="/" className="text-[#00008B] font-bold uppercase tracking-widest text-sm mb-4 hover:text-[#ffc0cb] transition-colors">
                    ← Back Home
                </Link>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter text-[#5C3317]">
                    OUR <span className="text-[#ffc0cb]">MENU</span>
                </h1>
                <p className="mt-4 text-base md:text-lg max-w-xl text-[#5C3317]/80 font-medium px-2">
                    Freshly baked in limited batches. Grab them before they're gone.
                </p>
            </header>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-10 mt-6 md:mt-8">
                {(!cookies || cookies.length === 0) && (
                    <div className="col-span-full text-center py-20 text-[#5C3317]/60 font-bold text-xl">
                        We are currently baking a fresh batch! Check back soon.
                    </div>
                )}
                {cookies?.map((cookie) => (
                    <div key={cookie.id} className="flex justify-center h-full">
                        <CookieCard
                            id={cookie.id}
                            name={cookie.name}
                            description={cookie.description || "Freshly baked!"}
                            price={cookie.price}
                            inStock={cookie.in_stock !== false}
                            images={cookie.images?.length ? cookie.images : (cookie.image_url ? [cookie.image_url] : ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop"])}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}
