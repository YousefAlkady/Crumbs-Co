"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import ImageCropModal from "@/components/ui/ImageCropModal";
import { UploadCloud, Loader2 } from "lucide-react";

interface EditCookieImageModalProps {
    cookieId: number;
    cookieName: string;
    onSaved: (newUrl: string) => void;
    onCancel: () => void;
}

const BUCKET = "cookie-images";

export default function EditCookieImageModal({ cookieId, cookieName, onSaved, onCancel }: EditCookieImageModalProps) {
    const [step, setStep] = useState<"upload" | "crop">("upload");
    const [cropQueue, setCropQueue] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setCropQueue([url]);
        setStep("crop");
        e.target.value = "";
    };

    const handleCropComplete = async (blob: Blob) => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Unauthorized request");
        if (cropQueue[0]) URL.revokeObjectURL(cropQueue[0]);
        setCropQueue([]);
        setStep("upload");
        setUploading(true);
        try {
            const fileName = `${cookieId}_${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, blob, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

            const { error: dbError } = await supabase.from("cookies").update({ image_url: publicUrl }).eq("id", cookieId);
            if (dbError) throw dbError;

            onSaved(publicUrl);
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleCropCancel = () => {
        if (cropQueue[0]) URL.revokeObjectURL(cropQueue[0]);
        setCropQueue([]);
        setStep("upload");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#5C3317]/90 p-4" onClick={onCancel}>
            <div className="relative w-full max-w-xl bg-[#FDF6E3] rounded-2xl shadow-2xl overflow-hidden border-4 border-[#ffc0cb]" onClick={e => e.stopPropagation()}>
                <div className="bg-[#00008B] text-[#ffc0cb] px-4 py-3">
                    <p className="font-black text-sm uppercase tracking-widest">Edit Image — {cookieName}</p>
                </div>
                {uploading && (
                    <div className="p-12 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-[#ffc0cb]" size={48} />
                        <p className="font-bold text-[#5C3317]">Uploading to Supabase...</p>
                    </div>
                )}
                {step === "upload" && !uploading && (
                    <>
                        <div className="p-8">
                            <label className="flex flex-col items-center justify-center gap-4 p-12 border-4 border-dashed border-[#5C3317]/20 rounded-2xl cursor-pointer hover:bg-[#ffc0cb]/10 hover:border-[#ffc0cb] transition-all">
                                <UploadCloud size={48} className="text-[#00008B]" />
                                <span className="font-bold text-[#5C3317]">Choose an image from your computer</span>
                                <span className="text-sm text-[#5C3317]/60">Crop to 4:3 for menu card</span>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                            </label>
                        </div>
                    </>
                )}

                {cropQueue.length > 0 && !uploading && (
                    <ImageCropModal
                        imageSrc={cropQueue[0]}
                        onComplete={handleCropComplete}
                        onCancel={handleCropCancel}
                    />
                )}

                {step === "upload" && (
                    <div className="p-4 flex justify-end border-t border-[#5C3317]/10">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 rounded-xl font-bold text-[#5C3317] bg-white border-2 border-[#5C3317]/20 hover:bg-[#ffc0cb]/30"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
