"use client";

import {
    MonitorSmartphone,
    DownloadCloud,
    CalendarClock,
    ShieldAlert
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

interface StatsCardsProps {
    stats: {
        totalSoftware: number;
        totalInstallations: number;
        expiringLicenses: number;
        inactiveInstallations: number;
    };
}

export function SoftwareStatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Total Software",
            value: stats.totalSoftware,
            icon: MonitorSmartphone,
            color: "blue",
            gradient: "from-blue-600 to-indigo-600",
            bgLight: "bg-blue-50/50",
            bgDark: "dark:bg-blue-900/10",
        },
        {
            title: "Instalasi Aktif",
            value: stats.totalInstallations - stats.inactiveInstallations,
            icon: DownloadCloud,
            color: "emerald",
            gradient: "from-emerald-500 to-teal-600",
            bgLight: "bg-emerald-50/50",
            bgDark: "dark:bg-emerald-900/10",
        },
        {
            title: "Lisensi Kadaluarsa",
            value: stats.expiringLicenses,
            icon: CalendarClock,
            color: "orange",
            gradient: "from-orange-500 to-amber-600",
            bgLight: "bg-orange-50/50",
            bgDark: "dark:bg-orange-900/10",
        },
        {
            title: "Tidak Aktif",
            value: stats.inactiveInstallations,
            icon: ShieldAlert,
            color: "slate",
            gradient: "from-slate-600 to-slate-700",
            bgLight: "bg-slate-100/50",
            bgDark: "dark:bg-slate-800/10",
        },
    ];

    return (
        <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", font.className)}>
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <Card
                            className="group relative overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-500 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
                        >
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500", card.gradient)}></div>
                            <CardContent className="p-3 sm:p-5 flex items-center gap-3 sm:gap-4 relative">
                                <div className={cn(
                                    "p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm",
                                    card.bgLight,
                                    card.bgDark
                                )}>
                                    <Icon className={cn("h-4 w-4 sm:h-6 sm:w-6", `text-${card.color}-600 dark:text-${card.color}-400`)} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        {card.title}
                                    </span>
                                    <span className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none mt-0.5">
                                        {card.value}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
