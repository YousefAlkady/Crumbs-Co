"use client";

import { useState } from "react";
import Image from "next/image"; // <-- 1. Import Next.js Image
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { GlowingShadow } from "./glowing-shadow";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface CookieCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
}

export default function CookieCard({ id, name, description, price, images }: CookieCardProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const { addToCart } = useCart();

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIdx((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleAddToCart = () => {
        addToCart({ id, name, price, image: images[0] });
        toast.success(`${name} added to cart!`, { icon: '🍪' });
    };

    return (
        <div className="w-full max-w-sm h-full">
            <GlowingShadow>
                <div className="flex flex-col h-full bg-[#FDF6E3] z-10">
                    <div className="relative w-full h-64 overflow-hidden group">

                        {/* 2. Upgraded to Next.js Image for perfect optimization! */}
                        <Image
                            src={images[currentIdx]}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 100vw, 384px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {images.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#FDF6E3]/80 p-1 rounded-full text-[#5C3317] hover:bg-[#ffc0cb] transition-colors z-10">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FDF6E3]/80 p-1 rounded-full text-[#5C3317] hover:bg-[#ffc0cb] transition-colors z-10">
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                        <div className="absolute top-4 right-4 bg-[#00008B] text-[#ffc0cb] font-bold px-3 py-1 rounded-full shadow-lg z-10">
                            {price} EGP
                        </div>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col flex-grow">
                        <h3 className="text-xl md:text-2xl font-black text-[#5C3317] mb-2">{name}</h3>
                        <p className="text-[#5C3317]/80 text-sm font-medium flex-grow mb-6">{description}</p>
                        <button onClick={handleAddToCart} className="w-full py-3 bg-[#5C3317] text-[#FDF6E3] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#ffc0cb] hover:text-[#00008B] transition-colors group/btn">
                            <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </GlowingShadow>
        </div>
    );
}