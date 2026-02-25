"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { MaintenancePlannerGrid } from "@/components/asset-management/technician/planner/planner-grid";
import { fetchMaintenancePlannerData, fetchMaintenancePlannerPages } from "@/data/asset/planner";
import { getTechniciansForData } from "@/data/asset/technician";
import Search from "@/components/ui/search";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { CalendarRange } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import React, { useEffect, useState } from "react";


export default function PlannerPage({
    searchParams
}: {
    searchParams?: {
        year?: string;
        page?: string;
        query?: string;
    }
}) {
    const { t } = useTranslation();
    const [dataState, setDataState] = useState<{ data: any; technicians: any; totalPages: number } | null>(null);

    const currentYearFixed = new Date().getFullYear();
    const yearValue = searchParams?.year || currentYearFixed.toString();
    const year = parseInt(yearValue, 10);
    const pageValue = searchParams?.page || "1";
    const currentPage = Number(pageValue) || 1;
    const queryValue = searchParams?.query || "";

    useEffect(() => {
        const fetchData = async () => {
            const [data, technicians, totalPages] = await Promise.all([
                fetchMaintenancePlannerData(year, currentPage, queryValue),
                getTechniciansForData(),
                fetchMaintenancePlannerPages(queryValue)
            ]);
            setDataState({ data, technicians, totalPages });
        };
        fetchData();
    }, [year, currentPage, queryValue]);

    if (!dataState) return null;

    return (
        <ContentLayout title="penjadwalan_berkala">
            <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
                <MasterPageHeader
                    titleKey="penjadwalan_berkala"
                    descKey="penjadwalan_berkala_desc"
                    icon={CalendarRange}
                    breadcrumbKeys={[
                        { labelKey: "dashboard", href: "/dashboard" },
                        { labelKey: "teknisi", href: "/dashboard/technician/assign" },
                        { labelKey: "penjadwalan_berkala" }
                    ]}
                />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <Search placeholder={t("search_planner_placeholder")} />
                </div>

                <MaintenancePlannerGrid
                    initialData={dataState.data}
                    currentYear={year}
                    technicians={dataState.technicians as any}
                    totalPages={dataState.totalPages}
                />
            </div>
        </ContentLayout>
    );
}
