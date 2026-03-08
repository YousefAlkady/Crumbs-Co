"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    // Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Save the order to Supabase
            const { data, error: supabaseError } = await supabase
                .from('orders')
                .insert([{
                    customer_name: name,
                    customer_email: email,
                    customer_address: address,
                    customer_phone: phone,
                    total_amount: total,
                    items: items,
                    status: 'pending'
                }])
                .select()
                .single();

            if (supabaseError) throw supabaseError;

            // 2. Trigger our background API to send the Gmail receipt
            await fetch('/api/send-receipt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name,
                    orderId: data.id,
                    total,
                    items
                })
            });

            // 3. Show Success
            setIsSuccess(true);
            clearCart();

        } catch (err: any) {
            console.error("Order error:", err);
            setError("Something went wrong placing your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-4 md:p-6 mt-12 md:mt-20 text-center animate-in zoom-in duration-500">
                <CheckCircle2 size={80} className="text-[#00008B] mb-6 drop-shadow-xl" />
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-4 text-[#00008B]">ORDER <span className="text-[#ffc0cb]">CONFIRMED!</span></h1>
                <p className="text-lg md:text-xl font-medium mb-8 text-[#5C3317]/80 px-4">We've sent a receipt to your email. Your cookies will be with you soon.</p>
                <Link href="/menu" className="w-full max-w-sm md:w-auto px-10 py-5 bg-[#ffc0cb] text-[#00008B] font-black tracking-widest uppercase rounded-2xl hover:bg-[#00008B] hover:text-[#ffc0cb] transition-colors shadow-xl border-4 border-[#00008B] text-center">
                    Back to Menu
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-4 md:p-6 px-4 mt-20 md:mt-32 text-center">
                <ShoppingBag size={80} className="text-[#5C3317]/20 mb-6" />
                <h1 className="text-4xl font-black mb-4 text-[#5C3317]">YOUR BAG IS EMPTY</h1>
                <Link href="/menu" className="text-[#00008B] font-bold text-lg hover:text-[#ffc0cb] transition-colors underline underline-offset-4">
                    Go grab some cookies
                </Link>
            </div>
        );
    }

    return (
        <div className="py-8 md:py-12 px-4 md:px-6 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-8 md:mb-12 text-[#5C3317]">GUEST <span className="text-[#00008B]">CHECKOUT</span></h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                    <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border-2 border-[#5C3317]/10">
                        <h2 className="text-2xl font-black text-[#00008B] border-b-2 border-[#FDF6E3] pb-4">Delivery Details</h2>

                        {error && <div className="p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-xl font-bold">{error}</div>}

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">Full Name</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border-2 border-[#FDF6E3] bg-[#FDF6E3]/50 p-4 rounded-xl outline-none focus:border-[#ffc0cb] font-medium text-[#5C3317] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">Email Address (For Receipt)</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-2 border-[#FDF6E3] bg-[#FDF6E3]/50 p-4 rounded-xl outline-none focus:border-[#ffc0cb] font-medium text-[#5C3317] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">Delivery Address</label>
                            <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border-2 border-[#FDF6E3] bg-[#FDF6E3]/50 p-4 rounded-xl outline-none focus:border-[#ffc0cb] font-medium text-[#5C3317] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">Phone Number</label>
                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-2 border-[#FDF6E3] bg-[#FDF6E3]/50 p-4 rounded-xl outline-none focus:border-[#ffc0cb] font-medium text-[#5C3317] transition-all" />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="mt-6 w-full py-5 bg-[#00008B] text-[#FDF6E3] font-black tracking-widest text-lg rounded-2xl hover:bg-[#ffc0cb] hover:text-[#00008B] transition-colors disabled:opacity-50 shadow-xl border-4 border-transparent hover:border-[#00008B]">
                            {isSubmitting ? "PROCESSING..." : `PLACE ORDER • ${total} EGP`}
                        </button>
                    </form>

                    <div className="bg-[#00008B] text-[#FDF6E3] p-6 md:p-8 rounded-[2rem] shadow-xl h-fit border-4 border-[#ffc0cb]">
                        <h2 className="text-2xl font-black border-b-2 border-[#FDF6E3]/20 pb-4 mb-6 text-[#ffc0cb]">Order Summary</h2>
                        <div className="flex flex-col gap-6 mb-8">
                            {items.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#FDF6E3]/10 p-4 rounded-xl">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border-2 border-[#ffc0cb] shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-base md:text-lg leading-tight line-clamp-2">{item.name}</p>
                                            <p className="text-[#ffc0cb] text-sm font-black">QTY: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-xl">{item.price * item.quantity} EGP</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t-4 border-[#FDF6E3]/20 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span className="font-black text-xl md:text-2xl text-[#ffc0cb]">TOTAL</span>
                            <span className="font-black text-3xl md:text-4xl">{total} EGP</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}