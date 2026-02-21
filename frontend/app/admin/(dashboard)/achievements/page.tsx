"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchAchievements, deleteAchievement } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function AchievementsPage() {
    const { token } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchAchievements().then(setItems).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!token || !confirm(`Hapus achievement "${title}"?`)) return;
        setDeleting(id);
        try {
            await deleteAchievement(token, id);
            setItems((prev) => prev.filter((a) => a.id !== id));
        } catch { }
        setDeleting(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Achievements</h1>
                    <p className="text-gray-400 mt-1">{items.length} achievement terdaftar</p>
                </div>
                <Link href="/admin/achievements/new">
                    <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-black rounded-xl h-10 px-5 font-semibold">
                        <Plus className="w-4 h-4" /> Tambah Achievement
                    </Button>
                </Link>
            </div>

            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg mb-2">Belum ada achievement</p>
                        <Link href="/admin/achievements/new" className="text-[#FBBF24] hover:underline text-sm">Tambah achievement pertama →</Link>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-gray-400 font-medium">Title</TableHead>
                                <TableHead className="text-gray-400 font-medium">Publisher</TableHead>
                                <TableHead className="text-gray-400 font-medium">Date</TableHead>
                                <TableHead className="text-gray-400 font-medium text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((ach) => (
                                <TableRow key={ach.id} className="border-white/5">
                                    <TableCell className="text-white font-medium">{ach.title}</TableCell>
                                    <TableCell className="text-gray-300">{ach.publisher || "—"}</TableCell>
                                    <TableCell className="text-gray-400 text-sm">{ach.date || "—"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/admin/achievements/${ach.id}/edit`}>
                                                <Button size="icon-sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5"><Pencil className="w-4 h-4" /></Button>
                                            </Link>
                                            <Button size="icon-sm" variant="ghost" className="text-gray-400 hover:text-red-400 hover:bg-red-500/10" disabled={deleting === ach.id}
                                                onClick={() => handleDelete(ach.id, ach.title)}>
                                                {deleting === ach.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
