"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

export const CARD_ASPECT = 4 / 3;

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
    );
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas toBlob failed"));
        }, "image/jpeg", 0.92);
    });
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

interface ImageCropModalProps {
    imageSrc: string;
    onComplete: (blob: Blob) => void;
    onCancel: () => void;
}

export default function ImageCropModal({ imageSrc, onComplete, onCancel }: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [processing, setProcessing] = useState(false);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleDone = async () => {
        if (!croppedAreaPixels) return;
        setProcessing(true);
        try {
            const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
            onComplete(blob);
        } catch (e) {
            console.error(e);
            alert("Failed to crop image");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#5C3317]/90 p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FDF6E3] rounded-2xl shadow-2xl overflow-hidden border-4 border-[#ffc0cb]">
                <div className="bg-[#00008B] text-[#ffc0cb] px-4 py-3 flex justify-between items-center">
                    <p className="font-black text-sm uppercase tracking-widest">
                        Crop to <span className="text-[#FDF6E3]">4:3</span> — matches menu card
                    </p>
                </div>
                <div className="relative w-full h-[50vh] min-h-[300px]">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={CARD_ASPECT}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        style={{ cropAreaStyle: { border: "3px solid #ffc0cb" } }}
                    />
                </div>
                <div className="p-4 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center gap-3">
                        <label className="text-xs font-black uppercase text-[#5C3317] shrink-0">Zoom</label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 accent-[#00008B]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-xl font-bold text-[#5C3317] bg-[#FDF6E3] border-2 border-[#5C3317]/20 hover:bg-[#ffc0cb]/30 hover:border-[#ffc0cb] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDone}
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl font-black bg-[#00008B] text-[#ffc0cb] hover:bg-[#ffc0cb] hover:text-[#00008B] border-2 border-transparent hover:border-[#00008B] disabled:opacity-50 transition-colors"
                        >
                            {processing ? "Processing..." : "Save Crop"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
