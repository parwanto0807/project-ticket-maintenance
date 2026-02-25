"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
    total: number;
    pending: number;
    assigned: number;
    inProgress: number;
}

interface DashboardStatsProps {
    stats?: StatsData;
    loading?: boolean;
}

export default function DashboardStats({ stats, loading }: DashboardStatsProps) {
    const items = [
        {
            title: "Total Tickets",
            value: stats?.total || 0,
            icon: ClipboardList,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Pending",
            value: stats?.pending || 0,
            icon: Clock,
            color: "text-red-600",
            bgColor: "bg-red-100 dark:bg-red-900/20",
        },
        {
            title: "Assigned",
            value: stats?.assigned || 0,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
        {
            title: "In Progress",
            value: stats?.inProgress || 0,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
            {items.map((item) => (
                <Card key={item.title} className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 ring-1 ring-black/5">
                    <CardContent className="p-3 md:p-6">
                        <div className="flex flex-col items-center md:flex-row md:justify-between gap-1 text-center md:text-left">
                            <div className="min-w-0">
                                <p className="text-[8px] md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter truncate">
                                    {item.title}
                                </p>
                                {loading ? (
                                    <Skeleton className="h-4 w-8 md:h-8 md:w-16 mt-0.5" />
                                ) : (
                                    <h3 className="text-sm md:text-2xl font-black mt-0.5 text-gray-900 dark:text-white">{item.value}</h3>
                                )}
                            </div>
                            <div className={`p-1.5 md:p-3 rounded-lg md:rounded-xl shrink-0 ${item.bgColor}`}>
                                <item.icon className={`w-3 h-3 md:w-6 h-6 ${item.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
