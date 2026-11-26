import Head from "next/head";
import Link from "next/link";
import { Cookie, ShoppingBag, Truck, ArrowRight, Search, Menu } from "lucide-react";
import { FlavourMarquee } from "@/components/home/Bands";

export default function Home() {
  return (
    <>
      <Head>
        <title>Crumb & Co. | Freshly Baked Happiness</title>
        <meta name="description" content="Order the cutest, tastiest cookies in town!" />
      </Head>

      <div className="min-h-screen bg-[#FFF8E7] text-amber-900 overflow-x-hidden">
        
        {/* HEADER - Thinner, smaller logo */}
        <header className="sticky top-0 z-50 w-full border-b-4 border-amber-900 bg-[#FFF8E7]/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto w-full px-4 md:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform shrink-0">
                <Cookie className="size-7 md:size-8 text-amber-900" />
                <span className="font-['Chewy'] text-xl md:text-2xl pt-0.5 text-amber-900">Crumb & Co.</span>
              </Link>

              <nav className="hidden md:flex items-center justify-center gap-8 text-base text-amber-900 flex-1">
                <Link href="/order" className="hover:text-pink-500 transition-colors">Menu</Link>
                <Link href="/about" className="hover:text-pink-500 transition-colors">About Us</Link>
                <Link href="/contact" className="hover:text-pink-500 transition-colors">Contact</Link>
              </nav>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden md:flex items-center bg-white border-4 border-amber-900 rounded-full px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(60,42,33,1)]">
                  <Search className="size-4 text-amber-900/50 mr-2" />
                  <input
                    type="text"
                    placeholder="Search for cookies..."
                    className="bg-transparent outline-none placeholder:text-amber-900/50 w-32 text-amber-900 text-sm"
                  />
                </div>
                <button className="md:hidden border-4 border-amber-900 p-1.5 rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(60,42,33,1)] text-amber-900">
                  <Menu className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN - Reduced vertical gaps */}
        <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 flex flex-col gap-12 md:gap-16 overflow-x-hidden">
          
          {/* 1. HERO - Scaled-down typography & graphic */}
          <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12 mt-2 md:mt-4">
            <div className="flex-1 flex flex-col gap-4 text-center md:text-left items-center md:items-start min-w-0">
              <h1 data-lines className="font-['Chewy'] text-5xl lg:text-6xl leading-[1.1] text-amber-900 drop-shadow-sm">
                <span className="mask"><span className="ln">Freshly Baked</span></span>
                <span className="mask"><span className="ln text-pink-500">Happiness.</span></span>
              </h1>
              <p className="text-lg md:text-xl text-amber-900/90 max-w-lg">
                Chunky, gooey cookies made with love. Treat yourself—you deserve it! 🍪
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-1 w-full sm:w-auto">
                <Link
                  href="/order"
                  className="group flex items-center justify-center gap-2 text-lg md:text-xl px-8 py-4 bg-amber-900 text-white rounded-full border-4 border-amber-900 shadow-[6px_6px_0px_0px_rgba(60,42,33,1)] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(60,42,33,1)] transition-all font-['Chewy']"
                >
                  Order Now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform size-5 text-white" />
                </Link>
              </div>
            </div>
            <div data-parallax="0.15" className="flex-1 w-full flex justify-center min-w-0">
              <div className="float w-56 h-56 md:w-72 md:h-72 bg-pink-200 border-4 border-amber-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(60,42,33,1)] flex items-center justify-center transform rotate-3 hover:-rotate-3 transition-transform duration-500">
                <Cookie className="w-24 h-24 md:w-28 md:h-28 text-amber-900" />
              </div>
            </div>
          </section>

          {/* scrolling flavour ticker (speeds up with scroll) */}
          <div className="-mx-4 md:-mx-8"><FlavourMarquee /></div>

          {/* 2. BEST SELLERS - Smaller cards & icons */}
          <section className="w-full flex flex-col items-center">
            <h2 className="font-['Chewy'] text-4xl mb-6 md:mb-8 text-center text-amber-900">Best Sellers</h2>
            <div data-reveal="stagger" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-white border-4 border-amber-900 rounded-[1.5rem] p-4 md:p-5 shadow-[6px_6px_0px_0px_rgba(60,42,33,1)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 bg-pink-200 border-4 border-amber-900 rounded-xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(60,42,33,1)]">
                  <span className="text-3xl">🍫</span>
                </div>
                <h3 className="font-['Chewy'] text-xl md:text-2xl mb-1 text-amber-900">Chocolate Chip</h3>
                <Link href="/order" className="text-pink-500 hover:text-pink-600 text-base text-amber-900/90">
                  Order now &rarr;
                </Link>
              </div>
              <div className="bg-white border-4 border-amber-900 rounded-[1.5rem] p-4 md:p-5 shadow-[6px_6px_0px_0px_rgba(60,42,33,1)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 bg-pink-200 border-4 border-amber-900 rounded-xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(60,42,33,1)]">
                  <span className="text-3xl">🍪</span>
                </div>
                <h3 className="font-['Chewy'] text-xl md:text-2xl mb-1 text-amber-900">Double Fudge</h3>
                <Link href="/order" className="text-pink-500 hover:text-pink-600 text-base text-amber-900/90">
                  Order now &rarr;
                </Link>
              </div>
              <div className="bg-white border-4 border-amber-900 rounded-[1.5rem] p-4 md:p-5 shadow-[6px_6px_0px_0px_rgba(60,42,33,1)] flex flex-col items-center text-center hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 bg-pink-200 border-4 border-amber-900 rounded-xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(60,42,33,1)]">
                  <span className="text-3xl">🍓</span>
                </div>
                <h3 className="font-['Chewy'] text-xl md:text-2xl mb-1 text-amber-900">Strawberry Dream</h3>
                <Link href="/order" className="text-pink-500 hover:text-pink-600 text-base text-amber-900/90">
                  Order now &rarr;
                </Link>
              </div>
            </div>
          </section>

          {/* 3. HOW IT WORKS - Reduced padding & icon size */}
          <section className="w-full bg-pink-200 rounded-[2rem] border-4 border-amber-900 p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(60,42,33,1)]">
            <h2 className="font-['Chewy'] text-4xl text-center mb-8 md:mb-10 text-amber-900">How It Works</h2>
            <div data-reveal="stagger" className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-white border-4 border-amber-900 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(60,42,33,1)]">
                  <ShoppingBag className="w-10 h-10 text-amber-900" />
                </div>
                <h3 className="font-['Chewy'] text-xl md:text-2xl text-amber-900">1. Pick &apos;Em</h3>
                <p className="text-amber-900/90 text-base max-w-xs">Choose your favorites from our menu.</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-white border-4 border-amber-900 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(60,42,33,1)]">
                  <Cookie className="w-10 h-10 text-amber-900" />
                </div>
                <h3 className="font-['Chewy'] text-xl md:text-2xl text-amber-900">2. We Bake &apos;Em</h3>
                <p className="text-amber-900/90 text-base max-w-xs">Fresh from our oven to your box.</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-white border-4 border-amber-900 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(60,42,33,1)]">
                  <Truck className="w-10 h-10 text-amber-900" />
                </div>
                <h3 className="font-['Chewy'] text-xl md:text-2xl text-amber-900">3. You Eat &apos;Em</h3>
                <p className="text-amber-900/90 text-base max-w-xs">Delivered to your door, warm and gooey.</p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
