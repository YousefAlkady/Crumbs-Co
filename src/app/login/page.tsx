"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, Loader2, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Check if it's an allowed admin email
            const allowedAdmins = ["yoyoalk@gmail.com", "crumbsncobylana@gmail.com"];
            if (!allowedAdmins.includes(email.toLowerCase())) {
                throw new Error("Unauthorized access. This portal is for the Bakery Admin only.");
            }

            // 2. Attempt Login
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;

            // 3. Teleport to Admin Command
            router.push("/admin");

        } catch (err: any) {
            setError(err.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FDF6E3] relative overflow-hidden text-[#5C3317] font-sans p-4">

            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#ffc0cb] opacity-30 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00008B] opacity-10 blur-[120px]" />
            </div>

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#00008B] font-bold tracking-widest uppercase hover:text-[#ffc0cb] transition-colors z-20 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="w-full max-w-sm bg-[#00008B] text-[#FDF6E3] rounded-[2rem] shadow-2xl p-8 flex flex-col items-center border-4 border-[#ffc0cb] relative z-10">

                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500 mb-6 shadow-lg border-2 border-red-300">
                    <ShieldAlert className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-3xl font-black tracking-tighter mb-2 text-center text-[#ffc0cb]">
                    RESTRICTED
                </h2>
                <p className="text-[#FDF6E3]/70 font-medium text-sm mb-8 text-center px-4">
                    Authorized bakery personnel only.
                </p>

                {error && (
                    <div className="w-full p-4 mb-6 text-sm font-bold text-red-100 bg-red-500/20 border-2 border-red-500 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C3317]/50"><Mail className="w-5 h-5" /></span>
                        <input
                            name="email"
                            autoComplete="email"
                            placeholder="Admin Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-[#FDF6E3] text-[#5C3317] font-bold focus:outline-none focus:ring-4 focus:ring-[#ffc0cb] placeholder:text-[#5C3317]/40 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C3317]/50"><Lock className="w-5 h-5" /></span>
                        <input
                            name="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-[#FDF6E3] text-[#5C3317] font-bold focus:outline-none focus:ring-4 focus:ring-[#ffc0cb] placeholder:text-[#5C3317]/40 transition-all"
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-[#ffc0cb] text-[#00008B] font-black tracking-widest uppercase py-4 rounded-xl shadow-lg hover:bg-[#FDF6E3] transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'AUTHORIZE'}
                    </button>
                </form>
            </div>
        </div>
    )
}