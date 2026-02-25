"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentUser } from '@/hooks/use-current-user';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  LogOut,
  Scan,
  Calendar as CalendarIcon,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import InstallButton from '../demo/installButton';
import { getTechnicianDashboardData } from "@/action/maintenance/technician";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/use-translation";
import { TranslationKeys } from "@/lib/translations";
import { AssetScanner } from "../asset-management/asset/asset-scanner";

export default function DashboardTechnicianPage() {
  const user = useCurrentUser();
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email) {
        const result = await getTechnicianDashboardData(user.email);
        if (result.success) {
          setData(result.data);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.email]);

  const handleSignOut = () => {
    signOut();
    window.location.href = '/auth/login';
  };

  const getTimeBasedGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return t("good_morning");
    if (hours >= 12 && hours < 17) return t("good_afternoon");
    return t("good_evening");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium italic">{t("preparing_workspace")}</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full bg-[#F8FAFC]">
      <div className="pb-24">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-3 sm:p-5 pb-16 pt-10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex-shrink-0 flex items-center justify-center shadow-inner">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex flex-col">
                <p className="text-blue-100 text-[10px] font-medium uppercase tracking-widest">{getTimeBasedGreeting()}</p>
                <h1 className="text-lg sm:text-xl font-black text-white leading-tight break-words">{user?.name}</h1>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex-shrink-0 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl overflow-hidden">
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-tighter">{t("your_specialization")}</p>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight break-words">{data?.technician?.specialization || t("general_technician")}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white border-none shadow-sm px-3 py-1 text-[10px] font-black uppercase">{t("active")}</Badge>
                <p className="text-white/60 text-[9px] italic uppercase tracking-tighter">{t("verified_provider")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Area */}
        <div className="px-2 sm:px-5 -mt-12 mb-8 relative z-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="border-none shadow-xl shadow-blue-900/5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white duration-300 flex-shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider truncate">{t("total_tasks")}</p>
                    <p className="text-2xl font-black text-slate-800 truncate">{data?.stats?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl shadow-orange-900/5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white duration-300 flex-shrink-0">
                    <Clock className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider truncate">{t("in_progress")}</p>
                    <p className="text-2xl font-black text-slate-800 truncate">{data?.stats?.inProgress || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl shadow-red-900/5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white duration-300 flex-shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider truncate">{t("pending")}</p>
                    <p className="text-2xl font-black text-slate-800 truncate">{data?.stats?.pending || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl shadow-green-900/5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <CardContent className="p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-50 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white duration-300 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider truncate">{t("completed")}</p>
                    <p className="text-2xl font-black text-slate-800 truncate">{data?.stats?.completed || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="px-2.5 sm:px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">{t("quick_navigation")}</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">{t("shortcut")}</span>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
            <Link href="/dashboard/technician/schedule" className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                <ClipboardList className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter text-center leading-none">{t("task_list")}</span>
            </Link>
            <Link href="/dashboard/technician/history" className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                <CalendarIcon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter text-center leading-none">{t("riwayat_pemeliharaan")}</span>
            </Link>
            <AssetScanner
              trigger={
                <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 group w-full">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300">
                    <Scan className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter text-center leading-none">{t("scan_asset")}</span>
                </button>
              }
            />
          </div>
        </div>

        {/* Recent Tasks Section */}
        <div className="px-2.5 sm:px-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">{t("recent_activities")}</h3>
            <Link href="/dashboard/technician/schedule" className="text-[10px] font-black text-blue-600 hover:underline uppercase">{t("view_all")}</Link>
          </div>

          <div className="space-y-3">
            {data?.recentTasks?.length > 0 ? (
              data.recentTasks.map((task: any) => (
                <Link key={task.id} href="/dashboard/technician/schedule" className="block">
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                    <CardContent className="p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                          {task.asset?.assetImage1 ? (
                            <img src={task.asset.assetImage1} alt="Asset" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <AlertCircle className="w-6 h-6 text-slate-300" />
                            </div>
                          )}
                          <div className={cn(
                            "absolute top-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full",
                            task.status === "Pending" ? "bg-red-500" : task.status === "In_Progress" ? "bg-orange-500" : "bg-green-500"
                          )}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full tracking-tighter shadow-sm flex-shrink-0 max-w-[100px] truncate">{task.ticketNumber}</span>
                            <span className="text-[9px] font-bold text-slate-400 flex-shrink-0">{format(new Date(task.updatedAt), "HH:mm")}</span>
                          </div>
                          <h4 className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{task.asset?.product?.part_name || t("unknown_asset")}</h4>
                          <p className="text-[10px] text-slate-500 font-medium line-clamp-1 italic tracking-tighter mb-1">“{task.troubleUser || t("no_problem_summary")}”</p>
                          <div className="flex items-center gap-x-2">
                            <div className="flex items-center gap-1 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0"></div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">{t(task.status as TranslationKeys) || task.status}</span>
                            </div>
                            <div className="flex items-center gap-1 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0"></div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">{task.asset?.location || t("no_location")}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mt-5 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest text-center italic">{t("no_active_tasks")}</p>
                <p className="text-[10px] text-slate-400 mt-1 italic tracking-tighter uppercase font-medium">{t("no_active_tasks_desc")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Spacing & PWA Link */}
        <div className="px-2.5 sm:px-5 mt-10 space-y-6">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-none shadow-2xl shadow-slate-900/40 rounded-3xl group overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-black text-sm uppercase tracking-wider mb-1 truncate">{t("offline_access")}</h3>
                  <p className="text-slate-400 text-[10px] font-medium line-clamp-2 tracking-tight italic">{t("install_app_desc")}</p>
                </div>
                <div className="flex-shrink-0">
                  <InstallButton />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center pb-10">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic tracking-[0.2em]">Ticket Management Pro v1.2</p>
            <div className="w-12 h-1 w-1 bg-slate-200 rounded-full mt-3"></div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
