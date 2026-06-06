"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop";

interface CookieCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
    inStock?: boolean;
    images: string[];
}

export default function CookieCard({ id, name, description, price, inStock = true, images }: CookieCardProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [imgError, setImgError] = useState(false);
    const { addToCart } = useCart();

    const safeImages = images?.length ? images : [FALLBACK_IMAGE];
    const currentImage = imgError ? FALLBACK_IMAGE : (safeImages[currentIdx] ?? safeImages[0]);

    useEffect(() => setImgError(false), [currentIdx]);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIdx((prev) => (prev + 1) % safeImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIdx((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    };

    const handleAddToCart = () => {
        if (!inStock) return;
        addToCart({ id, name, price, image: safeImages[0] });
        toast.success(`${name} added to cart!`, { icon: '🍪' });
    };

    return (
        <div className="w-full max-w-sm h-full overflow-hidden rounded-[2rem] bg-[#FDF6E3] shadow-lg border-2 border-[#5C3317]/10 hover:border-[#ffc0cb] hover:shadow-2xl transition-all duration-300 flex flex-col">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 shrink-0 group">
                <img
                    src={currentImage}
                    alt={name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {safeImages.length > 1 && (
                    <>
                        <button type="button" onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 min-h-[44px] min-w-[44px] flex items-center justify-center p-3 rounded-full bg-[#FDF6E3]/90 text-[#5C3317] hover:bg-[#ffc0cb] transition-colors cursor-pointer">
                            <ChevronLeft size={24} />
                        </button>
                        <button type="button" onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 min-h-[44px] min-w-[44px] flex items-center justify-center p-3 rounded-full bg-[#FDF6E3]/90 text-[#5C3317] hover:bg-[#ffc0cb] transition-colors cursor-pointer">
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-1 pointer-events-none z-10">
                    {!inStock && (
                        <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-black text-xs uppercase tracking-wider">Out of Stock</span>
                    )}
                    <span className="bg-[#00008B] text-[#ffc0cb] font-bold px-3 py-1 rounded-full shadow-lg">{price} EGP</span>
                </div>
            </div>
            <div className="p-4 md:p-6 flex flex-col flex-grow">
                <h3 className="text-xl md:text-2xl font-black text-[#5C3317] mb-2">{name}</h3>
                <p className="text-[#5C3317]/80 text-sm font-medium flex-grow mb-6">{description}</p>
                <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className={`w-full py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors group/btn ${inStock
                        ? "bg-[#5C3317] text-[#FDF6E3] hover:bg-[#ffc0cb] hover:text-[#00008B]"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                >
                    <ShoppingCart size={18} className={inStock ? "group-hover/btn:scale-110 transition-transform" : ""} />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>
    );
}