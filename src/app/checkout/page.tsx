"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MOQ = 2;
const DELIVERY_FEE = 50;
const ALLOWED_CITIES = ["6th of October City", "Sheikh Zayed City"] as const;

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart } = useCart();
    const subtotal = total;
    const finalTotal = subtotal + DELIVERY_FEE;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const belowMoq = totalItems < MOQ;

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");

    // Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
            if (totalQuantity < 2) {
                throw new Error("Minimum order requirement of 2 cookies not met.");
            }
            if (!city || !ALLOWED_CITIES.includes(city as typeof ALLOWED_CITIES[number])) {
                throw new Error("Please select a valid delivery city.");
            }

            const fullAddress = `${address.trim()}, ${city}, Egypt`;
            const orderNumber = "CRUMB-" + Math.floor(10000 + Math.random() * 90000);

            // 1. Save the order to Supabase
            const { data, error: supabaseError } = await supabase
                .from('orders')
                .insert([{
                    order_number: orderNumber,
                    customer_name: name,
                    customer_email: email,
                    customer_address: fullAddress,
                    customer_phone: phone,
                    total_amount: finalTotal,
                    items: items,
                    status: 'pending',
                    additional_notes: additionalNotes.trim() || null
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
                    orderNumber,
                    additional_notes: additionalNotes.trim() || null,
                    total: finalTotal,
                    items
                })
            });

            // 3. Redirect to success page with order ID
            clearCart();
            router.push(`/success?orderId=${encodeURIComponent(orderNumber)}`);

        } catch (err: any) {
            console.error("Order error:", err);
            setError(err?.message ?? "Something went wrong placing your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

                        {belowMoq && <div className="p-4 rounded-xl bg-amber-100 border-2 border-amber-500 text-amber-800 font-bold text-center">A minimum of 2 cookies is required per order.</div>}
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
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">Country</label>
                            <input type="text" value="Egypt" readOnly disabled className="w-full border-2 border-[#5C3317]/20 bg-[#5C3317]/5 p-4 rounded-xl font-medium text-[#5C3317]/70 cursor-not-allowed" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">City</label>
                            <select
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full border-2 border-[#FDF6E3] bg-[#FDF6E3]/50 p-4 rounded-xl outline-none focus:border-[#ffc0cb] font-medium text-[#5C3317] transition-all"
                            >
                                <option value="">Select your city...</option>
                                {ALLOWED_CITIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">Street / Building Address</label>
                            <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Building, floor, apartment, landmarks..." className="w-full border-2 border-[#FDF6E3] bg-[#FDF6E3]/50 p-4 rounded-xl outline-none focus:border-[#ffc0cb] font-medium text-[#5C3317] transition-all placeholder:text-[#5C3317]/40" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">Phone Number</label>
                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-2 border-[#FDF6E3] bg-[#FDF6E3]/50 p-4 rounded-xl outline-none focus:border-[#ffc0cb] font-medium text-[#5C3317] transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase text-[#5C3317]/80">Additional Notes <span className="text-[#5C3317]/50 font-normal">(Optional)</span></label>
                            <textarea
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                placeholder="Delivery instructions, allergies, special requests..."
                                rows={3}
                                className="w-full border-2 border-[#FDF6E3] bg-[#FDF6E3]/50 p-4 rounded-xl outline-none focus:border-[#ffc0cb] font-medium text-[#5C3317] transition-all resize-none"
                            />
                        </div>
                        <button type="submit" disabled={isSubmitting || belowMoq} className="mt-6 w-full py-5 bg-[#00008B] text-[#FDF6E3] font-black tracking-widest text-lg rounded-2xl hover:bg-[#ffc0cb] hover:text-[#00008B] transition-colors disabled:opacity-50 shadow-xl border-4 border-transparent hover:border-[#00008B]">
                            {isSubmitting ? "PROCESSING..." : `PLACE ORDER • ${finalTotal} EGP`}
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
                        <div className="border-t-4 border-[#FDF6E3]/20 pt-6 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-[#FDF6E3]/90">Subtotal</span>
                                <span className="font-black text-xl">{subtotal} EGP</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-[#FDF6E3]/90">Delivery</span>
                                <span className="font-black text-xl text-[#ffc0cb]">+ 50 EGP</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t-2 border-[#FDF6E3]/20">
                                <span className="font-black text-xl md:text-2xl text-[#ffc0cb]">Final Total</span>
                                <span className="font-black text-3xl md:text-4xl">{finalTotal} EGP</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}