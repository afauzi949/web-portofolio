"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchProjects, updateProject } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { token } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        slug: "", title: "", category: "", description: "",
        tech_stack: [] as string[], highlight: "", image_path: "",
        external_link: "", bg_color: "#6366F1", full_description: "",
        key_features: [] as string[], system_architecture: [] as string[],
        system_flow: [] as string[],
    });

    const [newTech, setNewTech] = useState("");
    const [newFeature, setNewFeature] = useState("");
    const [newArch, setNewArch] = useState("");
    const [newFlow, setNewFlow] = useState("");

    useEffect(() => {
        fetchProjects().then((projects) => {
            const p = projects.find((proj: any) => proj.id === id);
            if (p) {
                setForm({
                    slug: p.slug || "", title: p.title || "", category: p.category || "",
                    description: p.description || "", tech_stack: p.tech_stack || [],
                    highlight: p.highlight || "", image_path: p.image_path || "",
                    external_link: p.external_link || "", bg_color: p.bg_color || "#6366F1",
                    full_description: p.full_description || "", key_features: p.key_features || [],
                    system_architecture: p.system_architecture || [], system_flow: p.system_flow || [],
                });
            }
        }).finally(() => setLoading(false));
    }, [id]);

    const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

    const addToArray = (field: string, value: string, setter: (v: string) => void) => {
        if (!value.trim()) return;
        setForm((prev) => ({ ...prev, [field]: [...(prev as any)[field], value.trim()] }));
        setter("");
    };

    const removeFromArray = (field: string, index: number) => {
        setForm((prev) => ({ ...prev, [field]: (prev as any)[field].filter((_: any, i: number) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setError("");
        setSaving(true);
        try {
            await updateProject(token, id, form);
            router.push("/admin/projects");
        } catch (err: any) { setError(err.message || "Gagal menyimpan"); }
        setSaving(false);
    };

    const inputClass = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-[#6366F1] focus:ring-[#6366F1]/20";

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/projects">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl"><ArrowLeft className="w-5 h-5" /></Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Edit Project</h1>
                    <p className="text-gray-400 mt-1">{form.title}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white">Informasi Dasar</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Title *</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} required className={inputClass} /></div>
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Slug *</Label><Input value={form.slug} onChange={(e) => update("slug", e.target.value)} required className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-gray-300 text-sm">Category *</Label><Input value={form.category} onChange={(e) => update("category", e.target.value)} required className={inputClass} /></div>
                        <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">BG Color</Label>
                            <div className="flex gap-2">
                                <input type="color" value={form.bg_color} onChange={(e) => update("bg_color", e.target.value)} className="w-11 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                                <Input value={form.bg_color} onChange={(e) => update("bg_color", e.target.value)} className={`flex-1 ${inputClass}`} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2"><Label className="text-gray-300 text-sm">Description *</Label><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} required className={inputClass} /></div>
                    <div className="space-y-2"><Label className="text-gray-300 text-sm">Highlight</Label><Input value={form.highlight} onChange={(e) => update("highlight", e.target.value)} className={inputClass} /></div>
                    <div className="space-y-2"><Label className="text-gray-300 text-sm">External Link</Label><Input value={form.external_link} onChange={(e) => update("external_link", e.target.value)} className={inputClass} /></div>
                </div>

                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Project Image</h2>
                    <ImageUpload value={form.image_path} onChange={(url) => update("image_path", url)} />
                </div>

                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Tech Stack</h2>
                    <div className="flex gap-2">
                        <Input value={newTech} onChange={(e) => setNewTech(e.target.value)} placeholder="e.g. Docker" className={`flex-1 ${inputClass}`} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToArray("tech_stack", newTech, setNewTech); } }} />
                        <Button type="button" onClick={() => addToArray("tech_stack", newTech, setNewTech)} variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl"><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {form.tech_stack.map((t, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 bg-[#6366F1]/10 text-[#818CF8] px-3 py-1.5 rounded-lg text-sm border border-[#6366F1]/20">
                                {t}<button type="button" onClick={() => removeFromArray("tech_stack", i)}><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Detail Lengkap</h2>
                    <div className="space-y-2"><Label className="text-gray-300 text-sm">Full Description</Label><Textarea value={form.full_description} onChange={(e) => update("full_description", e.target.value)} rows={5} className={inputClass} /></div>

                    {[
                        { label: "Key Features", field: "key_features", state: newFeature, setter: setNewFeature },
                        { label: "System Architecture", field: "system_architecture", state: newArch, setter: setNewArch },
                        { label: "System Flow", field: "system_flow", state: newFlow, setter: setNewFlow },
                    ].map(({ label, field, state, setter }) => (
                        <div key={field} className="space-y-2">
                            <Label className="text-gray-300 text-sm">{label}</Label>
                            <div className="flex gap-2">
                                <Input value={state} onChange={(e) => setter(e.target.value)} placeholder={`Tambah ${label.toLowerCase()}`} className={`flex-1 ${inputClass}`}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToArray(field, state, setter); } }} />
                                <Button type="button" onClick={() => addToArray(field, state, setter)} variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl"><Plus className="w-4 h-4" /></Button>
                            </div>
                            {((form as any)[field] || []).map((item: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300">
                                    <span className="flex-1 truncate">{item}</span>
                                    <button type="button" onClick={() => removeFromArray(field, i)}><X className="w-3 h-3 text-gray-500" /></button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/admin/projects"><Button type="button" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl h-10 px-6">Batal</Button></Link>
                    <Button type="submit" disabled={saving} className="bg-[#6366F1] hover:bg-[#5558E6] text-white rounded-xl h-10 px-6">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Update Project"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
