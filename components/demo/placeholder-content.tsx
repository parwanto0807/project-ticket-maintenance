"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardChartSectionAdmin from "./ticket-maintenance-chart";
import DashboardCardsAdmin from "./dashboard-card";
import DashboardChartAnalistGroup from "./analist-chart-group";
import DashboardChartAnalist2 from "./analist2-chart-group";
import MqttClient from "../ioT/mqttClient";
import { 
  BarChart3, 
  PieChart, 
  Cpu,
  Sparkles,
  Calendar,
  Bell,
  TrendingUp,
  Users
} from "lucide-react";

export default function DashboardPage() {
  const user = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <ScrollArea className="h-screen w-full">
        <div className="flex-1 space-y-6 p-6 md:p-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Live Data</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Admin</span>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <Bell className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Alerts</span>
              </button>
            </div>
          </motion.div>

          {/* Enhanced Tabs Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
          >
            <Tabs 
              defaultValue="overview" 
              className="space-y-8"
              onValueChange={setActiveTab}
            >
              {/* Modern Tabs List */}
              <motion.div variants={itemVariants}>
                <TabsList className="flex w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-1.5 shadow-lg">
                  {[
                    { value: "overview", label: "Overview", icon: <Sparkles className="h-4 w-4" /> },
                    { value: "analytics1", label: "Analytics 1", icon: <BarChart3 className="h-4 w-4" /> },
                    { value: "analytics2", label: "Analytics 2", icon: <PieChart className="h-4 w-4" /> },
                    { value: "iotMonitoring", label: "IoT Monitoring", icon: <Cpu className="h-4 w-4" /> },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeTab === tab.value
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </motion.div>

              {/* Overview Tab Content */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Dashboard Cards dengan Glassmorphism */}
                  <motion.div variants={itemVariants}>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-3xl" />
                      <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/5 dark:shadow-black/20 p-1">
                        <DashboardCardsAdmin />
                      </div>
                    </div>
                  </motion.div>

                  {/* Chart Section */}
                  <motion.div variants={itemVariants}>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-xl rounded-3xl" />
                      <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-orange-500/5 dark:shadow-black/20 p-1">
                        <DashboardChartSectionAdmin />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* Analytics 1 Tab Content */}
              <TabsContent value="analytics1" className="space-y-6">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-xl rounded-3xl" />
                    <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-green-500/5 dark:shadow-black/20 p-1">
                      <DashboardChartAnalistGroup />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Analytics 2 Tab Content */}
              <TabsContent value="analytics2" className="space-y-6">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl rounded-3xl" />
                    <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-purple-500/5 dark:shadow-black/20 p-1">
                      <DashboardChartAnalist2 />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* IoT Monitoring Tab Content */}
              <TabsContent value="iotMonitoring" className="space-y-6">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl rounded-3xl" />
                    <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-cyan-500/5 dark:shadow-black/20 p-1">
                      <MqttClient />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Footer Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center pt-8"
          >
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                System Operational
              </div>
              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
              <div>Last sync: {new Date().toLocaleTimeString()}</div>
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}