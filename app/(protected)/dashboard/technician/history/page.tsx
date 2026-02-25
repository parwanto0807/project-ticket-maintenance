"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import { fetchTicketListPages } from "@/data/asset/ticket";
import HistoryTableTechnician from "@/components/asset-management/technician/history/tabel-history-technician";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { History, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TicketPage = ({ searchParams }: { searchParams: { query?: string; page?: string } }) => {
  const { t } = useTranslation();
  const [totalPages, setTotalPages] = useState<number>(0);

  const query = searchParams.query || "";
  const currentPage = parseInt(searchParams.page || "1", 10);
  const offset = (currentPage - 1);

  useEffect(() => {
    const fetchData = async () => {
      const pages = await fetchTicketListPages(query || "");
      setTotalPages(pages);
    };
    fetchData();
  }, [query]);

  return (
    <ContentLayout title="riwayat_teknisi">
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
          titleKey="riwayat_teknisi"
          descKey="riwayat_teknisi_desc"
          icon={History}
          breadcrumbKeys={[
            { labelKey: "dashboard", href: "/dashboard" },
            { labelKey: "teknisi", href: "/dashboard/technician/assign" },
            { labelKey: "riwayat_teknisi" }
          ]}
        />

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="w-full md:max-w-sm">
                <Search placeholder={t("search_tickets_placeholder")} />
              </div>
              <div className="flex justify-center">
                <Pagination totalPages={totalPages} />
              </div>
            </div>

            <div className="w-full">
              <HistoryTableTechnician offset={offset} searchParams={searchParams} />
            </div>

            <div className="mt-8 flex justify-center border-t border-slate-50 dark:border-slate-800 pt-6">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default TicketPage;