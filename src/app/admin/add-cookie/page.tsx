"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, UploadCloud, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddCookiePage() {
    const router = useRouter();

    // THE BOUNCER
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const allowedAdmins = ['yoyoalk@gmail.com', 'crumbsncobylana@gmail.com'];
            if (!session || !allowedAdmins.includes(session.user.email || '')) {
                supabase.auth.signOut();
                router.push("/login");
            }
        });
    }, [router]);

    // Text Inputs
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    // Image Upload State
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...selectedFiles]);

            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return alert("Please select at least one image!");
        setUploading(true);

        try {
            const uploadedUrls: string[] = [];

            for (const file of files) {
                const fileName = `${Date.now()}_${file.name}`;
                const { error: uploadError } = await supabase.storage
                    .from('cookie-images')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('cookie-images').getPublicUrl(fileName);
                uploadedUrls.push(publicUrl);
            }

            const { error: dbError } = await supabase.from('cookies').insert([{
                name,
                description,
                price: parseFloat(price),
                images: uploadedUrls,
                image_url: uploadedUrls[0],
                is_hidden: false,
                in_stock: true
            }]);

            if (dbError) throw dbError;

            alert("Cookie Created Successfully!");
            router.push("/admin");

        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen">

            <Link href="/admin" className="inline-flex items-center gap-2 text-[#00008B] font-bold tracking-widest uppercase hover:text-[#ffc0cb] transition-colors mb-8 bg-white px-4 py-2 rounded-xl shadow-md">
                <ArrowLeft size={20} /> Back to Inventory
            </Link>

            <form onSubmit={handleCreateProduct} className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border-4 border-[#FDF6E3]">
                <h1 className="text-4xl md:text-5xl font-black text-[#5C3317] mb-8 tracking-tighter">
                    NEW <span className="text-[#ffc0cb]">COOKIE</span>
                </h1>

                <div className="flex flex-col gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-black uppercase tracking-widest text-[#5C3317]/50 mb-2">Display Name</label>
                        <input required placeholder="e.g. The Midnight Chocolate Chunk" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 rounded-xl bg-[#FDF6E3]/50 border-2 border-[#FDF6E3] font-black text-2xl text-[#00008B] outline-none focus:border-[#ffc0cb] transition-colors placeholder:text-[#00008B]/20" />
                    </div>

                    <div>
                        <label className="block text-sm font-black uppercase tracking-widest text-[#5C3317]/50 mb-2">Description</label>
                        <textarea required placeholder="Rich, gooey, and packed with Belgian chocolate..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 rounded-xl bg-[#FDF6E3]/50 border-2 border-[#FDF6E3] font-medium text-lg text-[#5C3317] outline-none focus:border-[#ffc0cb] transition-colors min-h-[120px] placeholder:text-[#5C3317]/30" />
                    </div>

                    <div>
                        <label className="block text-sm font-black uppercase tracking-widest text-[#5C3317]/50 mb-2">Price (EGP)</label>
                        <input required type="number" placeholder="45" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full md:w-1/3 p-4 rounded-xl bg-[#FDF6E3]/50 border-2 border-[#FDF6E3] font-black text-xl text-[#00008B] outline-none focus:border-[#ffc0cb] transition-colors" />
                    </div>
                </div>

                <div className="mb-10 p-6 bg-[#FDF6E3]/30 rounded-2xl border-2 border-dashed border-[#5C3317]/10">
                    <label className="block text-sm font-black uppercase tracking-widest text-[#5C3317]/50 mb-4">
                        Cookie Gallery <span className="text-[#ffc0cb] font-bold lowercase">(First image is the cover)</span>
                    </label>

                    <div className="flex flex-wrap gap-4">
                        {previews.map((src, index) => (
                            <div key={index} className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl border-4 border-[#ffc0cb] overflow-hidden group shadow-md">
                                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110">
                                    <X size={16} />
                                </button>
                                <div className="absolute bottom-0 left-0 w-full bg-[#00008B]/90 text-[#ffc0cb] text-[10px] font-black tracking-widest text-center py-1.5">
                                    {index === 0 ? "COVER" : `SLIDE ${index + 1}`}
                                </div>
                            </div>
                        ))}

                        <label className="w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center gap-2 border-4 border-dashed border-[#5C3317]/20 rounded-xl cursor-pointer hover:bg-white hover:border-[#ffc0cb] transition-all text-[#5C3317]/50 hover:text-[#00008B] shadow-sm hover:shadow-md">
                            <UploadCloud size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Add Images</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                        </label>
                    </div>
                </div>

                <button disabled={uploading} type="submit" className="w-full py-5 bg-[#00008B] text-[#FDF6E3] rounded-xl font-black text-xl tracking-widest uppercase hover:bg-[#ffc0cb] hover:text-[#00008B] transition-colors disabled:opacity-50 shadow-xl flex items-center justify-center gap-3 border-4 border-transparent hover:border-[#00008B]">
                    {uploading ? <Loader2 className="animate-spin" /> : null}
                    {uploading ? "BAKING PRODUCT..." : "CREATE COOKIE"}
                </button>
            </form>
        </div>
    );
}