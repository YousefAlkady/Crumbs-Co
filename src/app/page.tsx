import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Landing() {
  return (
    <div className="bg-[#FDF6E3] text-[#5C3317] font-sans selection:bg-[#ffc0cb] selection:text-[#00008B] flex flex-col min-h-screen overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-24 flex flex-col md:flex-row items-center justify-between z-10">
        <div className="flex-1 flex flex-col items-start gap-6 z-20">
          <div className="inline-block px-4 py-1 rounded-full bg-[#ffc0cb]/30 border border-[#ffc0cb] text-[#00008B] font-bold text-sm tracking-wide uppercase shadow-sm">
            Baked Fresh in Egypt
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-[#5C3317]">
            DANGEROUSLY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00008B] to-[#ffc0cb]">GOOD.</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-medium text-[#5C3317]/80 max-w-lg mt-4">
            Crispy edges. Gooey centers. 100% premium ingredients. Get your hands on the best cookies in town.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 w-full sm:w-auto">
            <Link href="/menu" className="w-full sm:w-auto px-8 py-4 bg-[#00008B] text-[#FDF6E3] rounded-full font-black text-lg tracking-widest uppercase hover:bg-[#ffc0cb] hover:text-[#00008B] transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-[#ffc0cb]/50 text-center">
              Order Now
            </Link>
            <Link href="#about" className="w-full sm:w-auto px-8 py-4 bg-transparent border-4 border-[#5C3317] text-[#5C3317] rounded-full font-black text-lg tracking-widest uppercase hover:bg-[#5C3317] hover:text-[#FDF6E3] transition-all text-center">
              Our Story
            </Link>
          </div>
        </div>

        <div className="flex-1 relative w-full mt-20 md:mt-0 flex justify-center items-center">
          <div className="absolute w-72 h-72 bg-[#ffc0cb] rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute w-72 h-72 bg-[#00008B] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000 translate-x-20"></div>
          <div className="relative z-10 w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-[#5C3317] bg-[#5C3317]/5 flex items-center justify-center overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-[url('https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center">
          </div>
          <div className="absolute bottom-4 right-4 md:-left-4 bg-[#ffc0cb] border-4 border-[#00008B] text-[#00008B] font-black p-4 rounded-full shadow-lg transform -rotate-12 hover:scale-110 transition-transform z-20">
            100% <br /> YUM
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
      <section className="w-full bg-[#FDF6E3] py-12 md:py-24 border-b-2 border-[#5C3317]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 id="about" className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tighter text-[#5C3317] text-center mb-10 md:mb-16">
            CROWD <span className="text-[#ffc0cb]">FAVORITES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Classic Chocolate Chunk", img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop" },
              { name: "Salted Caramel Bliss", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop" },
              { name: "Double Trouble Brownie", img: "https://images.unsplash.com/photo-1602524206684-cc9e7c51e4c5?q=80&w=800&auto=format&fit=crop" },
            ].map((cookie) => (
              <div key={cookie.name} className="group rounded-[2rem] bg-white overflow-hidden shadow-xl border-4 border-[#FDF6E3] hover:shadow-2xl hover:-translate-y-2 hover:border-[#ffc0cb] transition-all duration-300 flex flex-col">
                <div className="w-full h-72 bg-[#5C3317]/5 relative overflow-hidden shrink-0">
                  <img src={cookie.img} alt={cookie.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between bg-white z-10">
                  <h3 className="text-xl md:text-2xl font-black text-[#5C3317] mb-6 leading-tight">{cookie.name}</h3>
                  <Link href="/menu" className="inline-block w-full py-4 text-center bg-[#00008B] text-[#ffc0cb] font-black tracking-widest uppercase rounded-xl hover:bg-[#ffc0cb] hover:text-[#00008B] transition-colors shadow-lg">
                    Get Yours
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Bento Box Story */}
      <section className="w-full bg-[#FDF6E3] py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 grid-rows-none lg:grid-rows-2">
            <div className="lg:col-span-2 lg:row-span-2 rounded-[2rem] bg-[#00008B] p-6 md:p-10 lg:p-14 flex flex-col justify-center text-[#ffc0cb] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc0cb]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <p className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-6 relative z-10">
                100% Premium Belgian Chocolate.
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