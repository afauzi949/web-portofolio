"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchProjects, deleteProject } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function ProjectsPage() {
    const { token } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        fetchProjects()
            .then(setProjects)
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!token || !confirm(`Hapus project "${title}"?`)) return;
        setDeleting(id);
        try {
            await deleteProject(token, id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch { }
        setDeleting(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <p className="text-gray-400 mt-1">{projects.length} project terdaftar</p>
                </div>
                <Link href="/admin/projects/new">
                    <Button className="bg-[#6366F1] hover:bg-[#5558E6] text-white rounded-xl h-10 px-5">
                        <Plus className="w-4 h-4" />
                        Tambah Project
                    </Button>
                </Link>
            </div>

            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg mb-2">Belum ada project</p>
                        <Link href="/admin/projects/new" className="text-[#818CF8] hover:underline text-sm">
                            Tambah project pertama →
                        </Link>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-gray-400 font-medium">Title</TableHead>
                                <TableHead className="text-gray-400 font-medium">Category</TableHead>
                                <TableHead className="text-gray-400 font-medium">Tech Stack</TableHead>
                                <TableHead className="text-gray-400 font-medium text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((p) => (
                                <TableRow key={p.id} className="border-white/5">
                                    <TableCell className="text-white font-medium max-w-[300px]">
                                        <div className="truncate">{p.title}</div>
                                        <div className="text-gray-500 text-xs mt-0.5 truncate">{p.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-white/5 text-gray-300 border-white/10 text-xs">
                                            {p.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap max-w-[250px]">
                                            {(p.tech_stack || []).slice(0, 3).map((t: string) => (
                                                <Badge key={t} variant="outline" className="border-white/10 text-gray-400 text-xs">
                                                    {t}
                                                </Badge>
                                            ))}
                                            {(p.tech_stack || []).length > 3 && (
                                                <Badge variant="outline" className="border-white/10 text-gray-500 text-xs">
                                                    +{p.tech_stack.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/admin/projects/${p.id}/edit`}>
                                                <Button size="icon-sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="icon-sm"
                                                variant="ghost"
                                                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                                disabled={deleting === p.id}
                                                onClick={() => handleDelete(p.id, p.title)}
                                            >
                                                {deleting === p.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
