import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserPlus } from "lucide-react";

interface StatsCardsProps {
    stats: {
        totalEmployees: number;
        totalDepartments: number;
        recentHires: number;
    };
}

export default function EmployeeStats({ stats }: StatsCardsProps) {
    const items = [
        {
            title: "Total Employees",
            value: stats.totalEmployees,
            icon: Users,
            description: "Total registered employees",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-100 dark:border-blue-800",
        },
        {
            title: "Departments",
            value: stats.totalDepartments,
            icon: Building2,
            description: "Active departments",
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-900/20",
            border: "border-indigo-100 dark:border-indigo-800",
        },
        {
            title: "New Hires",
            value: stats.recentHires,
            icon: UserPlus,
            description: "Added in last 30 days",
            color: "text-sky-600 dark:text-sky-400",
            bg: "bg-sky-50 dark:bg-sky-900/20",
            border: "border-sky-100 dark:border-sky-800",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
            {items.map((item, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-md bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {item.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${item.bg} ${item.color} ${item.border} border shadow-sm`}>
                            <item.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {item.value}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                            {item.description}
                        </p>
                    </CardContent>
                    <div className={`h-1 w-full mt-2 bg-gradient-to-r ${item.color.includes('blue') ? 'from-blue-500 to-blue-300' : item.color.includes('indigo') ? 'from-indigo-500 to-indigo-300' : 'from-sky-500 to-sky-300'}`} />
                </Card>
            ))}
        </div>
    );
}
