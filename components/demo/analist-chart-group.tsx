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
import { TrendingUp, BarChart3, PieChart, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Total: <span className="text-orange-500 font-bold">{payload[0].value}</span> Tickets
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

// Skeleton Loading Component
const ChartSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-3/4 mx-auto"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6 w-1/2 mx-auto"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
);

// Tipe untuk data chart
interface ChartData {
    name: string;
    total: number;
}

// Komponen ChartCard yang terpisah untuk mencegah re-render berlebihan
const ChartCard = React.memo(({ 
    title, 
    description, 
    data, 
    index,
    isHovered,
    onMouseEnter,
    onMouseLeave
}: { 
    title: string; 
    description: string; 
    data: ChartData[];
    index: number;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) => {
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
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="col-span-2 lg:col-span-2"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Card className={`
                bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border transition-all duration-300
                ${isHovered 
                    ? 'border-orange-300/50 dark:border-orange-600/50 shadow-2xl shadow-orange-500/10' 
                    : 'border-white/50 dark:border-slate-700/50 shadow-2xl shadow-orange-500/5 dark:shadow-black/20'
                }
            `}>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`
                                p-2 rounded-xl shadow-lg transition-all duration-300
                                ${isHovered
                                    ? 'bg-gradient-to-br from-orange-600 to-amber-600 shadow-orange-600/25'
                                    : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/25'
                                }
                            `}>
                                {index === 0 && <BarChart3 className="h-5 w-5 text-white" />}
                                {index === 1 && <PieChart className="h-5 w-5 text-white" />}
                                {index === 2 && <Activity className="h-5 w-5 text-white" />}
                            </div>
                            <div>
                                <CardTitle className={`
                                    text-lg font-bold transition-colors duration-300
                                    ${isHovered ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-white'}
                                `}>
                                    {title}
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                    {description}
                                </CardDescription>
                            </div>
                        </div>
                        <div className={`
                            flex items-center gap-1 px-3 py-1 rounded-full transition-colors duration-300
                            ${isHovered
                                ? 'bg-orange-200 dark:bg-orange-800/50'
                                : 'bg-orange-100 dark:bg-orange-900/30'
                            }
                        `}>
                            <TrendingUp className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                                {data.reduce((sum, item) => sum + item.total, 0)} Total
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <motion.div
                        variants={chartVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart 
                                data={data} 
                                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                            >
                                {/* Definisi gradasi warna modern */}
                                <defs>
                                    <linearGradient id={`modernGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#F97316" stopOpacity={0.9} />
                                        <stop offset="50%" stopColor="#FB923C" stopOpacity={0.7} />
                                        <stop offset="100%" stopColor="#FDBA74" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id={`hoverGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#EA580C" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#F97316" stopOpacity={0.7} />
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
                                    width={35}
                                />
                                <Tooltip 
                                    content={<CustomTooltip />} 
                                    cursor={{ 
                                        fill: "rgba(251, 146, 60, 0.1)",
                                        stroke: "#FB923C",
                                        strokeWidth: 1,
                                        strokeDasharray: "3 3"
                                    }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill={isHovered ? `url(#hoverGradient-${index})` : `url(#modernGradient-${index})`}
                                    radius={[8, 8, 0, 0]}
                                    animationDuration={1800}
                                    className="transition-all duration-300"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
});

ChartCard.displayName = 'ChartCard';

export default function DashboardChartAnalistGroup() {
    const [overviewChartData, setOverviewChartData] = useState<ChartData[]>([]);
    const [overviewChartJenis, setOverviewChartJenis] = useState<ChartData[]>([]);
    const [overviewChartCategory, setOverviewChartCategory] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);
    const [hoveredChart, setHoveredChart] = useState<number | null>(null);

    useEffect(() => {
        async function fetchOverviewData() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/dashboard-admin/analist/group`);
                if (!response.ok) throw new Error("Gagal mengambil data analisis tiket");

                const data = await response.json();
                setOverviewChartData(data.groupData || []);
                setOverviewChartJenis(data.jenisProductData || []);
                setOverviewChartCategory(data.categoryProductData || []);
                
                // Calculate total tickets
                const total = [...(data.groupData || []), ...(data.jenisProductData || []), ...(data.categoryProductData || [])]
                    .reduce((sum, item) => sum + (item.total || 0), 0);
                setTotalTickets(total);
            } catch (error) {
                console.error("Error fetching overview data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOverviewData();
    }, []);

    // Handler untuk mouse events dengan debounce effect
    const handleMouseEnter = React.useCallback((index: number) => {
        setHoveredChart(index);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
        setHoveredChart(null);
    }, []);

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
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl border border-orange-200/50 dark:border-orange-800/30"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">
                            Ticket Analytics Overview
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Comprehensive analysis of ticket distribution across categories
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {totalTickets}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total Tickets</div>
                    </div>
                    <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
                            {overviewChartData.length + overviewChartJenis.length + overviewChartCategory.length}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Categories</div>
                    </div>
                </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
                {!isLoading ? (
                    <>
                        <ChartCard
                            title="By Group Asset"
                            description="Ticket distribution across asset groups"
                            data={overviewChartData}
                            index={0}
                            isHovered={hoveredChart === 0}
                            onMouseEnter={() => handleMouseEnter(0)}
                            onMouseLeave={handleMouseLeave}
                        />
                        <ChartCard
                            title="By Asset Type"
                            description="Ticket breakdown by asset types"
                            data={overviewChartJenis}
                            index={1}
                            isHovered={hoveredChart === 1}
                            onMouseEnter={() => handleMouseEnter(1)}
                            onMouseLeave={handleMouseLeave}
                        />
                        <ChartCard
                            title="By Category"
                            description="Ticket analysis by product categories"
                            data={overviewChartCategory}
                            index={2}
                            isHovered={hoveredChart === 2}
                            onMouseEnter={() => handleMouseEnter(2)}
                            onMouseLeave={handleMouseLeave}
                        />
                    </>
                ) : (
                    // Show skeletons while loading
                    <>
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                                className="col-span-2 lg:col-span-2"
                            >
                                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-orange-500/5 dark:shadow-black/20">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/25">
                                                    {index === 0 && <BarChart3 className="h-5 w-5 text-white" />}
                                                    {index === 1 && <PieChart className="h-5 w-5 text-white" />}
                                                    {index === 2 && <Activity className="h-5 w-5 text-white" />}
                                                </div>
                                                <div>
                                                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-2"></div>
                                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                                                </div>
                                            </div>
                                            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <ChartSkeleton />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </>
                )}
            </div>

            {/* Footer Note */}
            <motion.div
                variants={cardVariants}
                className="text-center text-sm text-slate-500 dark:text-slate-500 pt-4"
            >
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    Real-time data updated automatically
                </div>
            </motion.div>
        </motion.div>
    );
}