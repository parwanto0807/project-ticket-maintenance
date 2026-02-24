"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
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
  Users,
  Boxes,
  HardDrive,
  ChevronLeft,
  FolderOpen,
  FileText,
  ClipboardList,
  Wrench,
  Settings,
  Package,
  UserCog
} from "lucide-react";
import Link from "next/link";

// Component untuk Mobile Shortcut Menu dengan group navigation
const MobileShortcutMenu = () => {
  const user = useCurrentUser();
  const role = user?.role || "USER";
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Definisikan groups berdasarkan role
  const getMenuGroups = () => {
    if (role === "USER") {
      return [
        {
          id: "services",
          label: "Services",
          icon: ClipboardList,
          color: "from-blue-500 to-blue-600",
          menus: [
            {
              href: "/dashboard/maintenance/ticket",
              label: "Ticket History",
              icon: FileText,
              description: "View your ticket history"
            },
            {
              href: "/dashboard/maintenance/ticket/create",
              label: "Create Ticket",
              icon: Plus,
              description: "Create new maintenance ticket"
            },
            {
              href: "/dashboard/asset/asset-list-user",
              label: "My Assets",
              icon: Package,
              description: "View your assigned assets"
            }
          ]
        }
      ];
    }

    if (role === "TECHNICIAN") {
      return [
        {
          id: "technician",
          label: "Technician",
          icon: Wrench,
          color: "from-orange-500 to-orange-600",
          menus: [
            {
              href: "/dashboard/technician/schedule",
              label: "Schedule",
              icon: Calendar,
              description: "View your work schedule"
            },
            {
              href: "/dashboard/technician/history",
              label: "History",
              icon: ClipboardList,
              description: "Maintenance history"
            },
            {
              href: "/dashboard/technician/assign",
              label: "Assigned Tasks",
              icon: UserCog,
              description: "Your assigned tasks"
            }
          ]
        }
      ];
    }

    // ADMIN groups
    return [
      {
        id: "master",
        label: "Master Data",
        icon: Boxes,
        color: "from-blue-500 to-blue-600",
        menus: [
          {
            href: "/dashboard/master/products",
            label: "Products",
            icon: Package,
            description: "Manage products inventory"
          },
          {
            href: "/dashboard/master/software",
            label: "Software",
            icon: Settings,
            description: "Software licenses and management"
          },
          {
            href: "/dashboard/master/employees",
            label: "Employees",
            icon: Users,
            description: "Employee database"
          }
        ]
      },
      {
        id: "assets",
        label: "Assets",
        icon: HardDrive,
        color: "from-green-500 to-green-600",
        menus: [
          {
            href: "/dashboard/asset/asset-list",
            label: "Asset List",
            icon: HardDrive,
            description: "Manage all assets"
          }
        ]
      },
      {
        id: "maintenance",
        label: "Maintenance",
        icon: Wrench,
        color: "from-orange-500 to-orange-600",
        menus: [
          {
            href: "/dashboard/technician/assign",
            label: "Assign Technician",
            icon: UserCog,
            description: "Assign technicians to tasks"
          },
          {
            href: "/dashboard/technician/schedule",
            label: "Schedule",
            icon: Calendar,
            description: "Technician schedules"
          },
          {
            href: "/dashboard/technician/history",
            label: "History",
            icon: ClipboardList,
            description: "Maintenance history"
          },
          {
            href: "/dashboard/technician/list",
            label: "Technician List",
            icon: Users,
            description: "Manage technicians"
          }
        ]
      }
    ];
  };

  const menuGroups = getMenuGroups();
  const activeGroupData = menuGroups.find(group => group.id === activeGroup);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="lg:hidden mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          Quick Access
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
          {menuGroups.length} groups
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!activeGroup ? (
          // Group View
          <motion.div
            key="groups"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-3 gap-3 px-1"
          >
            {menuGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer"
                onClick={() => setActiveGroup(group.id)}
              >
                <div className={`
                  rounded-xl p-3 flex flex-col items-center justify-center text-center
                  bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm 
                  border border-slate-200/80 dark:border-slate-700/80
                  shadow-xs hover:shadow-sm transition-all duration-200
                  group-hover:border-slate-300/60 dark:group-hover:border-slate-600/60
                `}>
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center mb-2
                    bg-gradient-to-br ${group.color} shadow-md
                    group-hover:shadow-lg transition-all duration-200
                  `}>
                    <group.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                    {group.label}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                    {group.menus.length} menus
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Menu Detail View
          <motion.div
            key="menu-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >


            {/* Group Header */}
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeGroupData?.color} flex items-center justify-center shadow-sm`}>
                {activeGroupData?.icon && React.createElement(activeGroupData.icon, { className: "w-3 h-3 text-white" })}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {activeGroupData?.label}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {activeGroupData?.menus.length} menus available
                </p>
              </div>
            </div>

            {/* Menu List */}
            <div className="space-y-3">
              {activeGroupData?.menus.map((menu, index) => (
                <motion.div
                  key={menu.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                >
                  <Link href={menu.href}>
                    <div
                      className="group relative flex items-center gap-3 p-3.5 rounded-xl 
                     bg-white/60 dark:bg-slate-900/40 backdrop-blur-md 
                     border border-slate-200/50 dark:border-slate-700/40 
                     hover:border-slate-300 dark:hover:border-slate-600 
                     shadow-sm hover:shadow-md transition-all duration-300 
                     cursor-pointer overflow-hidden"
                    >
                      {/* Subtle gradient highlight */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/5 via-indigo-500/10 to-purple-500/5"></div>

                      {/* Icon */}
                      <div
                        className="relative z-10 w-9 h-9 flex items-center justify-center 
                       rounded-lg bg-gradient-to-tr from-slate-100 to-slate-200 
                       dark:from-slate-800 dark:to-slate-700 
                       group-hover:from-indigo-500/20 group-hover:to-purple-500/20 
                       transition-all duration-300"
                      >
                        <menu.icon className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-indigo-400 transition-colors" />
                      </div>

                      {/* Text */}
                      <div className="relative z-10 flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {menu.label}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {menu.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronLeft
                        className="relative z-10 w-3.5 h-3.5 text-slate-400 rotate-180 
                       transform transition-all group-hover:translate-x-1 
                       group-hover:text-indigo-400"
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end mb-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveGroup(null)}
                className="relative flex items-center gap-2 px-4 py-2 text-xs font-medium 
               text-white rounded-full
               bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
               shadow-md hover:shadow-lg transition-all duration-300
               overflow-hidden"
              >
                {/* Subtle glassy overlay */}
                <span className="absolute inset-0 bg-white/10 blur-md opacity-20"></span>

                <ChevronLeft className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">Back to Groups</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 px-1"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <FolderOpen className="w-3 h-3" />
            {activeGroup ? activeGroupData?.label : "All Groups"}
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            Online
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};


// Ikon Plus untuk USER role
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

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
      <div className="fixed top-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <ScrollArea className="h-screen w-full">
        <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 lg:p-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Sparkles className="h-5 w-5 md:h-7 md:w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-400 rounded-full border-2 md:border-4 border-white dark:border-slate-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2 text-xs md:text-sm">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4" />
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
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-3 md:py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">Live Data</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-3 md:py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <Users className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">{user?.role || "User"}</span>
              </div>
              <button className="flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-3 md:py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg md:rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <Bell className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
                <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">Alerts</span>
              </button>
            </div>
          </motion.div>

          {/* Mobile Shortcut Menu dengan Group Navigation */}
          <MobileShortcutMenu />

          {/* Enhanced Tabs Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 md:space-y-8"
          >
            <Tabs
              defaultValue="overview"
              className="space-y-6 md:space-y-8"
              onValueChange={setActiveTab}
            >
              {/* Tabs List */}
              <motion.div variants={itemVariants}>
                <TabsList className="flex w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl md:rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-1 shadow-lg overflow-x-auto">
                  {[
                    { value: "overview", label: "Overview", icon: <Sparkles className="h-3 w-3 md:h-4 md:w-4" /> },
                    { value: "analytics1", label: "Analytics 1", icon: <BarChart3 className="h-3 w-3 md:h-4 md:w-4" /> },
                    { value: "analytics2", label: "Analytics 2", icon: <PieChart className="h-3 w-3 md:h-4 md:w-4" /> },
                    { value: "iotMonitoring", label: "IoT", icon: <Cpu className="h-3 w-3 md:h-4 md:w-4" /> },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-300 flex-shrink-0 ${activeTab === tab.value
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                        }`}
                    >
                      {tab.icon}
                      <span className="hidden xs:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </motion.div>

              {/* Tab Contents */}
              <TabsContent value="overview" className="space-y-4 md:space-y-6">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 md:space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <div className="relative">
                      <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-2xl md:rounded-3xl" />
                      <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/5 dark:shadow-black/20 p-1">
                        <DashboardCardsAdmin />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="relative">
                      <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-xl rounded-2xl md:rounded-3xl" />
                      <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-orange-500/5 dark:shadow-black/20 p-1">
                        <DashboardChartSectionAdmin />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* Tab contents lainnya */}
              <TabsContent value="analytics1" className="space-y-4 md:space-y-6">
                <motion.div variants={tabVariants} initial="hidden" animate="visible">
                  <div className="relative">
                    <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-xl rounded-2xl md:rounded-3xl" />
                    <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-green-500/5 dark:shadow-black/20 p-1">
                      <DashboardChartAnalistGroup />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics2" className="space-y-4 md:space-y-6">
                <motion.div variants={tabVariants} initial="hidden" animate="visible">
                  <div className="relative">
                    <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl rounded-2xl md:rounded-3xl" />
                    <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-purple-500/5 dark:shadow-black/20 p-1">
                      <DashboardChartAnalist2 />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="iotMonitoring" className="space-y-4 md:space-y-6">
                <motion.div variants={tabVariants} initial="hidden" animate="visible">
                  <div className="relative">
                    <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl rounded-2xl md:rounded-3xl" />
                    <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-cyan-500/5 dark:shadow-black/20 p-1">
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
            className="flex items-center justify-center pt-4 md:pt-6 lg:pt-8"
          >
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-500 dark:text-slate-500 flex-wrap justify-center">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                System Operational
              </div>
              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full hidden sm:block" />
              <div className="text-xs">Last sync: {new Date().toLocaleTimeString()}</div>
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}