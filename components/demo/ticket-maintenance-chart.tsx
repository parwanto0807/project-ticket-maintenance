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
import { useCurrentUser } from "@/hooks/use-current-user";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  PlayCircle,
  Ticket,
  Calendar,
  Sparkles
} from "lucide-react";

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
    .toUpperCase()
    .slice(0, 2);
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
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
  </div>
);

const TicketSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-y-4">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="ml-4 space-y-2 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
      </div>
    ))}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Pending: { 
      icon: Clock, 
      color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30",
      gradient: "from-red-500 to-orange-500"
    },
    Assigned: { 
      icon: AlertCircle, 
      color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30",
      gradient: "from-blue-500 to-cyan-500"
    },
    In_Progress: { 
      icon: PlayCircle, 
      color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/30",
      gradient: "from-orange-500 to-amber-500"
    },
    Completed: { 
      icon: CheckCircle, 
      color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30",
      gradient: "from-green-500 to-emerald-500"
    },
    Canceled: { 
      icon: XCircle, 
      color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800/30",
      gradient: "from-gray-500 to-slate-500"
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${config.color}`}>
      <IconComponent className="w-3 h-3" />
      <span>{status.replace('_', ' ')}</span>
    </div>
  );
};

export default function DashboardChartSectionAdmin() {
  const [overviewChartData, setOverviewChartData] = useState<{ name: string; total: number }[]>([]);
  const [ticketData, setTicketData] = useState<{ name: string; email: string; assetName: string; status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [hoveredChart, setHoveredChart] = useState(false);

  const user = useCurrentUser();
  const email = user?.email;

  useEffect(() => {
    async function fetchOverviewData() {
      if (!email) return;
      try {
        setIsChartLoading(true);
        const response = await fetch(`/api/dashboard-admin/chart`);
        const data = await response.json();
        setOverviewChartData(data);
        
        // Calculate total tickets from chart data
        const total = data.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
        setTotalTickets(total);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setIsChartLoading(false);
      }
    }
    fetchOverviewData();
  }, [email]);

  // Fetch recent tickets data
  useEffect(() => {
    async function fetchRecentTickets() {
      try {
        setIsLoading(true);
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
          .slice(0, 8)
          .map((ticket: TicketRecord) => ({
            name: ticket.name || "No Name",
            email: ticket.email || "No Email",
            assetName: ticket.amount || "No Asset",
            status: ticket.status || "Pending",
          }));

        setTicketData(recentTickets);
      } catch (error) {
        console.error("Error fetching recent tickets:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentTickets();
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

  const ticketVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
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
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Ticket Analytics
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Maintenance ticket overview and recent activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {totalTickets}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Total Tickets</div>
          </div>
          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
              {ticketData.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Recent</div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart Card */}
        <motion.div
          variants={cardVariants}
          className="col-span-2 lg:col-span-4"
          onMouseEnter={() => setHoveredChart(true)}
          onMouseLeave={() => setHoveredChart(false)}
        >
          <Card className={`
            bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border transition-all duration-300 h-full
            ${hoveredChart 
              ? 'border-orange-300/50 dark:border-orange-600/50 shadow-2xl shadow-orange-500/10' 
              : 'border-white/50 dark:border-slate-700/50 shadow-2xl shadow-orange-500/5 dark:shadow-black/20'
            }
          `}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-xl shadow-lg transition-all duration-300
                    ${hoveredChart
                      ? 'bg-gradient-to-br from-orange-600 to-amber-600 shadow-orange-600/25'
                      : 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/25'
                    }
                  `}>
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`
                      text-lg font-bold transition-colors duration-300
                      ${hoveredChart ? 'text-orange-600 dark:text-orange-400' : 'text-slate-800 dark:text-white'}
                    `}>
                      Ticket Trends
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Last 12 Months Overview
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Calendar className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                  <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                    {totalTickets} Total
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isChartLoading ? (
                <ChartSkeleton />
              ) : (
                <motion.div
                  variants={chartVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={overviewChartData}>
                      <defs>
                        <linearGradient id="modernGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F97316" stopOpacity={0.9} />
                          <stop offset="50%" stopColor="#FB923C" stopOpacity={0.7} />
                          <stop offset="100%" stopColor="#FDBA74" stopOpacity={0.5} />
                        </linearGradient>
                        <linearGradient id="hoverGradient" x1="0" y1="0" x2="0" y2="1">
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
                          fill: "rgba(251, 146, 60, 0.1)",
                          stroke: "#FB923C",
                          strokeWidth: 1,
                          strokeDasharray: "3 3"
                        }}
                      />
                      <Bar
                        dataKey="total"
                        fill={hoveredChart ? "url(#hoverGradient)" : "url(#modernGradient)"}
                        radius={[8, 8, 0, 0]}
                        animationDuration={1800}
                        className="transition-all duration-300"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Tickets Card */}
        <motion.div
          variants={cardVariants}
          className="col-span-2 lg:col-span-3"
        >
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-orange-500/5 dark:shadow-black/20 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                      Recent Tickets
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Latest {ticketData.length} maintenance requests
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    Live
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                {isLoading ? (
                  <TicketSkeleton />
                ) : ticketData.length > 0 ? (
                  ticketData.map((ticket, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={ticketVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-600/50"
                    >
                      <Avatar className="size-10 border-2 border-white dark:border-slate-700 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white font-semibold">
                          {initials(ticket.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {ticket.name}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {ticket.email}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 truncate">
                          {ticket.assetName}
                        </p>
                      </div>
                      
                      <StatusBadge status={ticket.status} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Ticket className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-500">No recent tickets</p>
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
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          Real-time ticket monitoring and analytics
        </div>
      </motion.div>
    </motion.div>
  );
}