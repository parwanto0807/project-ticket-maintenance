import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTicketAssignStats } from "@/data/asset/ticket";
import { ClipboardList, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default async function DashboardStats() {
    const stats = await fetchTicketAssignStats();

    const items = [
        {
            title: "Total Tickets",
            value: stats.total,
            icon: ClipboardList,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-red-600",
            bgColor: "bg-red-100 dark:bg-red-900/20",
        },
        {
            title: "Assigned",
            value: stats.assigned,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
        {
            title: "In Progress",
            value: stats.inProgress,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <Card key={item.title} className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {item.title}
                                </p>
                                <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${item.bgColor}`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
