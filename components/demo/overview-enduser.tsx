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
  Calendar,
  ChevronRight,
  Download
} from "lucide-react";
import { useState } from "react";

export default function DashboardOverviewPage() {
  const user = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Enhanced Glassmorphism Header */}
      <div className="relative overflow-hidden border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))] dark:bg-grid-gray-800 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.2),rgba(255,255,255,0.6))]" />
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-100/40 dark:bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/40 dark:bg-purple-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <header className="relative py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Top Bar - Mobile Friendly */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60"
              >
                <div className={`w-6 h-6 transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`}>
                  <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              </button>
            </div>

            {/* Main Header Content */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Welcome Section */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-1">
                        Welcome back, {user?.name || 'User'}!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-sm sm:text-base">
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
                </div>
              </div>

              {/* Stats Overview - Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex gap-3 sm:gap-4">
                <div className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-all duration-200 min-w-[140px]">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Performance</p>
                    <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">Optimal</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-all duration-200 min-w-[140px]">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Systems</p>
                    <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">Secure</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-4 shadow-lg">
                <div className="flex flex-col gap-3">
                  <button className="flex items-center justify-between w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </span>
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">3</span>
                  </button>
                  <div className="w-full">
                    <InstallButton />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Main Content */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Actions & Install Button - Desktop */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Dashboard Overview
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md">
                <Bell className="h-4 w-4" />
                Notifications
                <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full ml-1">3</span>
              </button>
              <InstallButton />
            </div>
          </div>

          {/* Mobile Section Title */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Overview
            </h2>
          </div>

          {/* Dashboard Cards dengan Enhanced Glassmorphism */}
          <section className="mb-8 sm:mb-12">
            <div className="relative">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 blur-xl rounded-3xl" />
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-lg sm:shadow-2xl shadow-blue-500/5 dark:shadow-black/20 p-1 sm:p-2">
                <DashboardCards />
              </div>
            </div>
          </section>

          {/* Chart Section dengan Modern Layout */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                    Analytics & Insights
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Real-time performance metrics and trends
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Tickets</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Maintenance</span>
                  </div>
                </div>
                <button className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/60 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-sm">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Mobile Export Button */}
            <div className="sm:hidden flex justify-end mb-4">
              <button className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/60 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-sm">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-amber-500/5 to-orange-500/5 blur-xl rounded-3xl" />
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-lg sm:shadow-2xl shadow-orange-500/5 dark:shadow-black/20 p-1 sm:p-2">
                <DashboardChartSection />
              </div>
            </div>
          </section>

          {/* Enhanced Bottom Status Bar */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm">System Operational</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="text-xs sm:text-sm">Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span>v2.1.0</span>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <span>© 2024 Your Company</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Decorations */}
      <div className="fixed top-1/4 -left-20 w-80 h-80 bg-blue-100/30 dark:bg-blue-500/5 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-purple-100/30 dark:bg-purple-500/5 rounded-full blur-3xl" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100/20 dark:bg-amber-500/5 rounded-full blur-3xl" />
    </div>
  );
}