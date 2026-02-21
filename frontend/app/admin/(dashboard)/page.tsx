"use client";

import { useEffect, useState } from "react";
import { fetchProjects, fetchExperiences, fetchAchievements } from "@/lib/api";
import { FolderKanban, Briefcase, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ projects: 0, experiences: 0, achievements: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchProjects(), fetchExperiences(), fetchAchievements()])
            .then(([p, e, a]) =>
                setStats({ projects: p.length, experiences: e.length, achievements: a.length })
            )
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        {
            label: "Projects",
            count: stats.projects,
            icon: FolderKanban,
            href: "/admin/projects",
            gradient: "from-[#6366F1] to-[#818CF8]",
            bg: "bg-[#6366F1]/10",
        },
        {
            label: "Experiences",
            count: stats.experiences,
            icon: Briefcase,
            href: "/admin/experiences",
            gradient: "from-[#10B981] to-[#34D399]",
            bg: "bg-[#10B981]/10",
        },
        {
            label: "Achievements",
            count: stats.achievements,
            icon: Award,
            href: "/admin/achievements",
            gradient: "from-[#F59E0B] to-[#FBBF24]",
            bg: "bg-[#F59E0B]/10",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Kelola konten portfolio Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {cards.map(({ label, count, icon: Icon, href, gradient, bg }) => (
                    <Link
                        key={label}
                        href={href}
                        className="group bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 bg-gradient-to-r ${gradient} bg-clip-text`} style={{ color: gradient.includes("6366F1") ? "#818CF8" : gradient.includes("10B981") ? "#34D399" : "#FBBF24" }} />
                            </div>
                            <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {loading ? "—" : count}
                        </p>
                        <p className="text-gray-400 text-sm">{label}</p>
                    </Link>
                ))}
            </div>

            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/projects/new"
                        className="flex items-center gap-3 px-5 py-4 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-xl text-[#818CF8] hover:bg-[#6366F1]/15 transition-all font-medium text-sm"
                    >
                        <FolderKanban className="w-5 h-5" />
                        Tambah Project Baru
                    </Link>
                    <Link
                        href="/admin/experiences/new"
                        className="flex items-center gap-3 px-5 py-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl text-[#34D399] hover:bg-[#10B981]/15 transition-all font-medium text-sm"
                    >
                        <Briefcase className="w-5 h-5" />
                        Tambah Experience
                    </Link>
                    <Link
                        href="/admin/achievements/new"
                        className="flex items-center gap-3 px-5 py-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl text-[#FBBF24] hover:bg-[#F59E0B]/15 transition-all font-medium text-sm"
                    >
                        <Award className="w-5 h-5" />
                        Tambah Achievement
                    </Link>
                </div>
            </div>
        </div>
    );
}
