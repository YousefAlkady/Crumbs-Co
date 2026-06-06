"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { productEditSchema } from "@/lib/validations/product";
import { Trash2, Eye, EyeOff, Plus, Search, ChevronDown, ChevronUp, CheckCircle2, Pencil, XCircle } from "lucide-react";
import { ZodError } from "zod";

type Tab = "inventory" | "orders";

interface Product {
    id: number;
    name: string;
    price: number;
    description?: string | null;
    is_favorite?: boolean;
}

function EditProductModal({
    product,
    favoritesCount,
    onSave,
    onCancel,
}: {
    product: Product;
    favoritesCount: number;
    onSave: (updates: { name: string; price: number; description: string; is_favorite: boolean }) => Promise<void>;
    onCancel: () => void;
}) {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(String(product.price));
    const [description, setDescription] = useState(product.description ?? "");
    const [isFavorite, setIsFavorite] = useState(!!product.is_favorite);
    const [saving, setSaving] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSave = async () => {
        setValidationError(null);
        if (isFavorite && !product.is_favorite && favoritesCount >= 3) {
            setValidationError("Maximum 3 crowd favorites allowed. Uncheck one first.");
            return;
        }
        setSaving(true);
        try {
            const rawData = {
                name: name.trim() || product.name,
                price: parseFloat(price),
                description: description.trim(),
                is_favorite: isFavorite,
            };
            const validated = productEditSchema.parse(rawData);
            await onSave(validated);
        } catch (err) {
            if (err instanceof ZodError) {
                const first = err.issues[0];
                const message = first?.message ?? "Invalid data";
                setValidationError(message);
                return;
            }
            throw err;
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#5C3317]/90 p-4" onClick={onCancel}>
            <div className="relative w-full max-w-lg bg-[#FDF6E3] rounded-2xl shadow-2xl overflow-hidden border-4 border-[#ffc0cb]" onClick={(e) => e.stopPropagation()}>
                <div className="bg-[#00008B] text-[#ffc0cb] px-4 py-3">
                    <p className="font-black text-sm uppercase tracking-widest">Edit Product</p>
                </div>
                <div className="p-6 space-y-4">
                    {validationError && (
                        <div className="p-4 rounded-xl bg-red-100 border-2 border-red-300 text-red-800 font-bold text-sm text-center">
                            {validationError}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-black uppercase text-[#5C3317]/60 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-[#5C3317]/20 bg-white text-[#5C3317] font-medium focus:border-[#ffc0cb] focus:ring-2 focus:ring-[#ffc0cb]/30 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-[#5C3317]/60 mb-1">Price (EGP)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-[#5C3317]/20 bg-white text-[#5C3317] font-medium focus:border-[#ffc0cb] focus:ring-2 focus:ring-[#ffc0cb]/30 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase text-[#5C3317]/60 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full p-3 rounded-xl border-2 border-[#5C3317]/20 bg-white text-[#5C3317] font-medium focus:border-[#ffc0cb] focus:ring-2 focus:ring-[#ffc0cb]/30 outline-none resize-none"
                        />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-bold text-[#5C3317]">Crowd Favorite</span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isFavorite}
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${isFavorite ? "bg-[#00008B]" : "bg-[#5C3317]/20"}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isFavorite ? "left-7" : "left-1"}`} />
                        </button>
                    </label>
                </div>
                <div className="p-4 flex justify-end gap-3 border-t border-[#5C3317]/10">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 rounded-xl font-bold text-[#5C3317] bg-white border-2 border-[#5C3317]/20 hover:bg-[#ffc0cb]/30"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl font-bold bg-[#00008B] text-[#ffc0cb] hover:bg-[#00007B] disabled:opacity-70"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
type OrderSubTab = "new" | "completed" | "canceled";

interface Order {
    id: number;
    order_number?: string;
    customer_name: string;
    customer_email?: string;
    customer_address: string;
    customer_phone: string;
    total_amount: number;
    items: { id: number; name: string; price: number; quantity: number; image?: string }[];
    status: string;
    additional_notes?: string | null;
    created_at: string;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("inventory");
    const [orderSubTab, setOrderSubTab] = useState<OrderSubTab>("new");
    const [orderSearch, setOrderSearch] = useState("");

    const [cookies, setCookies] = useState<any[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    // THE BOUNCER - use onAuthStateChange so we wait for Supabase to restore session from storage
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event !== 'INITIAL_SESSION') return;
            const allowedAdmins = ['crumbncobylana@gmail.com', 'yoyoalk@gmail.com'];
            const email = (session?.user?.email || '').toLowerCase();
            if (!session || !allowedAdmins.includes(email)) {
                await supabase.auth.signOut({ scope: 'local' });
                router.push("/login");
                return;
            }
            fetchCookies();
            fetchOrders();
        });
        return () => subscription.unsubscribe();
    }, []);

    const fetchCookies = async () => {
        const { data, error } = await supabase.from('cookies').select('*').order('id', { ascending: false });
        if (error) {
            console.error('[fetchCookies] Supabase error:', error);
            console.error('[fetchCookies] Error details:', { message: error.message, code: error.code, details: error.details });
            return;
        }
        if (data) setCookies(data);
    };

    const fetchOrders = async () => {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('[fetchOrders] Supabase error:', error);
            console.error('[fetchOrders] Error details:', { message: error.message, code: error.code, details: error.details });
            return;
        }
        if (data) setOrders(data as Order[]);
    };

    const toggleStatus = async (id: number, field: string, value: boolean) => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) throw new Error("Unauthorized request");
        await supabase.from('cookies').update({ [field]: !value }).eq('id', id);
        fetchCookies();
    };

    const deleteCookie = async (id: number) => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) throw new Error("Unauthorized request");
        if (confirm("Delete this cookie forever?")) {
            await supabase.from('cookies').delete().eq('id', id);
            fetchCookies();
        }
    };

    const favoritesCount = useMemo(() => cookies.filter((c: any) => c.is_favorite === true).length, [cookies]);

    const toggleFavorite = async (c: any) => {
        if (c.is_favorite && favoritesCount <= 3) {
            await supabase.from('cookies').update({ is_favorite: false }).eq('id', c.id);
            fetchCookies();
            return;
        }
        if (!c.is_favorite && favoritesCount >= 3) {
            alert("Maximum 3 crowd favorites allowed. Uncheck one first.");
            return;
        }
        await supabase.from('cookies').update({ is_favorite: !c.is_favorite }).eq('id', c.id);
        fetchCookies();
    };

    const clearCompletedOrders = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete all completed orders? This cannot be undone."
        );
        if (!confirmed) return;
        const { error } = await supabase.from("orders").delete().eq("status", "completed");
        if (error) {
            toast.error(`Failed: ${error.message}`);
            return;
        }
        fetchOrders();
        setExpandedOrderId(null);
        toast.success("Completed orders cleared.");
    };

    const markOrderCompleted = async (order: Order, e: React.MouseEvent) => {
        e.stopPropagation();
        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', order.id)
            .select();
        if (error) {
            alert(`Error: ${error.message}`);
            return;
        }
        if (!data || data.length === 0) {
            alert("Action blocked! Supabase couldn't update this order.");
            return;
        }
        fetchOrders();
        setExpandedOrderId(null);
    };

    const markOrderCanceled = async (order: Order, e: React.MouseEvent) => {
        e.stopPropagation();
        const confirmed = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmed) return;
        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'canceled' })
            .eq('id', order.id)
            .select();
        if (error) {
            toast.error(`Failed: ${error.message}`);
            return;
        }
        if (!data || data.length === 0) {
            toast.error("Could not cancel order.");
            return;
        }
        fetchOrders();
        setExpandedOrderId(null);
        toast.success("Order canceled.");
    };

    const clearCanceledOrders = async () => {
        const confirmed = window.confirm(
            "Permanently delete all canceled orders? This cannot be undone."
        );
        if (!confirmed) return;
        const { error } = await supabase.from("orders").delete().eq("status", "canceled");
        if (error) {
            toast.error(`Failed: ${error.message}`);
            return;
        }
        fetchOrders();
        setExpandedOrderId(null);
        toast.success("Canceled orders cleared.");
    };

    const getTimeElapsed = (createdAt: string) => {
        const then = new Date(createdAt).getTime();
        const now = Date.now();
        const mins = Math.floor((now - then) / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    const pendingOrders = useMemo(() => orders.filter(o => (o.status || '').toLowerCase() === 'pending'), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => (o.status || '').toLowerCase() === 'completed'), [orders]);
    const canceledOrders = useMemo(() => orders.filter(o => (o.status || '').toLowerCase() === 'canceled'), [orders]);

    const newOrdersCount = pendingOrders.length;
    const completedOrdersCount = completedOrders.length;
    const canceledOrdersCount = canceledOrders.length;

    const displayedOrders = orderSubTab === "new" ? pendingOrders : orderSubTab === "completed" ? completedOrders : canceledOrders;

    const filteredOrders = useMemo(() => {
        if (!orderSearch.trim()) return displayedOrders;
        const q = orderSearch.toLowerCase().trim();
        return displayedOrders.filter(o => {
            const orderNum = (o.order_number ?? `#${o.id}`).toLowerCase();
            const name = (o.customer_name ?? "").toLowerCase();
            const phone = (o.customer_phone ?? "").replace(/\s/g, "");
            const phoneNoSpaces = phone.replace(/\D/g, "").slice(-8);
            return orderNum.includes(q) || name.includes(q) || phone.includes(q) || phoneNoSpaces.includes(q.replace(/\D/g, "").slice(-8));
        });
    }, [displayedOrders, orderSearch]);

    return (
        <div className="p-4 md:p-6 lg:p-10 max-w-5xl mx-auto min-h-screen bg-[#FDF6E3] overflow-x-hidden">

            {/* TOP-LEVEL TABS */}
            <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-[#5C3317]/20 pb-4">
                <button
                    onClick={() => setActiveTab("inventory")}
                    className={`px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-black uppercase tracking-widest transition-all ${activeTab === "inventory"
                        ? "bg-[#00008B] text-[#ffc0cb] shadow-lg"
                        : "bg-white text-[#5C3317]/70 hover:bg-[#ffc0cb]/20 hover:text-[#5C3317]"}`}
                >
                    Inventory
                </button>
                <button
                    onClick={() => setActiveTab("orders")}
                    className={`px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-black uppercase tracking-widest transition-all ${activeTab === "orders"
                        ? "bg-[#00008B] text-[#ffc0cb] shadow-lg"
                        : "bg-white text-[#5C3317]/70 hover:bg-[#ffc0cb]/20 hover:text-[#5C3317]"}`}
                >
                    Orders
                </button>
            </div>

            {/* DASHBOARD OVERVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="rounded-2xl bg-[#00008B] text-white p-6 shadow-lg border-2 border-[#00008B]">
                    <p className="text-[#ffc0cb] font-bold text-sm uppercase tracking-widest mb-2">New Orders</p>
                    <p className="text-4xl md:text-5xl font-black">{newOrdersCount}</p>
                </div>
                <div className="rounded-2xl bg-[#ffc0cb] text-[#5C3317] p-6 shadow-lg border-2 border-[#5C3317]/20">
                    <p className="text-[#5C3317]/80 font-bold text-sm uppercase tracking-widest mb-2">Completed Orders</p>
                    <p className="text-4xl md:text-5xl font-black">{completedOrdersCount}</p>
                </div>
                <div className="rounded-2xl bg-gray-600 text-white p-6 shadow-lg border-2 border-gray-500">
                    <p className="text-gray-200 font-bold text-sm uppercase tracking-widest mb-2">Canceled Orders</p>
                    <p className="text-4xl md:text-5xl font-black">{canceledOrdersCount}</p>
                </div>
            </div>

            {/* INVENTORY TAB */}
            {activeTab === "inventory" && (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-4 border-[#00008B] pb-6 gap-4">
                        <h1 className="text-4xl md:text-5xl font-black text-[#5C3317] tracking-tighter">
                            BAKERY <span className="text-[#00008B]">INVENTORY</span>
                        </h1>
                        <Link href="/admin/add-cookie" className="flex items-center justify-center gap-2 bg-[#ffc0cb] text-[#00008B] px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-[#00008B] hover:text-[#ffc0cb] transition-colors border-2 border-transparent hover:border-[#ffc0cb] w-full md:w-auto">
                            <Plus size={24} /> Add Cookie
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {cookies.map(c => (
                            <div key={c.id} className="bg-white p-4 flex flex-col md:flex-row md:items-center justify-between rounded-2xl shadow-md border-l-4 border-[#00008B] gap-4">
                                <div className="flex items-center gap-4">
                                    <img src={(c.images && c.images.length > 0) ? c.images[0] : c.image_url} alt={c.name} className="w-16 h-16 rounded-lg object-cover border border-[#5C3317]/10" />
                                    <div>
                                        <p className="font-bold text-lg text-[#5C3317]">{c.name}</p>
                                        <p className="text-sm font-medium text-[#5C3317]/60">{c.price} EGP</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 justify-end">
                                    <button onClick={() => toggleStatus(c.id, 'in_stock', c.in_stock)} className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider ${c.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {c.in_stock ? "Stocked" : "Out"}
                                    </button>
                                    <label className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs font-bold text-[#5C3317]/70 uppercase tracking-wider">Crowd Favorite</span>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={!!c.is_favorite}
                                            onClick={() => toggleFavorite(c)}
                                            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${c.is_favorite ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform left-1" style={{ transform: c.is_favorite ? 'translateX(20px)' : 'translateX(0)' }} />
                                        </button>
                                    </label>
                                    <button onClick={() => setEditingProductId(c.id)} className="flex items-center gap-1.5 px-4 py-2 bg-[#00008B] text-[#ffc0cb] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#ffc0cb] hover:text-[#00008B] transition-colors shrink-0">
                                        <Pencil size={16} /> Edit
                                    </button>
                                    <button onClick={() => toggleStatus(c.id, 'is_hidden', c.is_hidden)} className="p-3 transition-colors bg-gray-50 hover:bg-gray-200 rounded-lg" title={c.is_hidden ? "Show" : "Hide"}>
                                        {c.is_hidden ? <EyeOff className="text-gray-400" size={20} /> : <Eye className="text-[#00008B]" size={20} />}
                                    </button>
                                    <button onClick={() => deleteCookie(c.id)} className="text-white bg-red-500 p-3 hover:bg-red-600 rounded-lg transition-colors" title="Delete">
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
                </>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h1 className="text-4xl md:text-5xl font-black text-[#5C3317] tracking-tighter">
                            ORDER <span className="text-[#00008B]">MANAGEMENT</span>
                        </h1>
                    </div>

                    {/* Order Sub-Tabs */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <button
                            onClick={() => setOrderSubTab("new")}
                            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all ${orderSubTab === "new"
                                ? "bg-[#ffc0cb] text-[#00008B] shadow-md"
                                : "bg-white text-[#5C3317]/60 hover:bg-[#ffc0cb]/30"}`}
                        >
                            New Orders {pendingOrders.length > 0 && <span className="ml-1 bg-[#00008B] text-[#ffc0cb] px-2 py-0.5 rounded-full text-xs">{pendingOrders.length}</span>}
                        </button>
                        <button
                            onClick={() => setOrderSubTab("completed")}
                            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all ${orderSubTab === "completed"
                                ? "bg-green-100 text-green-800 shadow-md"
                                : "bg-white text-[#5C3317]/60 hover:bg-green-50"}`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setOrderSubTab("canceled")}
                            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all ${orderSubTab === "canceled"
                                ? "bg-gray-200 text-gray-800 shadow-md"
                                : "bg-white text-[#5C3317]/60 hover:bg-gray-100"}`}
                        >
                            Canceled {canceledOrdersCount > 0 && <span className="ml-1 bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs">{canceledOrdersCount}</span>}
                        </button>
                        {completedOrdersCount > 0 && orderSubTab === "completed" && (
                            <button
                                onClick={clearCompletedOrders}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 transition-colors ml-auto"
                            >
                                <Trash2 size={18} /> Clear All Completed Orders
                            </button>
                        )}
                        {canceledOrdersCount > 0 && orderSubTab === "canceled" && (
                            <button
                                onClick={clearCanceledOrders}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 transition-colors ml-auto"
                            >
                                <Trash2 size={18} /> Clear All Canceled Orders
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C3317]/50" size={20} />
                        <input
                            type="text"
                            placeholder="Search by order #, name, or phone..."
                            value={orderSearch}
                            onChange={(e) => setOrderSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#5C3317]/10 bg-white focus:border-[#ffc0cb] focus:ring-2 focus:ring-[#ffc0cb]/30 outline-none font-medium text-[#5C3317]"
                        />
                    </div>

                    {/* Order Cards */}
                    <div className="flex flex-col gap-4">
                        {filteredOrders.length === 0 && (
                            <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-[#5C3317]/20 text-[#5C3317]/50 font-bold">
                                {orderSearch ? "No orders match your search." : orderSubTab === "new" ? "No new orders." : orderSubTab === "completed" ? "No completed orders yet." : "No canceled orders."}
                            </div>
                        )}
                        {filteredOrders.map((order) => {
                            const isExpanded = expandedOrderId === order.id;
                            const orderNum = order.order_number ?? `#${order.id}`;
                            return (
                                <div
                                    key={order.id}
                                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                    className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                                        (order.status || '').toLowerCase() === 'completed'
                                            ? "border-green-200 hover:border-green-300"
                                            : (order.status || '').toLowerCase() === 'canceled'
                                                ? "border-gray-300 hover:border-gray-400"
                                                : "border-[#ffc0cb]/50 hover:border-[#ffc0cb]"
                                    }`}
                                >
                                    {/* Card Header (always visible) */}
                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="font-black text-[#00008B] text-lg">{orderNum}</span>
                                            <span className="text-[#5C3317] font-bold">{order.customer_name}</span>
                                            <span className="text-[#5C3317]/70 font-bold">{order.total_amount} EGP</span>
                                            <span className="text-sm text-[#5C3317]/50">{getTimeElapsed(order.created_at)}</span>
                                            {(order.status || '').toLowerCase() === 'completed' && (
                                                <span className="px-2 py-0.5 rounded-lg bg-green-100 text-green-700 font-bold text-xs uppercase">Completed</span>
                                            )}
                                            {(order.status || '').toLowerCase() === 'pending' && (
                                                <span className="px-2 py-0.5 rounded-lg bg-[#ffc0cb]/30 text-[#00008B] font-bold text-xs uppercase">Pending</span>
                                            )}
                                            {(order.status || '').toLowerCase() === 'canceled' && (
                                                <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 font-bold text-xs uppercase">Canceled</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                            {(order.status || '').toLowerCase() === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={(e) => markOrderCompleted(order, e)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 transition-colors uppercase text-sm"
                                                    >
                                                        <CheckCircle2 size={18} /> Mark as Completed
                                                    </button>
                                                    <button
                                                        onClick={(e) => markOrderCanceled(order, e)}
                                                        className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-600 font-black rounded-xl hover:bg-red-50 transition-colors uppercase text-sm"
                                                    >
                                                        <XCircle size={18} /> Cancel
                                                    </button>
                                                </>
                                            )}
                                            <span className="text-[#5C3317]/50">
                                                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t-2 border-[#5C3317]/10 p-4 bg-[#FDF6E3]/30">
                                            <div className="grid gap-4">
                                                <div>
                                                    <p className="text-xs font-black uppercase text-[#5C3317]/60 mb-1">Items</p>
                                                    <div className="flex flex-col gap-2">
                                                        {order.items?.map((item: any, i: number) => (
                                                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#5C3317]/10">
                                                                <span className="font-bold text-[#5C3317]">{item.name} × {item.quantity}</span>
                                                                <span className="font-black text-[#00008B]">{item.price * item.quantity} EGP</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase text-[#5C3317]/60 mb-1">Delivery Address</p>
                                                    <p className="font-medium text-[#5C3317]">{order.customer_address || "—"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase text-[#5C3317]/60 mb-1">Phone</p>
                                                    <a href={`tel:${order.customer_phone}`} className="font-bold text-[#00008B] hover:text-[#ffc0cb] transition-colors">{order.customer_phone || "—"}</a>
                                                </div>
                                                {order.additional_notes && (
                                                    <div className="p-4 rounded-xl bg-[#ffc0cb]/30 border-2 border-[#ffc0cb]">
                                                        <p className="text-xs font-black uppercase text-[#00008B] mb-1">Additional Notes</p>
                                                        <p className="font-bold text-[#5C3317]">{order.additional_notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Edit Product Modal */}
            {editingProductId !== null && (() => {
                const product = cookies.find((c: any) => c.id === editingProductId);
                if (!product) return null;
                return (
                <EditProductModal
                    product={product}
                    favoritesCount={favoritesCount}
                    onSave={async (updates) => {
                        const { data: { user }, error: authError } = await supabase.auth.getUser();
                        if (authError || !user) throw new Error("Unauthorized request");
                        const { error } = await supabase.from("cookies").update(updates).eq("id", editingProductId);
                        if (error) {
                            alert(`Error: ${error.message}`);
                            return;
                        }
                        fetchCookies();
                        setEditingProductId(null);
                    }}
                    onCancel={() => setEditingProductId(null)}
                />
                );
            })()}
        </div>
    );
}
