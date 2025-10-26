"use client";

import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    Tooltip,
    CartesianGrid,
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { 
    Users, 
    Ticket, 
    Building, 
    TrendingUp,
    // Sparkles,
    // Calendar,
    UserCheck
} from "lucide-react";
import { motion } from "framer-motion";

// Fungsi untuk inisial dari nama
function initials(name: string) {
    return name
        ? name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "DP"; // Default untuk department
}

// Definisikan tipe untuk CustomTooltip props
interface CustomTooltipProps {
    active?: boolean;
    payload?: { name: string; value: number;[key: string]: string | number }[];
    label?: string;
}

// Komponen Tooltip Custom yang Diperbarui
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-2">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Total: <span className="text-blue-500 font-bold">{payload[0].value}</span> Tickets
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

// Skeleton Loading Component
const ChartSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
);

const DepartmentSkeleton = () => (
    <div className="animate-pulse space-y-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-y-4 border-b pb-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="ml-4 space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </div>
            </div>
        ))}
    </div>
);

// Definisikan tipe data untuk department
interface Employee {
    name: string;
    ticketCount: number;
}

interface DepartmentData {
    dept_name: string;
    email: string;
    total: number;
    employees: Employee[];
}

export default function DashboardChartAnalist2() {
    const [overviewChartDepartmentData, setOverviewChartDepartmentData] = useState<{ name: string; total: number }[]>([]);
    const [overviewChartDepartmentDataDetail, setOverviewChartDepartmentDataDetail] = useState<DepartmentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredChart, setHoveredChart] = useState(false);
    const [totalTickets, setTotalTickets] = useState(0);
    const [totalDepartments, setTotalDepartments] = useState(0);

    // Fetch data untuk chart department
    useEffect(() => {
        async function fetchOverviewData() {
            try {
                const response = await fetch(`/api/dashboard-admin/analist/group`);
                if (!response.ok) throw new Error("Gagal mengambil data analisis tiket");

                const data = await response.json();
                setOverviewChartDepartmentData(data.departmentTicketData || []);
            } catch (error) {
                console.error("Error fetching overview data:", error);
            }
        }
        fetchOverviewData();
    }, []);

    // Fetch data untuk detail ticket
    useEffect(() => {
        const abortController = new AbortController();

        async function fetchOverviewDataDetail() {
            try {
                const response = await fetch(`/api/dashboard-admin/analist/detail/department`, {
                    signal: abortController.signal,
                });

                if (!response.ok) throw new Error("Gagal mengambil data analisis tiket");

                const data = await response.json();
                setOverviewChartDepartmentDataDetail(Array.isArray(data) ? data : []);
                
                // Calculate totals
                const ticketTotal = data.reduce((sum: number, dept: DepartmentData) => sum + dept.total, 0);
                setTotalTickets(ticketTotal);
                setTotalDepartments(data.length);
            } catch (error: unknown) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Error fetching overview data:", error);
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchOverviewDataDetail();

        return () => abortController.abort();
    }, []);

    const chartVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.2
                    }
                }
            }}
            className="space-y-6"
        >
            {/* Header Stats */}
            <motion.div
                variants={cardVariants}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/30"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                        <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">
                            Department Analytics
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Comprehensive analysis of ticket distribution across departments
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {totalTickets}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total Tickets</div>
                    </div>
                    <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
                            {totalDepartments}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Departments</div>
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                {/* Department Chart Card */}
                <motion.div
                    variants={cardVariants}
                    className="col-span-2 lg:col-span-2"
                    onMouseEnter={() => setHoveredChart(true)}
                    onMouseLeave={() => setHoveredChart(false)}
                >
                    <Card className={`
                        bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border transition-all duration-300 h-full
                        ${hoveredChart 
                            ? 'border-blue-300/50 dark:border-blue-600/50 shadow-2xl shadow-blue-500/10' 
                            : 'border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/5 dark:shadow-black/20'
                        }
                    `}>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        p-2 rounded-xl shadow-lg transition-all duration-300
                                        ${hoveredChart
                                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-blue-600/25'
                                            : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/25'
                                        }
                                    `}>
                                        <TrendingUp className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className={`
                                            text-lg font-bold transition-colors duration-300
                                            ${hoveredChart ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'}
                                        `}>
                                            Tickets by Department
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Last 12 Months Distribution
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {isLoading ? (
                                <ChartSkeleton />
                            ) : (
                                <motion.div
                                    variants={chartVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={overviewChartDepartmentData}>
                                            <defs>
                                                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                                                    <stop offset="50%" stopColor="#60A5FA" stopOpacity={0.7} />
                                                    <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.5} />
                                                </linearGradient>
                                                <linearGradient id="blueHoverGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.9} />
                                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.7} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid 
                                                strokeDasharray="3 3" 
                                                stroke="#E2E8F0" 
                                                strokeOpacity={0.3}
                                                vertical={false}
                                            />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#64748B" 
                                                fontSize={11} 
                                                tickLine={false} 
                                                axisLine={false}
                                                angle={-45}
                                                textAnchor="end"
                                                height={60}
                                            />
                                            <YAxis 
                                                stroke="#64748B" 
                                                fontSize={11} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                tickFormatter={(value) => `${value}`} 
                                                allowDecimals={false} 
                                            />
                                            <Tooltip 
                                                content={<CustomTooltip />} 
                                                cursor={{ 
                                                    fill: "rgba(59, 130, 246, 0.1)",
                                                    stroke: "#3B82F6",
                                                    strokeWidth: 1,
                                                    strokeDasharray: "3 3"
                                                }}
                                            />
                                            <Bar 
                                                dataKey="total" 
                                                fill={hoveredChart ? "url(#blueHoverGradient)" : "url(#blueGradient)"} 
                                                radius={[8, 8, 0, 0]} 
                                                animationDuration={1500} 
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Department Details Card */}
                <motion.div
                    variants={cardVariants}
                    className="col-span-2 lg:col-span-3"
                >
                    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/5 dark:shadow-black/20 h-full">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                                            Department Performance
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            {totalDepartments} departments with {totalTickets} total tickets
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <Ticket className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                        {totalTickets} Total
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                                {isLoading ? (
                                    <DepartmentSkeleton />
                                ) : overviewChartDepartmentDataDetail.length > 0 ? (
                                    [...overviewChartDepartmentDataDetail]
                                        .sort((a, b) => b.total - a.total)
                                        .map((dept, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-600/50"
                                            >
                                                <Avatar className="size-12 border-2 border-white dark:border-slate-700 shadow-lg">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                                                        {initials(dept.dept_name)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Badge 
                                                            variant="outline" 
                                                            className="font-bold border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1"
                                                        >
                                                            {dept.dept_name}
                                                        </Badge>
                                                        <div className="flex items-center gap-2">
                                                            <Ticket className="h-4 w-4 text-blue-500" />
                                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                                {dept.total} Tickets
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Employee List */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                            <UserCheck className="h-3 w-3" />
                                                            <span className="font-medium">Team Members:</span>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            {Array.isArray(dept.employees) && dept.employees.length > 0 ? (
                                                                dept.employees
                                                                    .sort((a, b) => b.ticketCount - a.ticketCount)
                                                                    .slice(0, 3) // Show top 3 employees
                                                                    .map((emp, empIndex) => (
                                                                        <div 
                                                                            key={empIndex}
                                                                            className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/50 dark:bg-slate-600/30"
                                                                        >
                                                                            <span className="text-slate-700 dark:text-slate-300">
                                                                                {emp.name}
                                                                            </span>
                                                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                                                {emp.ticketCount} Tickets
                                                                            </span>
                                                                        </div>
                                                                    ))
                                                            ) : (
                                                                <div className="text-sm text-slate-500 dark:text-slate-500 text-center py-2">
                                                                    No team members found
                                                                </div>
                                                            )}
                                                        </div>
                                                        {dept.employees && dept.employees.length > 3 && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-500 text-center">
                                                                +{dept.employees.length - 3} more team members
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8"
                                    >
                                        <Building className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                                        <p className="text-slate-500 dark:text-slate-500">No department data available</p>
                                    </motion.div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Footer Note */}
            <motion.div
                variants={cardVariants}
                className="text-center text-sm text-slate-500 dark:text-slate-500 pt-4"
            >
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    Department performance metrics updated in real-time
                </div>
            </motion.div>
        </motion.div>
    );
}