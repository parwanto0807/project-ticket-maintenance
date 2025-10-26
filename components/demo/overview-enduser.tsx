"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import InstallButton from "./installButton";
import DashboardCards from "../user-panel/dashboard-card";
import DashboardChartSection from "../user-panel/ticket-maintenance-chart";
import { 
  Sparkles, 
  TrendingUp, 
  Shield,
  Activity,
  Bell,
  Calendar
} from "lucide-react";

export default function DashboardOverviewPage() {
  const user = useCurrentUser();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Modern Glassmorphism Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <header className="relative py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Welcome Section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Welcome back, {user?.name}!
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
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

              {/* Stats Overview */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Performance</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">Optimal</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Systems</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">Secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <div className="relative px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Quick Actions & Install Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Dashboard Overview
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md">
                <Bell className="h-4 w-4" />
                Notifications
              </button>
              <InstallButton />
            </div>
          </div>

          {/* Dashboard Cards dengan Glassmorphism */}
          <section className="mb-12">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-3xl" />
              <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-blue-500/5 dark:shadow-black/20 p-1">
                <DashboardCards />
              </div>
            </div>
          </section>

          {/* Chart Section dengan Modern Layout */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                    Analytics & Insights
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Real-time performance metrics and trends
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-slate-600 dark:text-slate-400">Tickets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-slate-600 dark:text-slate-400">Maintenance</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-xl rounded-3xl" />
              <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-2xl shadow-orange-500/5 dark:shadow-black/20 p-1">
                <DashboardChartSection />
              </div>
            </div>
          </section>

          {/* Bottom Decorative Element */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                System Operational
              </div>
              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
              <div>Last updated: Just now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="fixed top-1/2 right-1/4 w-64 h-64 bg-amber-200/10 dark:bg-amber-500/5 rounded-full blur-3xl" />
    </div>
  );
}