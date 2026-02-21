"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { uploadImage, API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        setError("");
        setUploading(true);
        try {
            const result = await uploadImage(token, file);
            onChange(result.url);
        } catch (err: any) {
            setError(err.message || "Upload gagal");
        } finally {
            setUploading(false);
        }
    };

    const imageUrl = value?.startsWith("/uploads") ? `${API_URL}${value}` : value;

    return (
        <div className="space-y-2">
            {value ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <Image src={imageUrl} alt="Uploaded" fill className="object-cover" unoptimized />
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 bg-white/5 cursor-pointer transition-colors">
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                        <>
                            <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                            <span className="text-sm text-gray-400">Click to upload image</span>
                            <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP, GIF (max 5MB)</span>
                        </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
            )}
            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    );
}
