"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createExperience } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewExperiencePage() {
    const { token } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "", company: "", period: "", description: "", icon: "", sort_order: 0,
    });

    const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));
    const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-[#10B981] focus:ring-[#10B981]/20";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setError(""); setSaving(true);
        try {
            await createExperience(token, form);
            router.push("/admin/experiences");
        } catch (err: any) { setError(err.message || "Gagal menyimpan"); }
        setSaving(false);
    };

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/experiences"><Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"><ArrowLeft className="w-5 h-5" /></Button></Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Tambah Experience</h1>
                    <p className="text-gray-400 mt-1">Buat experience baru</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Title *</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Network Engineer Intern" required className={inputClass} /></div>
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Company *</Label><Input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="e.g. PT. XYZ" required className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Period *</Label><Input value={form.period} onChange={(e) => update("period", e.target.value)} placeholder="e.g. Jun 2024 - Dec 2024" required className={inputClass} /></div>
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} className={inputClass} /></div>
                    </div>
                    <div className="space-y-2"><Label className="text-gray-300 text-sm">Description *</Label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Deskripsi pengalaman kerja..." required className={inputClass} /></div>
                </div>
                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Company Icon</h2>
                    <ImageUpload value={form.icon} onChange={(url) => update("icon", url)} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/admin/experiences"><Button type="button" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl h-10 px-6">Batal</Button></Link>
                    <Button type="submit" disabled={saving} className="bg-[#10B981] hover:bg-[#0D9668] text-white rounded-xl h-10 px-6">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan Experience"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
