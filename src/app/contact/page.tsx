import Link from "next/link";
import { Instagram, Phone, ArrowLeft } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/crumbnco.__/";
const PHONE_NUMBER = "+20 10 64589545";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FDF6E3] text-[#5C3317] font-sans overflow-x-hidden">
            <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-12 md:py-24">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#00008B] font-bold tracking-widest uppercase hover:text-[#ffc0cb] transition-colors mb-12"
                >
                    <ArrowLeft size={20} /> Back Home
                </Link>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-[#5C3317] mb-4">
                    GET IN <span className="text-[#ffc0cb]">TOUCH</span>
                </h1>
                <p className="text-[#5C3317]/70 font-medium mb-12 text-lg">
                    Reach out for orders, questions, or just to say hi.
                </p>

                <div className="flex flex-col gap-6">
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg border-4 border-[#FDF6E3] hover:border-[#ffc0cb] hover:shadow-xl transition-all group"
                    >
                        <div className="p-4 bg-[#ffc0cb] text-[#00008B] rounded-xl group-hover:scale-110 transition-transform">
                            <Instagram size={32} />
                        </div>
                        <div>
                            <p className="font-black text-[#5C3317] text-xl">Instagram</p>
                            <p className="text-[#5C3317]/60 font-medium">@crumbnco.__</p>
                        </div>
                    </a>

                    <a
                        href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                        className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg border-4 border-[#FDF6E3] hover:border-[#ffc0cb] hover:shadow-xl transition-all group"
                    >
                        <div className="p-4 bg-[#ffc0cb] text-[#00008B] rounded-xl group-hover:scale-110 transition-transform">
                            <Phone size={32} />
                        </div>
                        <div>
                            <p className="font-black text-[#5C3317] text-xl">Call Us</p>
                            <p className="text-[#00008B] font-bold text-lg">{PHONE_NUMBER}</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
