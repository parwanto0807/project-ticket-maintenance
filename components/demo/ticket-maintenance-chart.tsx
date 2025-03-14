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

export default function DashboardChartSectionAdmin() {
  const [overviewChartData, setOverviewChartData] = useState<{ name: string; total: number }[]>([]);
  const [ticketData, setTicketData] = useState<{ name: string; email: string; assetName: string; status: string }[]>([]);

  const user = useCurrentUser();
  const email = user?.email;

  useEffect(() => {
    async function fetchOverviewData() {
      if (!email) return;
      try {
        const response = await fetch(
          `/api/dashboard-admin/chart`
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
        const response = await fetch(`/api/dashboard-admin/ticket`);
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Card Overview dengan Chart */}
      <Card className="col-span-2 lg:col-span-4 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply h-full">
        <CardHeader>
          <CardTitle>Overview Ticket Maintenance Last 12 Months </CardTitle>
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
      <Card className="col-span-2 lg:col-span-3 bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-blend-multiply mb-20 h-full">
        <CardHeader>
          <CardTitle>Recent tickets</CardTitle>
          <CardDescription>You made 6 tickets this month from all user.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {ticketData.map((ticket, index) => (
              <div key={index} className="flex items-center">
                <Avatar className="size-9">
                  <AvatarFallback>{initials(ticket.name)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{ticket.name}</p>
                  <p className="text-xs text-muted-foreground md:text-sm">{ticket.email}</p>
                </div>
                <div className={`ml-auto font-medium px-2 py-1 text-xs rounded-md ${ticket.status === "Pending"
                  ? "bg-red-100 text-red-500"
                  : ticket.status === "Assigned"
                    ? "bg-blue-100 text-blue-500"
                    : ticket.status === "In_Progress"
                      ? "bg-orange-100 text-orange-500"
                      : ticket.status === "Completed"
                        ? "bg-green-100 text-green-500"
                        : ticket.status === "Canceled"
                          ? "bg-red-100 text-red-500"
                          : "bg-gray-100 text-gray-500"
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