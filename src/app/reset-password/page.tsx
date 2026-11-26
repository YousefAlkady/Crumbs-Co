"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Opened from the reset email: Supabase checks the link and signs the user in for recovery,
// then a new password can be saved. Without a valid link the form is not shown.
export default function ResetPasswordPage() {
    const router = useRouter();
    const [status, setStatus] = useState<"checking" | "ready" | "invalid" | "saving" | "done">("checking");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let live = true;
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (live && event === "PASSWORD_RECOVERY") setStatus("ready");
        });
        supabase.auth.getSession().then(({ data }) => {
            if (live) setStatus((s) => (s === "checking" ? (data.session ? "ready" : "invalid") : s));
        });
        return () => { live = false; sub.subscription.unsubscribe(); };
    }, []);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password.length < 8) return setError("Use at least 8 characters.");
        if (password !== confirm) return setError("The two passwords do not match.");
        setStatus("saving");
        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) { setError(err.message); setStatus("ready"); return; }
        setStatus("done");
        setTimeout(() => router.push("/admin"), 1500);
    };

    const input = "w-full pl-12 pr-4 py-4 rounded-xl border-none bg-[#FDF6E3] text-[#5C3317] font-bold focus:outline-none focus:ring-4 focus:ring-[#ffc0cb] placeholder:text-[#5C3317]/40 transition-all";

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FDF6E3] text-[#5C3317] p-4">
            <div className="w-full max-w-sm bg-[#00008B] text-[#FDF6E3] rounded-[2rem] shadow-2xl p-8 flex flex-col items-center border-4 border-[#ffc0cb]">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ffc0cb] mb-6 shadow-lg">
                    <KeyRound className="w-8 h-8 text-[#00008B]" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter mb-6 text-center text-[#ffc0cb]">NEW PASSWORD</h1>

                {status === "checking" && <p className="font-bold">Checking your reset link…</p>}
                {status === "invalid" && (
                    <div className="text-center">
                        <p className="font-bold mb-4">This reset link is invalid or has expired.</p>
                        <Link href="/login" className="inline-block bg-[#ffc0cb] text-[#00008B] font-black uppercase tracking-widest px-6 py-3 rounded-xl">Back to log in</Link>
                    </div>
                )}
                {(status === "ready" || status === "saving") && (
                    <form onSubmit={save} className="w-full flex flex-col gap-4">
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C3317]/50"><Lock className="w-5 h-5" /></span>
                            <input type="password" autoComplete="new-password" placeholder="New password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C3317]/50"><Lock className="w-5 h-5" /></span>
                            <input type="password" autoComplete="new-password" placeholder="Repeat new password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} />
                        </div>
                        {error && <div className="w-full p-3 text-sm font-bold text-red-100 bg-red-500/20 border-2 border-red-500 rounded-xl text-center" role="alert">{error}</div>}
                        <button type="submit" disabled={status === "saving"} className="w-full bg-[#ffc0cb] text-[#00008B] font-black tracking-widest uppercase py-4 rounded-xl shadow-lg hover:bg-[#FDF6E3] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                            {status === "saving" ? <Loader2 className="w-5 h-5 animate-spin" /> : "SAVE PASSWORD"}
                        </button>
                    </form>
                )}
                {status === "done" && <p className="font-bold text-center">Password updated. Taking you to the dashboard…</p>}
            </div>
        </div>
    );
}
