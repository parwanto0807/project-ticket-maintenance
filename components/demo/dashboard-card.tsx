"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import {
  FaSpinner,
} from "react-icons/fa";
import {
  Package,
  Ticket,
  AlertCircle,
  DollarSign,
  TrendingUp,
  BarChart3,
  Sparkles
} from "lucide-react";

interface CardItem {
  title: string;
  value: React.ReactNode;
  tooltip?: string;
  icon: React.ReactNode;
  gradient: string;
  badge?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCardsAdmin = () => {
  const user = useCurrentUser();
  const [totalAssetUser, setTotalAssetUser] = useState<number | null>(null);
  const [totalTicketUser, setTotalTicketUser] = useState<number | null>(null);
  const [openTicketUser, setOpenTicketUser] = useState<number | null>(null);
  const [totalPurchaseCost, setTotalPurchaseCost] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTotalAsset = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard-admin/asset`);
      const data = await response.json();
      setTotalAssetUser(data.total || 0);
      setTotalPurchaseCost(data.totalPurchaseCost || 0);
    } catch (error) {
      console.error("Error fetching total assets:", error);
      setTotalAssetUser(0);
      setTotalPurchaseCost(0);
    }
  }, []);

  const fetchTotalTicket = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard-admin/card/ticket`);
      const data = await response.json();
      setTotalTicketUser(data.total || 0);
      setOpenTicketUser(data.open || 0);
    } catch (error) {
      console.error("Error fetching total tickets:", error);
      setTotalTicketUser(0);
      setOpenTicketUser(0);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchTotalAsset(), fetchTotalTicket()]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTotalAsset, fetchTotalTicket]);

  useEffect(() => {
    if (user?.email) {
      fetchDashboardData();
    }
  }, [user?.email, fetchDashboardData]);

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cardData: CardItem[] = [
    {
      title: "Total Assets",
      value: totalAssetUser !== null ? (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[16px] md:text-2xl font-black uppercase tracking-tight"
        >
          {totalAssetUser.toLocaleString()}
          <span className="text-[8px] md:text-sm font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">
            Assets
          </span>
        </motion.span>
      ) : (
        <div className="flex items-center justify-center py-2">
          <FaSpinner className="animate-spin text-blue-500 w-4 h-4 md:w-5 md:h-5" />
        </div>
      ),
      tooltip: "Total number of assets managed in the system",
      icon: <Package className="w-4 h-4 md:w-6 md:h-6" />,
      gradient: "from-blue-500 to-cyan-500",
      badge: "Active",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Total Tickets",
      value: totalTicketUser !== null ? (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[16px] md:text-2xl font-black uppercase tracking-tight"
        >
          {totalTicketUser.toLocaleString()}
          <span className="text-[8px] md:text-sm font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">
            Tickets
          </span>
        </motion.span>
      ) : (
        <div className="flex items-center justify-center py-2">
          <FaSpinner className="animate-spin text-emerald-500 w-4 h-4 md:w-5 md:h-5" />
        </div>
      ),
      tooltip: "Total maintenance tickets created",
      icon: <Ticket className="w-4 h-4 md:w-6 md:h-6" />,
      gradient: "from-emerald-500 to-green-500",
      badge: "All Time",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Open Tickets",
      value: openTicketUser !== null ? (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[16px] md:text-2xl font-black uppercase tracking-tight"
        >
          {openTicketUser.toLocaleString()}
          <span className="text-[8px] md:text-sm font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-widest">
            Pending
          </span>
        </motion.span>
      ) : (
        <div className="flex items-center justify-center py-2">
          <FaSpinner className="animate-spin text-amber-500 w-4 h-4 md:w-5 md:h-5" />
        </div>
      ),
      tooltip: "Tickets currently awaiting resolution",
      icon: <AlertCircle className="w-4 h-4 md:w-6 md:h-6" />,
      gradient: "from-amber-500 to-orange-500",
      badge: "Urgent",
      trend: { value: -5, isPositive: false }
    },
    {
      title: "Total Asset Value",
      value: totalPurchaseCost !== null ? (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[14px] md:text-2xl font-black uppercase tracking-tighter"
        >
          {formatCurrency(totalPurchaseCost)}
        </motion.span>
      ) : (
        <div className="flex items-center justify-center py-2">
          <FaSpinner className="animate-spin text-purple-500 w-4 h-4 md:w-5 md:h-5" />
        </div>
      ),
      tooltip: "Total value of all assets in the system",
      icon: <DollarSign className="w-4 h-4 md:w-6 md:h-6" />,
      gradient: "from-purple-500 to-pink-500",
      badge: "Investment",
      trend: { value: 15, isPositive: true }
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  return (
    <Tooltip.Provider delayDuration={100}>
      <motion.div
        initial="hidden"
        animate="visible"
        className="space-y-4 md:space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl shadow-lg">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[10px] md:text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest">
                Overview
              </h2>
              <p className="text-[8px] md:text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">
                Key metrics and indicators
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
            <Sparkles className="w-2.5 h-2.5 md:w-4 md:h-4 text-blue-500" />
            <span className="text-[8px] md:text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">
              Active
            </span>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cardData.map((card, index) => (
            <Tooltip.Root key={index}>
              <Tooltip.Trigger asChild>
                <motion.div
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className={`
                    relative p-3 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden
                    bg-white/70 dark:bg-slate-800/70
                    border-white/50 dark:border-slate-700/50
                    shadow-lg md:shadow-2xl shadow-slate-500/5 dark:shadow-black/20
                    hover:shadow-xl md:hover:shadow-2xl hover:shadow-slate-500/10 dark:hover:shadow-black/30
                  `}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`} />

                  {/* Animated Border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-xl md:rounded-2xl`} />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2 md:mb-4">
                      <motion.div
                        variants={iconVariants}
                        className={`p-1.5 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg shadow-black/10`}
                      >
                        <div className="w-3 h-3 md:w-6 md:h-6 text-white flex items-center justify-center">
                          {card.icon}
                        </div>
                      </motion.div>

                      {/* Badge */}
                      {card.badge && (
                        <span className={`
                          px-1.5 md:px-2 py-0.5 md:py-1 text-xs rounded-full font-medium
                          ${card.gradient.includes('blue') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                          ${card.gradient.includes('emerald') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}
                          ${card.gradient.includes('amber') ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : ''}
                          ${card.gradient.includes('purple') ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                        `}>
                          {card.badge}
                        </span>
                      )}
                    </div>

                    {/* Value */}
                    <div className="mb-1 md:mb-2">
                      {card.value}
                    </div>

                    {/* Title */}
                    <h3 className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 md:mb-3">
                      {card.title}
                    </h3>

                    {/* Trend Indicator */}
                    {card.trend && (
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className={`w-3 h-3 ${card.trend.isPositive
                          ? 'text-green-500'
                          : 'text-red-500 rotate-180'
                          }`} />
                        <span className={`
                          font-medium
                          ${card.trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
                        `}>
                          {card.trend.isPositive ? '+' : ''}{card.trend.value}%
                        </span>
                        <span className="text-slate-500 dark:text-slate-500 hidden sm:inline">
                          from last month
                        </span>
                        <span className="text-slate-500 dark:text-slate-500 sm:hidden">
                          vs last month
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.div>
              </Tooltip.Trigger>

              {card.tooltip && (
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-slate-900 dark:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs shadow-2xl backdrop-blur-xl border border-slate-700/50 z-50 max-w-[200px] text-center"
                    side="top"
                    sideOffset={8}
                  >
                    {card.tooltip}
                    <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-700" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-6 md:py-8"
          >
            <div className="flex items-center gap-2 md:gap-3 text-slate-500 dark:text-slate-500">
              <FaSpinner className="animate-spin text-blue-500 w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm">Loading dashboard data...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Tooltip.Provider>
  );
};

export default DashboardCardsAdmin;