"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createProject } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        slug: "",
        title: "",
        category: "",
        description: "",
        tech_stack: [] as string[],
        highlight: "",
        image_path: "",
        external_link: "",
        bg_color: "#6366F1",
        full_description: "",
        key_features: [] as string[],
        system_architecture: [] as string[],
        system_flow: [] as string[],
    });

    const [newTech, setNewTech] = useState("");
    const [newFeature, setNewFeature] = useState("");
    const [newArch, setNewArch] = useState("");
    const [newFlow, setNewFlow] = useState("");

    const update = (field: string, value: any) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const addToArray = (field: string, value: string, setter: (v: string) => void) => {
        if (!value.trim()) return;
        setForm((prev) => ({ ...prev, [field]: [...(prev as any)[field], value.trim()] }));
        setter("");
    };

    const removeFromArray = (field: string, index: number) => {
        setForm((prev) => ({
            ...prev,
            [field]: (prev as any)[field].filter((_: any, i: number) => i !== index),
        }));
    };

    const autoSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 255);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setError("");
        setSaving(true);
        try {
            await createProject(token, form);
            router.push("/admin/projects");
        } catch (err: any) {
            setError(err.message || "Gagal menyimpan");
        }
        setSaving(false);
    };

    const inputClass =
        "bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-[#6366F1] focus:ring-[#6366F1]/20";

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/projects">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Tambah Project</h1>
                    <p className="text-gray-400 mt-1">Buat project baru untuk portfolio</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white">Informasi Dasar</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Title *</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => {
                                    update("title", e.target.value);
                                    if (!form.slug || form.slug === autoSlug(form.title.slice(0, -1) + ""))
                                        update("slug", autoSlug(e.target.value));
                                }}
                                placeholder="Nama project"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Slug *</Label>
                            <Input
                                value={form.slug}
                                onChange={(e) => update("slug", e.target.value)}
                                placeholder="project-slug"
                                required
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">Category *</Label>
                            <Input
                                value={form.category}
                                onChange={(e) => update("category", e.target.value)}
                                placeholder="e.g. DevOps, IoT, Security"
                                required
                                className={inputClass}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300 text-sm">BG Color</Label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={form.bg_color}
                                    onChange={(e) => update("bg_color", e.target.value)}
                                    className="w-11 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                                />
                                <Input
                                    value={form.bg_color}
                                    onChange={(e) => update("bg_color", e.target.value)}
                                    className={`flex-1 ${inputClass}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Description *</Label>
                        <Textarea
                            value={form.description}
                            onChange={(e) => update("description", e.target.value)}
                            placeholder="Deskripsi singkat project"
                            rows={3}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Highlight / Outcome</Label>
                        <Input
                            value={form.highlight}
                            onChange={(e) => update("highlight", e.target.value)}
                            placeholder="e.g. 267+ security events processed"
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">External Link</Label>
                        <Input
                            value={form.external_link}
                            onChange={(e) => update("external_link", e.target.value)}
                            placeholder="https://github.com/..."
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Image */}
                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Project Image</h2>
                    <ImageUpload value={form.image_path} onChange={(url) => update("image_path", url)} />
                </div>

                {/* Tech Stack */}
                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Tech Stack</h2>
                    <div className="flex gap-2">
                        <Input
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            placeholder="e.g. Docker, Python"
                            className={`flex-1 ${inputClass}`}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToArray("tech_stack", newTech, setNewTech); } }}
                        />
                        <Button type="button" onClick={() => addToArray("tech_stack", newTech, setNewTech)} variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {form.tech_stack.map((t, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 bg-[#6366F1]/10 text-[#818CF8] px-3 py-1.5 rounded-lg text-sm border border-[#6366F1]/20">
                                {t}
                                <button type="button" onClick={() => removeFromArray("tech_stack", i)}><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Full Description */}
                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Detail Lengkap</h2>
                    <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Full Description</Label>
                        <Textarea
                            value={form.full_description}
                            onChange={(e) => update("full_description", e.target.value)}
                            rows={5}
                            placeholder="Deskripsi lengkap project..."
                            className={inputClass}
                        />
                    </div>

                    {/* Key Features */}
                    <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Key Features</Label>
                        <div className="flex gap-2">
                            <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Tambah feature" className={`flex-1 ${inputClass}`}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToArray("key_features", newFeature, setNewFeature); } }} />
                            <Button type="button" onClick={() => addToArray("key_features", newFeature, setNewFeature)} variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl"><Plus className="w-4 h-4" /></Button>
                        </div>
                        {form.key_features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300">
                                <span className="flex-1 truncate">{f}</span>
                                <button type="button" onClick={() => removeFromArray("key_features", i)}><X className="w-3 h-3 text-gray-500" /></button>
                            </div>
                        ))}
                    </div>

                    {/* System Architecture */}
                    <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">System Architecture</Label>
                        <div className="flex gap-2">
                            <Input value={newArch} onChange={(e) => setNewArch(e.target.value)} placeholder="Tambah architecture point" className={`flex-1 ${inputClass}`}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToArray("system_architecture", newArch, setNewArch); } }} />
                            <Button type="button" onClick={() => addToArray("system_architecture", newArch, setNewArch)} variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl"><Plus className="w-4 h-4" /></Button>
                        </div>
                        {form.system_architecture.map((a, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300">
                                <span className="flex-1 truncate">{a}</span>
                                <button type="button" onClick={() => removeFromArray("system_architecture", i)}><X className="w-3 h-3 text-gray-500" /></button>
                            </div>
                        ))}
                    </div>

                    {/* System Flow */}
                    <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">System Flow</Label>
                        <div className="flex gap-2">
                            <Input value={newFlow} onChange={(e) => setNewFlow(e.target.value)} placeholder="Tambah flow step" className={`flex-1 ${inputClass}`}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToArray("system_flow", newFlow, setNewFlow); } }} />
                            <Button type="button" onClick={() => addToArray("system_flow", newFlow, setNewFlow)} variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl"><Plus className="w-4 h-4" /></Button>
                        </div>
                        {form.system_flow.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300">
                                <span className="flex-1 truncate">{s}</span>
                                <button type="button" onClick={() => removeFromArray("system_flow", i)}><X className="w-3 h-3 text-gray-500" /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-2">
                    <Link href="/admin/projects">
                        <Button type="button" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl h-10 px-6">
                            Batal
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-[#6366F1] hover:bg-[#5558E6] text-white rounded-xl h-10 px-6"
                    >
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Simpan Project"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
