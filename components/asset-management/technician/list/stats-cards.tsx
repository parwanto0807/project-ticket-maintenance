import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Award } from "lucide-react";

interface StatsCardsProps {
    stats: {
        total: number;
        active: number;
        inactive: number;
        specializationCount: number;
    };
}

export function TechnicianStatsCards({ stats }: StatsCardsProps) {
    const items = [
        {
            title: "Total Technicians",
            value: stats.total,
            icon: Users,
            description: "Total registered workforce",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-100 dark:border-blue-800",
        },
        {
            title: "Active Status",
            value: stats.active,
            icon: UserCheck,
            description: "Technicians currently on-duty",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            border: "border-emerald-100 dark:border-emerald-800",
        },
        {
            title: "Specializations",
            value: stats.specializationCount,
            icon: Award,
            description: "Unique skill areas",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            border: "border-amber-100 dark:border-amber-800",
        },
        {
            title: "Unavailable",
            value: stats.inactive,
            icon: UserX,
            description: "Inactive or off-duty",
            color: "text-slate-600 dark:text-slate-400",
            bg: "bg-slate-50 dark:bg-slate-900/20",
            border: "border-slate-100 dark:border-slate-800",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-md bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            {item.title}
                        </CardTitle>
                        <div className={`p-2 rounded-xl ${item.bg} ${item.color} ${item.border} border shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                            <item.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
                            {item.value}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 font-medium opacity-80">
                            {item.description}
                        </p>
                    </CardContent>
                    <div className={`h-1.5 w-full mt-2 bg-gradient-to-r ${item.color.includes('blue') ? 'from-blue-600 to-blue-400' : item.color.includes('emerald') ? 'from-emerald-600 to-emerald-400' : item.color.includes('amber') ? 'from-amber-600 to-amber-400' : 'from-slate-600 to-slate-400'}`} />
                </Card>
            ))}
        </div>
    );
}
