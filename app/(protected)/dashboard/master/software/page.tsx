"use client";

import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search"
import Pagination from "@/components/ui/pagination";
import SoftwareTable from "@/components/dashboard/master/software/table";
import { CreateSoftware } from "@/components/dashboard/master/software/buttons";
import { SoftwareStatsCards } from "@/components/dashboard/master/software/stats-cards";
import { PageAnimate } from "@/components/dashboard/master/product/client-wrapper";
import { MonitorSmartphone } from "lucide-react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { fetchSoftwarePages, fetchSoftwareOverviewStats, fetchFilteredSoftware } from "@/data/asset/software";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

const SoftwarePage = ({
    searchParams
}: {
    searchParams?: {
        query?: string;
        page?: string;
    }
}) => {
    const [totalPages, setTotalPages] = useState<number>(0);
    const [stats, setStats] = useState<any>(null);
    const [software, setSoftware] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const query = searchParams?.query || "";
    const page = searchParams?.page || "1";
    const currentPage = Number(page) || 1;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pages, overviewStats, filteredSoftware] = await Promise.all([
                    fetchSoftwarePages(query || ""),
                    fetchSoftwareOverviewStats(),
                    fetchFilteredSoftware(query, currentPage)
                ]);
                setTotalPages(pages);
                setStats(overviewStats);
                setSoftware(filteredSoftware);
            } catch (error) {
                console.error("Error fetching software data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query, currentPage]);

    return (
        <ContentLayout title="software_management">
            <div className={cn("flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 md:p-8 min-h-full", font.className)}>
                <MasterPageHeader
                    titleKey="perangkat_lunak"
                    descKey="software_description"
                    icon={MonitorSmartphone}
                    breadcrumbKeys={[
                        { labelKey: "dashboard", href: "/dashboard" },
                        { labelKey: "master", href: "/dashboard" },
                        { labelKey: "perangkat_lunak" }
                    ]}
                />

                <PageAnimate>
                    <div className="space-y-4 sm:space-y-8">
                        {/* Stats Section */}
                        {stats && <SoftwareStatsCards stats={stats} />}

                        {/* Action Bar & Table Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm transition-all duration-300">
                                <div className="flex-1 max-w-md">
                                    <Search placeholder="Quick find software..." />
                                </div>
                                <CreateSoftware />
                            </div>

                            <div className="w-full">
                                <SoftwareTable software={software} loading={loading} />
                            </div>

                            <div className="flex justify-center mt-6 sm:mt-8 pb-10">
                                <Pagination totalPages={totalPages} />
                            </div>
                        </div>
                    </div>
                </PageAnimate>
            </div>
        </ContentLayout>
    );
};

export default SoftwarePage;