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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaSpinner } from "react-icons/fa";
import { Badge } from "../ui/badge";

// Fungsi untuk inisial dari nama
function initials(name: string) {
    return name
        ? name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
        : "U"; // Jika nama kosong, gunakan "U" sebagai default (Unknown)
}

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

    // console.log("Overview Chart Data Detail:", overviewChartDepartmentDataDetail);

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
            } finally {
                setIsLoading(false);
            }
        }
        fetchOverviewData();
    }, []);

    // Fetch data untuk detail ticket
    useEffect(() => {
        const abortController = new AbortController(); // Untuk membatalkan request jika komponen unmount

        async function fetchOverviewDataDetail() {
            try {
                const response = await fetch(`/api/dashboard-admin/analist/detail/department`, {
                    signal: abortController.signal, // Gunakan signal untuk membatalkan request jika diperlukan
                });

                if (!response.ok) throw new Error("Gagal mengambil data analisis tiket");

                const data = await response.json();
                // console.log("Data dari API:", JSON.stringify(data, null, 2)); // Pastikan API mengembalikan data dengan benar

                setOverviewChartDepartmentDataDetail(Array.isArray(data) ? data : []);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    if (error.name !== "AbortError") {
                        console.error("Error fetching overview data:", error);
                    }
                } else {
                    console.error("An unknown error occurred:", error);
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchOverviewDataDetail();

        return () => abortController.abort(); // Cleanup function untuk membatalkan fetch jika komponen unmount
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {/* Card Overview dengan Chart */}
            <Card className="col-span-2 lg:col-span-2 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply h-full">
                <CardHeader>
                    <CardTitle className="text-center">Overview Ticket By Department</CardTitle>
                </CardHeader>
                <CardDescription className="text-center">Data Last 12 Months</CardDescription>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={overviewChartDepartmentData}>
                            <defs>
                                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F97316" />
                                    <stop offset="100%" stopColor="#FDBA74" />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} Ticket`} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#FED7AA" }} />
                            <Bar dataKey="total" fill="url(#orangeGradient)" radius={[4, 4, 0, 0]} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Card Recent tickets */}
            <Card className="col-span-2 lg:col-span-3 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply h-full">
                <CardHeader>
                    <CardTitle>Recent tickets</CardTitle>
                    <CardDescription>You made {overviewChartDepartmentDataDetail.length} Department tickets this last 12 month from all users.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-full">
                    <div className="space-y-8">
                        {/* Loading Spinner */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <FaSpinner className="animate-spin text-orange-500 mx-auto size-10" />
                            </div>
                        ) : overviewChartDepartmentDataDetail.length > 0 ? (
                            [...overviewChartDepartmentDataDetail]
                                .sort((a, b) => b.total - a.total)
                                .map((dept, index) => (
                                    <div key={index} className="flex items-center border-b pb-3">
                                        {/* Avatar dengan inisial departemen */}
                                        <Avatar className="size-9">
                                            <AvatarFallback className="bg-orange-400">{initials(dept.dept_name)}</AvatarFallback>
                                        </Avatar>

                                        {/* Informasi Departemen */}
                                        <div className="ml-4 space-y-1 w-full">
                                            <div className="text-lg font-bold leading-none">
                                                <span>
                                                    <Badge
                                                        variant="outline" className="font-bold border-orange-400">{dept.dept_name}
                                                    </Badge>
                                                </span>
                                            </div>
                                            <p className="text-xs text-medium md:text-sm flex justify-between">
                                                <span className="font-bold">Total Tickets:</span>
                                                <span className="font-semibold">{dept.total} Tickets</span>
                                            </p>

                                            {/* List Karyawan dalam Departemen */}
                                            <ul className="text-xs text-gray-500 mt-2">
                                                {Array.isArray(dept.employees) && dept.employees.length > 0 ? (
                                                    dept.employees.map((emp, empIndex) => (
                                                        <li key={empIndex} className="flex justify-between">
                                                            <span>{emp.name}</span>
                                                            <span className="font-semibold">{emp.ticketCount} Tickets</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No employees found.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p className="text-center text-gray-500">No tickets found.</p>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>

    );
}
