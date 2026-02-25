"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import { fetchTicketListPages, fetchTicketListSchedule, fetchTicketListTechnician, fetchTicketAssignStats } from "@/data/asset/ticket";
import TechnicianScheduleTable from "@/components/asset-management/technician/schedule/tabel-technician";
import DashboardStats from "@/components/asset-management/technician/assign/stats";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { Calendar, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useCurrentUser } from "@/hooks/use-current-user";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TicketPage = ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams?.query || "";
  const page = searchParams?.page || "1";
  const currentPage = Number(page) || 1;

  const fetchData = useCallback(async () => {
    if (!user?.role) return;
    setLoading(true);
    setError(null);
    try {
      const email = user.email || "";
      const role = user.role;

      const [pages, ticketsData, statsData] = await Promise.all([
        fetchTicketListPages(query || ""),
        role === "ADMIN"
          ? fetchTicketListSchedule(query, currentPage)
          : fetchTicketListTechnician(query, currentPage, email),
        fetchTicketAssignStats()
      ]);

      setTotalPages(pages);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  }, [query, currentPage, user?.email, user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ContentLayout title="jadwal_teknisi">
      <div className="flex flex-col gap-6 p-2 md:p-6 pt-6">
        <Link href="/dashboard" className="w-fit">
          <Button variant="ghost" size="sm" className="group text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-black uppercase text-[10px] tracking-widest gap-3 p-0 h-auto transition-all">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 group-hover:scale-110 transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </div>
            {t("back_to_dashboard")}
          </Button>
        </Link>
        <MasterPageHeader
          titleKey="jadwal_teknisi"
          descKey="jadwal_teknisi_desc"
          icon={Calendar}
          breadcrumbKeys={[
            { labelKey: "dashboard", href: "/dashboard" },
            { labelKey: "teknisi", href: "/dashboard/technician/assign" },
            { labelKey: "jadwal_teknisi" }
          ]}
        />

        <DashboardStats stats={stats} loading={loading} />

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full md:w-72">
              <Search placeholder={t("search_schedule_placeholder")} />
            </div>
          </div>

          <div className="w-full">
            <TechnicianScheduleTable tickets={tickets} loading={loading} error={error} />
          </div>

          <div className="flex justify-center pt-4 border-t border-gray-50 dark:border-slate-800">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default TicketPage;