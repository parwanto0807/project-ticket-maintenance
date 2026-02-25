"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import { PageAnimate } from "@/components/dashboard/master/product/client-wrapper";
import { cn } from "@/lib/utils";
import { Users2 } from "lucide-react";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { useTranslation } from "@/hooks/use-translation";
import React, { useEffect, useState } from "react";
import TechnicianTable from "@/components/asset-management/technician/list/tabel";
import { getTechniciansPages, getTechnicianStats, getTechnicians } from "@/data/asset/technician";
import { CreateTechnicianButton } from "@/components/asset-management/technician/list/buttons";
import { TechnicianStatsCards } from "@/components/asset-management/technician/list/stats-cards";

const TicketPage = ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const { t } = useTranslation();
  const [dataState, setDataState] = useState<{
    totalPages: number;
    stats: any;
    technicians: any[];
    loading: boolean;
  }>({
    totalPages: 0,
    stats: { total: 0, active: 0, inactive: 0, specializationCount: 0 },
    technicians: [],
    loading: true
  });

  const query = searchParams?.query || "";
  const page = searchParams?.page || "1";
  const currentPage = Number(page) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setDataState(prev => ({ ...prev, loading: true }));
      try {
        const [totalPages, stats, technicians] = await Promise.all([
          getTechniciansPages(query || ""),
          getTechnicianStats(),
          getTechnicians(query, currentPage)
        ]);
        setDataState({
          totalPages,
          stats,
          technicians: Array.isArray(technicians) ? technicians : [],
          loading: false
        });
      } catch (error) {
        console.error("Error fetching technician data:", error);
        setDataState(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, [query, currentPage]);

  if (dataState.loading && !dataState.technicians.length) {
    // Return early if initial loading
  }

  return (
    <ContentLayout title="daftar_teknisi">
      <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 md:p-8 min-h-full">
        <MasterPageHeader
          titleKey="workforce_management"
          descKey="daftar_teknisi_desc"
          icon={Users2}
          breadcrumbKeys={[
            { labelKey: "dashboard", href: "/dashboard" },
            { labelKey: "teknisi", href: "/dashboard/technician/assign" },
            { labelKey: "daftar_teknisi" }
          ]}
        />

        <PageAnimate>
          <div className="space-y-4 sm:space-y-8">
            {/* Stats Section */}
            <TechnicianStatsCards stats={dataState.stats} />

            {/* Action Bar & Table Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex-1 max-w-md">
                  <Search placeholder={t("quick_find_technician")} />
                </div>
                <CreateTechnicianButton />
              </div>

              <div className="w-full">
                <TechnicianTable data={dataState.technicians} loading={dataState.loading} />
              </div>

              <div className="flex justify-center mt-6 sm:mt-8 pb-10">
                <Pagination totalPages={dataState.totalPages} />
              </div>
            </div>
          </div>
        </PageAnimate>
      </div>
    </ContentLayout>
  );
};

export default TicketPage;