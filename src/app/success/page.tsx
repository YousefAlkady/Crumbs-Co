import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ orderId?: string }>;
}) {
    const params = await searchParams;
    const orderId = params.orderId ?? "";

    return (
        <div className="min-h-screen bg-[#FDF6E3] flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-xl text-center">
                {/* Celebration icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#ffc0cb] rounded-full blur-2xl opacity-50 scale-150 animate-pulse" />
                        <CheckCircle2
                            size={120}
                            className="relative text-[#00008B] drop-shadow-2xl animate-in zoom-in duration-700"
                        />
                    </div>
                </div>

                {/* Order Confirmed */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-[#5C3317] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    Order <span className="text-[#00008B]">Confirmed!</span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-[#5C3317]/80 mb-8">
                    We've sent a receipt to your email. Your cookies will be with you soon.
                </p>

                {/* Order ID box */}
                {orderId ? (
                    <div className="mb-8 p-6 md:p-8 rounded-[2rem] bg-[#00008B] border-4 border-[#ffc0cb] shadow-2xl">
                        <p className="text-[#FDF6E3]/90 font-bold uppercase tracking-widest text-sm mb-3">
                            Your Order Number
                        </p>
                        <p className="text-3xl md:text-4xl font-black text-[#ffc0cb] tracking-wider font-mono break-all">
                            {orderId}
                        </p>
                    </div>
                ) : (
                    <div className="mb-8 p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-800 font-bold">
                        No order ID in URL. If you just placed an order, check your email for confirmation.
                    </div>
                )}

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-900 text-left mb-10">
                    <span className="text-2xl shrink-0" aria-hidden>⚠️</span>
                    <p className="font-bold text-sm md:text-base leading-relaxed">
                        Please take a screenshot or save this order number for your records. You will need it if you chose Vodafone Cash/Instapay.
                    </p>
                </div>

                {/* CTA */}
                <Link
                    href="/menu"
                    className="inline-block w-full max-w-sm px-10 py-5 bg-[#ffc0cb] text-[#00008B] font-black tracking-widest uppercase rounded-2xl hover:bg-[#00008B] hover:text-[#ffc0cb] transition-colors shadow-xl border-4 border-[#00008B] text-center"
                >
                    Back to Menu
                </Link>
            </div>
        </div>
    );
}
