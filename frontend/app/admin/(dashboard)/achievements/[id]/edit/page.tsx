"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchAchievements, updateAchievement } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { token } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ title: "", description: "", publisher: "", date: "", color: "#6366F1", sort_order: 0 });

    useEffect(() => {
        fetchAchievements().then((items) => {
            const ach = items.find((a: any) => a.id === id);
            if (ach) setForm({ title: ach.title, description: ach.description, publisher: ach.publisher || "", date: ach.date || "", color: ach.color || "#6366F1", sort_order: ach.sort_order || 0 });
        }).finally(() => setLoading(false));
    }, [id]);

    const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));
    const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-[#F59E0B] focus:ring-[#F59E0B]/20";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setError(""); setSaving(true);
        try { await updateAchievement(token, id, form); router.push("/admin/achievements"); }
        catch (err: any) { setError(err.message || "Gagal menyimpan"); }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/achievements"><Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"><ArrowLeft className="w-5 h-5" /></Button></Link>
                <div><h1 className="text-3xl font-bold text-white">Edit Achievement</h1><p className="text-gray-400 mt-1">{form.title}</p></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-5">
                    <div className="space-y-2"><Label className="text-gray-300 text-sm">Title *</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} required className={inputClass} /></div>
                    <div className="space-y-2"><Label className="text-gray-300 text-sm">Description *</Label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} required className={inputClass} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Publisher</Label><Input value={form.publisher} onChange={(e) => update("publisher", e.target.value)} className={inputClass} /></div>
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Date</Label><Input value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Color</Label>
                            <div className="flex gap-2">
                                <input type="color" value={form.color} onChange={(e) => update("color", e.target.value)} className="w-11 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                                <Input value={form.color} onChange={(e) => update("color", e.target.value)} className={`flex-1 ${inputClass}`} />
                            </div>
                        </div>
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)} className={inputClass} /></div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/admin/achievements"><Button type="button" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl h-10 px-6">Batal</Button></Link>
                    <Button type="submit" disabled={saving} className="bg-[#F59E0B] hover:bg-[#D97706] text-black rounded-xl h-10 px-6 font-semibold">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Update Achievement"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
