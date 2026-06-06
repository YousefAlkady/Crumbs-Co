import Link from 'next/link';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default async function Landing() {
    const { data: favorites } = await supabase
        .from('cookies')
        .select('id, name, description, image_url, images')
        .eq('is_favorite', true)
        .order('id', { ascending: true });
  return (
    <div className="bg-[#FDF6E3] text-[#5C3317] font-sans selection:bg-[#ffc0cb] selection:text-[#00008B] flex flex-col min-h-screen overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-8 sm:pt-12 pb-16 sm:pb-24 flex flex-col md:flex-row items-center justify-between overflow-x-hidden">
        <div className="flex-1 flex flex-col items-start gap-6">
          <div className="inline-block px-4 py-1 rounded-full bg-[#ffc0cb]/30 border border-[#ffc0cb] text-[#00008B] font-bold text-sm tracking-wide uppercase shadow-sm">
            Baked Fresh in Egypt
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight tracking-tighter text-[#5C3317]">
            A Cookie Worth Remembering.
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#5C3317]/80 max-w-lg mt-4">
            Soft centers, rich chocolate, and a flavor you'll want again.
          </p>
          <div className="flex justify-center sm:justify-start mt-8 w-full sm:w-auto">
            <Link href="/menu" className="w-full sm:w-auto px-8 py-4 bg-[#00008B] text-[#FDF6E3] rounded-full font-black text-lg tracking-widest uppercase hover:bg-[#ffc0cb] hover:text-[#00008B] transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-[#ffc0cb]/50 text-center">
              Order Now
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex-1 w-full min-h-[280px] mt-12 md:mt-0 flex justify-center items-center bg-transparent">
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-[#ffc0cb] rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-[#00008B] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000 translate-x-12 md:translate-x-20"></div>
          <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-4 md:border-8 border-[#5C3317] bg-[#5C3317]/5 flex items-center justify-center overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-[url('https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center">
          </div>
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 md:-left-4 md:bottom-4 bg-[#ffc0cb] border-2 sm:border-4 border-[#00008B] text-[#00008B] font-black text-base sm:text-xl md:text-2xl lg:text-3xl px-3 py-2 sm:px-5 sm:py-4 rounded-full shadow-lg transform -rotate-12 hover:scale-110 transition-transform z-20 whitespace-nowrap">
            100% YUM
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="w-full bg-[#5C3317] text-[#ffc0cb] py-3 md:py-4 overflow-hidden flex whitespace-nowrap border-y-4 border-[#00008B]">
        <div className="animate-marquee font-black text-base md:text-2xl tracking-widest flex gap-4 md:gap-8 items-center">
          <span>✦ CHUNKY</span> <span>✦ GOOEY</span> <span>✦ FRESHLY BAKED</span> <span>✦ CRUMBS & CO.</span>
          <span>✦ CHUNKY</span> <span>✦ GOOEY</span> <span>✦ FRESHLY BAKED</span> <span>✦ CRUMBS & CO.</span>
          <span>✦ CHUNKY</span> <span>✦ GOOEY</span> <span>✦ FRESHLY BAKED</span> <span>✦ CRUMBS & CO.</span>
        </div>
      </div>

      {/* 1. Bestsellers Section (Constrained Grid) */}
      <section className="w-full text-center bg-[#FDF6E3] py-12 md:py-24 border-b-2 border-[#5C3317]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 id="about" className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tighter text-[#5C3317] text-center mb-10 md:mb-16">
            CROWD <span className="text-[#ffc0cb]">FAVORITES</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full max-w-6xl mx-auto px-2 sm:px-4">
            {(favorites ?? []).map((cookie) => (
              <div key={cookie.id} className="w-full min-w-0 max-w-[340px] sm:min-w-[260px] sm:w-80 group rounded-[2rem] bg-white overflow-hidden shadow-xl border-4 border-[#FDF6E3] hover:shadow-2xl hover:-translate-y-2 hover:border-[#ffc0cb] transition-all duration-300 flex flex-col">
                <div className="w-full h-72 bg-[#5C3317]/5 relative overflow-hidden shrink-0 flex items-center justify-center">
                  {(cookie.images?.[0] ?? cookie.image_url) ? (
                    <img src={cookie.images?.[0] ?? cookie.image_url ?? ''} alt={cookie.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#ffc0cb]/40 to-[#5C3317]/10 flex items-center justify-center">
                      <span className="text-6xl opacity-50">🍪</span>
                      <span className="absolute bottom-3 left-0 right-0 text-center text-sm font-bold text-[#5C3317]/50">Photo coming soon</span>
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between bg-white z-10">
                  <h3 className="text-xl md:text-2xl font-black text-[#5C3317] mb-2 leading-tight">{cookie.name}</h3>
                  {cookie.description && <p className="text-[#5C3317]/70 font-medium mb-6 line-clamp-3">{cookie.description}</p>}
                  <Link href="/menu" className="inline-block w-full py-4 text-center bg-[#00008B] text-[#ffc0cb] font-black tracking-widest uppercase rounded-xl hover:bg-[#ffc0cb] hover:text-[#00008B] transition-colors shadow-lg mt-auto">
                    Get Yours
                  </Link>
                </div>
              </div>
            ))}
            {(!favorites || favorites.length === 0) && (
              <div className="w-full text-center py-16 text-[#5C3317]/60 font-bold text-xl">
                Set crowd favorites in Admin → Menu & Favorites Editor
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Bento Box Story */}
      <section className="w-full bg-[#FDF6E3] py-12 md:py-24 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 overflow-x-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 grid-rows-none lg:grid-rows-[1fr_auto] overflow-visible">
            <div className="lg:col-span-2 lg:row-span-2 rounded-[2rem] bg-[#00008B] p-6 md:p-10 lg:p-14 flex flex-col justify-center text-[#ffc0cb] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc0cb]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <p className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-6 relative z-10">
                100% Premium Chocolate.
              </p>
              <p className="text-[#FDF6E3]/90 font-medium text-xl relative z-10">
                Every cookie is crafted with the finest ingredients. No compromises.
              </p>
            </div>

            <div className="lg:col-span-2 rounded-[2rem] bg-white border-2 border-[#5C3317]/10 p-6 md:p-10 shadow-xl flex flex-col justify-center">
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-[#5C3317] tracking-tighter">
                Baked Fresh in Egypt.
              </p>
              <p className="text-[#5C3317]/70 font-medium mt-4 text-lg">Every single day. Limited batches only.</p>
            </div>

            <div className="rounded-[2rem] bg-[#ffc0cb] text-[#00008B] p-6 md:p-8 shadow-xl flex flex-col justify-between">
              <p className="text-3xl tracking-widest mb-4 text-[#00008B]">★★★★★</p>
              <div>
                <p className="font-black text-lg leading-snug mb-4">&ldquo;Literally the best cookies I've ever had.&rdquo;</p>
                <p className="text-[#00008B]/70 font-bold uppercase tracking-wider text-sm">— Sarah M.</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border-2 border-[#5C3317]/10 p-6 md:p-8 shadow-xl flex flex-col justify-between">
              <p className="text-3xl tracking-widest mb-4 text-[#ffc0cb]">★★★★★</p>
              <div>
                <p className="font-bold text-[#5C3317] text-lg leading-snug mb-4 italic">&ldquo;I order every week. Addicted!&rdquo;</p>
                <p className="text-[#5C3317]/50 font-bold uppercase tracking-wider text-sm">— Omar K.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}