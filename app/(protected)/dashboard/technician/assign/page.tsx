"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import { useTranslation } from "@/hooks/use-translation";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import {
  ClipboardList,
  LayoutGrid,
  Table as TableIcon
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

import { fetchTicketListPages, fetchTicketCalendarData, fetchTicketListAssign, fetchTicketAssignStats } from "@/data/asset/ticket";
import { getTechniciansForData } from "@/data/asset/technician";
import AssignTable from "@/components/asset-management/technician/assign/tabel";
import { CreateTicketButtonAssign } from "@/components/asset-management/technician/assign/buttons";
import DashboardStats from "@/components/asset-management/technician/assign/stats";
import AssignCalendarView from "@/components/asset-management/technician/assign/calendar-view";
import React, { useEffect, useState } from "react";

const TicketPage = ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<{
    totalPages: number;
    calendarData: any;
    tickets: any[];
    technicians: any[];
    stats: any;
    loading: boolean;
  }>({
    totalPages: 0,
    calendarData: [],
    tickets: [],
    technicians: [],
    stats: null,
    loading: true
  });

  const queryValue = searchParams?.query || "";
  const pageValue = searchParams?.page || "1";
  const currentPage = Number(pageValue) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const [totalPages, calendarData, tickets, technicians, stats] = await Promise.all([
          fetchTicketListPages(queryValue || ""),
          fetchTicketCalendarData(queryValue || ""),
          fetchTicketListAssign(queryValue, currentPage),
          getTechniciansForData(),
          fetchTicketAssignStats()
        ]);
        setData({
          totalPages,
          calendarData,
          tickets: Array.isArray(tickets) ? tickets : [],
          technicians: Array.isArray(technicians) ? technicians : [],
          stats,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching assignment data:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, [queryValue, currentPage]);

  return (
    <ContentLayout title="penugasan_teknisi">
      <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
        <MasterPageHeader
          titleKey="penugasan_teknisi"
          descKey="penugasan_teknisi_desc"
          icon={ClipboardList}
          breadcrumbKeys={[
            { labelKey: "dashboard", href: "/dashboard" },
            { labelKey: "teknisi", href: "/dashboard" },
            { labelKey: "penugasan_teknisi" }
          ]}
        />

        <DashboardStats stats={data.stats} loading={data.loading} />

        <div className="flex flex-col gap-4">
          <Tabs defaultValue="table" className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Search placeholder={t("search_ticket_assign")} />
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm px-4 py-2 flex items-center gap-2">
                    <TableIcon className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-wider">{t("table")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm px-4 py-2 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-wider">{t("calendar")}</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <CreateTicketButtonAssign />
            </div>

            <TabsContent value="table" className="mt-0">
              <div className="w-full">
                <AssignTable
                  data={data.tickets}
                  technician={data.technicians}
                  loading={data.loading}
                  query={queryValue}
                  currentPage={currentPage}
                />
              </div>
              <div className="flex justify-center mt-6 py-4 border-t border-slate-100 dark:border-slate-800">
                <Pagination totalPages={data.totalPages} />
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <AssignCalendarView initialTickets={data.calendarData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ContentLayout>
  );
};

export default TicketPage;