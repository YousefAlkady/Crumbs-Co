"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Trash2, Eye, EyeOff, Plus } from "lucide-react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [cookies, setCookies] = useState<any[]>([]);

    // THE BOUNCER
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const allowedAdmins = ['yoyoalk@gmail.com', 'crumbsncobylana@gmail.com'];
            if (!session || !allowedAdmins.includes(session.user.email || '')) {
                supabase.auth.signOut();
                router.push("/login");
            } else {
                fetchCookies();
            }
        });
    }, [router]);

    const fetchCookies = async () => {
        const { data } = await supabase.from('cookies').select('*').order('id', { ascending: false });
        if (data) setCookies(data);
    };

    const toggleStatus = async (id: number, field: string, value: boolean) => {
        await supabase.from('cookies').update({ [field]: !value }).eq('id', id);
        fetchCookies();
    };

    const deleteCookie = async (id: number) => {
        if (confirm("Delete this cookie forever?")) {
            await supabase.from('cookies').delete().eq('id', id);
            fetchCookies();
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b-4 border-[#00008B] pb-6 gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-[#5C3317] tracking-tighter">
                    BAKERY <span className="text-[#00008B]">INVENTORY</span>
                </h1>

                <Link href="/admin/add-cookie" className="flex items-center justify-center gap-2 bg-[#ffc0cb] text-[#00008B] px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-[#00008B] hover:text-[#ffc0cb] transition-colors border-2 border-transparent hover:border-[#ffc0cb] w-full md:w-auto">
                    <Plus size={24} /> Add Cookie
                </Link>
            </div>

            {/* INVENTORY LIST */}
            <div className="grid gap-4">
                {cookies.map(c => (
                    <div key={c.id} className="bg-white p-4 flex flex-col md:flex-row md:items-center justify-between rounded-2xl shadow-md border-l-4 border-[#00008B] gap-4">

                        <div className="flex items-center gap-4">
                            {/* Uses the first image in the array, or falls back to the old image_url */}
                            <img src={(c.images && c.images.length > 0) ? c.images[0] : c.image_url} alt={c.name} className="w-16 h-16 rounded-lg object-cover border border-[#5C3317]/10" />
                            <div>
                                <p className="font-bold text-lg text-[#5C3317]">{c.name}</p>
                                <p className="text-sm font-medium text-[#5C3317]/60">{c.price} EGP</p>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button onClick={() => toggleStatus(c.id, 'in_stock', c.in_stock)} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider ${c.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {c.in_stock ? "Stocked" : "Out"}
                            </button>
                            <button onClick={() => toggleStatus(c.id, 'is_hidden', c.is_hidden)} className="p-3 transition-colors bg-gray-50 hover:bg-gray-200 rounded-lg">
                                {c.is_hidden ? <EyeOff className="text-gray-400" size={20} /> : <Eye className="text-[#00008B]" size={20} />}
                            </button>
                            <button onClick={() => deleteCookie(c.id)} className="text-white bg-red-500 p-3 hover:bg-red-600 rounded-lg transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>

                    </div>
                ))}

                {cookies.length === 0 && (
                    <div className="text-center p-8 bg-white rounded-2xl border-2 border-dashed border-[#5C3317]/20 text-[#5C3317]/50 font-bold">
                        No cookies in inventory. Start baking!
                    </div>
                )}
            </div>
        </div>
    );
}