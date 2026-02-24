"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, Layers, Tag, Bookmark } from "lucide-react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

interface StatsCardsProps {
    stats: {
        totalProducts: number;
        totalCategories: number;
        totalTypes: number;
        totalBrands: number;
    };
}

export function ProductStatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: Package,
            color: "blue",
            gradient: "from-blue-600 to-indigo-600",
            bgLight: "bg-blue-50/50",
            bgDark: "dark:bg-blue-900/10",
        },
        {
            title: "Categories",
            value: stats.totalCategories,
            icon: Bookmark,
            color: "emerald",
            gradient: "from-emerald-600 to-teal-600",
            bgLight: "bg-emerald-50/50",
            bgDark: "dark:bg-emerald-900/10",
        },
        {
            title: "Product Types",
            value: stats.totalTypes,
            icon: Layers,
            color: "violet",
            gradient: "from-violet-600 to-purple-600",
            bgLight: "bg-violet-50/50",
            bgDark: "dark:bg-violet-900/10",
        },
        {
            title: "Total Brands",
            value: stats.totalBrands,
            icon: Tag,
            color: "amber",
            gradient: "from-amber-500 to-orange-600",
            bgLight: "bg-amber-50/50",
            bgDark: "dark:bg-amber-900/10",
        },
    ];

    return (
        <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4", font.className)}>
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card
                        key={card.title}
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
                );
            })}
        </div>
    );
}
