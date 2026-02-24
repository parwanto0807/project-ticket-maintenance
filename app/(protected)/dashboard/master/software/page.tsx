import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search"
import Pagination from "@/components/ui/pagination";
import SoftwareTable from "@/components/dashboard/master/software/table";
import { CreateSoftware } from "@/components/dashboard/master/software/buttons";
import { SoftwareStatsCards } from "@/components/dashboard/master/software/stats-cards";
import { PageAnimate } from "@/components/dashboard/master/product/client-wrapper"; // Reuse existing animator
import { MonitorSmartphone } from "lucide-react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { fetchSoftwarePages, fetchSoftwareOverviewStats, fetchFilteredSoftware } from "@/data/asset/software";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

const SoftwarePage = async ({
    searchParams
}: {
    searchParams?: {
        query?: string;
        page?: string;
    }
}) => {
    const { query = "", page } = await searchParams || { query: "", page: "1" };
    const currentPage = Number(page) || 1;
    const totalPages = await fetchSoftwarePages(query || "");
    const stats = await fetchSoftwareOverviewStats();
    const software = await fetchFilteredSoftware(query, currentPage);

    return (
        <ContentLayout title="Software Management">
            <div className={cn("flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 md:p-8 min-h-full", font.className)}>
                {/* Breadcrumb & Title Section */}
                <div className="flex flex-col gap-1">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Master</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-bold text-blue-600 dark:text-blue-400">Software</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="mt-2 text-left">
                        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30">
                                <MonitorSmartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            Master Software
                        </h1>
                        <p className="text-[12px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 max-w-2xl line-clamp-2 sm:line-clamp-none">
                            Centralized repository for your company&apos;s software assets. Track installations, monitor license expirations, and manage vendor details across all hardware assets.
                        </p>
                    </div>
                </div>

                <PageAnimate>
                    <div className="space-y-4 sm:space-y-8">
                        {/* Stats Section */}
                        <SoftwareStatsCards stats={stats} />

                        {/* Action Bar & Table Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm transition-all duration-300">
                                <div className="flex-1 max-w-md">
                                    <Search placeholder="Quick find software..." />
                                </div>
                                <CreateSoftware />
                            </div>

                            <div className="w-full">
                                <SoftwareTable software={software} />
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