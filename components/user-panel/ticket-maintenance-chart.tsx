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
import { useCurrentUser } from "@/hooks/use-current-user";

interface TicketRecord {
  name: string;
  email: string;
  amount: string;
  createdAt: string;
  status: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
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

export default function DashboardChartSection() {
  const [overviewChartData, setOverviewChartData] = useState<{ name: string; total: number }[]>([]);
  const [ticketData, setTicketData] = useState<{ name: string; email: string; assetName: string; status: string }[]>([]);

  const user = useCurrentUser();
  const email = user?.email;

  useEffect(() => {
    async function fetchOverviewData() {
      if (!email) return;
      try {
        const response = await fetch(
          `/api/ticket/dashboard-chart/${encodeURIComponent(email)}`
        );
        const data = await response.json();
        setOverviewChartData(data);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    }
    fetchOverviewData();
  }, [user, email]);

  // Fetch recent tickets data (untuk semua tiket)
  useEffect(() => {
    async function fetchRecentTickets() {
      try {
        const response = await fetch(`/api/ticket/dashboard-ticket`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data tiket");
        }
        const data = await response.json();

        const recentTickets = data
          .sort(
            (a: TicketRecord, b: TicketRecord) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 10)
          .map((ticket: TicketRecord) => ({
            name: ticket.name || "No Name",
            email: ticket.email || "No Email",
            assetName: ticket.amount || "No Asset",
            status: ticket.status || "",
          }));

        setTicketData(recentTickets);
      } catch (error) {
        console.error("Error fetching recent tickets:", error);
      }
    }

    fetchRecentTickets();
  }, []);


  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
      {/* Card Overview dengan Chart */}
      <Card className="col-span-1 lg:col-span-4 bg-gradient-to-br from-orange-50/50 via-white to-orange-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-orange-100/50 dark:border-slate-800 shadow-xl shadow-orange-500/5">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
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

      {/* Card Recent tickets */}
      <Card className="col-span-1 lg:col-span-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-2xl sm:rounded-[2rem] shadow-xl shadow-blue-500/5">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-6">
          <CardTitle className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-500">Tiket Terbaru</CardTitle>
          <CardDescription className="text-[10px] sm:text-sm font-medium">Monitoring status pemeliharaan terkini</CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="space-y-3 sm:space-y-6">
            {ticketData.map((ticket, index) => (
              <div key={index} className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <AvatarFallback className="text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{initials(ticket.name)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 sm:ml-4 space-y-0.5 min-w-0 flex-1">
                  <p className="text-[12px] sm:text-sm font-bold leading-none truncate dark:text-white">{ticket.name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">{ticket.email}</p>
                </div>
                <div className={`ml-2 font-black px-2 py-1 text-[9px] sm:text-[10px] rounded-full uppercase tracking-tight shadow-sm ${ticket.status === "Pending"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : ticket.status === "Assigned"
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : ticket.status === "In_Progress"
                      ? "bg-orange-50 text-orange-600 border border-orange-100"
                      : ticket.status === "Completed"
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : ticket.status === "Canceled"
                          ? "bg-slate-100 text-slate-600 border border-slate-200"
                          : "bg-gray-50 text-gray-600 border border-gray-100"
                  }`}>
                  {ticket.assetName}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}