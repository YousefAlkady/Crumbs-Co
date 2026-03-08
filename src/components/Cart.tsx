"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { items, removeFromCart, total, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-sans">
      <div
        className="absolute inset-0 bg-[#5C3317]/20 backdrop-blur-sm cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative w-full max-w-md bg-[#FDF6E3] h-full shadow-2xl flex flex-col border-l-4 border-[#00008B] animate-in slide-in-from-right duration-300">

        <div className="p-4 md:p-6 flex justify-between items-center bg-[#00008B] text-[#ffc0cb]">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <ShoppingBag /> YOUR CART
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="text-center text-[#5C3317]/60 font-bold mt-10 text-lg">
              Your bag is empty. Let's get some cookies!
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl shadow-sm border-2 border-[#5C3317]/5">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-bold text-[#5C3317] leading-tight">{item.name}</h3>
                  <p className="text-[#00008B] font-black mt-1">
                    {item.price} EGP <span className="text-[#5C3317]/50 text-sm font-medium">x {item.quantity}</span>
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-3 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 md:p-6 bg-white border-t-2 border-[#5C3317]/10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#5C3317] font-bold text-lg">TOTAL</span>
            <span className="text-3xl font-black text-[#00008B]">{total} EGP</span>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              router.push('/checkout');
            }}
            disabled={items.length === 0}
            className="w-full py-4 bg-[#ffc0cb] text-[#00008B] font-black tracking-widest text-lg rounded-xl hover:bg-[#00008B] hover:text-[#ffc0cb] transition-colors disabled:opacity-50 shadow-lg"
          >
            SECURE CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}