"use client";

import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    Tooltip,
} from "recharts";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

// Definisikan tipe untuk CustomTooltip props
interface CustomTooltipProps {
    active?: boolean;
    payload?: { name: string; value: number;[key: string]: string | number }[];
    label?: string;
}

// Komponen Tooltip Custom
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-sm text-orange-500">{`Total: ${payload[0].value} Ticket`}</p>
            </div>
        );
    }
    return null;
};

export default function DashboardChartAnalistGroup() {
    const [overviewChartData, setOverviewChartData] = useState<{ name: string; total: number }[]>([]);
    const [overviewChartJenis, setOverviewChartJenis] = useState<{ name: string; total: number }[]>([]);
    const [overviewChartCategory, setOverviewChartCategory] = useState<{ name: string; total: number }[]>([]);

    useEffect(() => {
        async function fetchOverviewData() {
            try {
                const response = await fetch(`/api/dashboard-admin/analist/group`);
                if (!response.ok) throw new Error("Gagal mengambil data analisis tiket");

                const data = await response.json();
                setOverviewChartData(data.groupData);
                setOverviewChartJenis(data.jenisProductData);
                setOverviewChartCategory(data.categoryProductData);
            } catch (error) {
                console.error("Error fetching overview data:", error);
            }
        }
        fetchOverviewData();
    }, []);

    

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {/* Card Overview dengan Chart */}
            <Card className="col-span-2 lg:col-span-2 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply">
                <CardHeader>
                    <CardTitle className="text-center">Overview Ticket By Group Asset Product </CardTitle>
                </CardHeader>
                <CardDescription className="text-center">Data Last 12 Months</CardDescription>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={overviewChartData}>
                            {/* Definisi gradasi warna orange */}
                            <defs>
                                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F97316" /> {/* Orange-500 */}
                                    <stop offset="100%" stopColor="#FDBA74" /> {/* Orange-300 */}
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value} Ticket`}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#FED7AA" }} /> {/* Efek hover */}
                            <Bar
                                dataKey="total"
                                fill="url(#orangeGradient)"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500} // Animasi
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-2 lg:col-span-2 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply">
                <CardHeader>
                    <CardTitle className="text-center">Overview Ticket By Type Asset Product</CardTitle>
                </CardHeader>
                <CardDescription className="text-center">Data Last 12 Months</CardDescription>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={overviewChartJenis}>
                            {/* Definisi gradasi warna orange */}
                            <defs>
                                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F97316" /> {/* Orange-500 */}
                                    <stop offset="100%" stopColor="#FDBA74" /> {/* Orange-300 */}
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value} Ticket`}
                                allowDecimals={false}  
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#FED7AA" }} /> {/* Efek hover */}
                            <Bar
                                dataKey="total"
                                fill="url(#orangeGradient)"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500} // Animasi
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-2 lg:col-span-2 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply">
                <CardHeader>
                    <CardTitle className="text-center">Overview Ticket By Type Category Product</CardTitle>
                </CardHeader>
                <CardDescription className="text-center">Data Last 12 Months</CardDescription>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={overviewChartCategory}>
                            {/* Definisi gradasi warna orange */}
                            <defs>
                                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F97316" /> {/* Orange-500 */}
                                    <stop offset="100%" stopColor="#FDBA74" /> {/* Orange-300 */}
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value} Ticket`}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#FED7AA" }} /> {/* Efek hover */}
                            <Bar
                                dataKey="total"
                                fill="url(#orangeGradient)"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500} // Animasi
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            
        </div>
    );
}
