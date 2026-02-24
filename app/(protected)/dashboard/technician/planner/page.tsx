import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { MaintenancePlannerGrid } from "@/components/asset-management/technician/planner/planner-grid";
import { fetchMaintenancePlannerData, fetchMaintenancePlannerPages } from "@/data/asset/planner";
import { getTechniciansForData } from "@/data/asset/technician";
import Search from "@/components/ui/search";

export default async function PlannerPage({
    searchParams
}: {
    searchParams?: {
        year?: string;
        page?: string;
        query?: string;
    }
}) {
    const currentYear = new Date().getFullYear();
    const year = parseInt((await searchParams)?.year || currentYear.toString(), 10);
    const currentPage = Number((await searchParams)?.page) || 1;
    const query = (await searchParams)?.query || "";

    const [data, technicians, totalPages] = await Promise.all([
        fetchMaintenancePlannerData(year, currentPage, query),
        getTechniciansForData(),
        fetchMaintenancePlannerPages(query)
    ]);

    return (
        <ContentLayout title="Penjadwalan Berkala">
            <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/dashboard">Dasbor</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/dashboard/technician/assign">Teknisi</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Penjadwalan Berkala</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <Search placeholder="Cari nomor aset atau nama..." />
                </div>

                <MaintenancePlannerGrid
                    initialData={data}
                    currentYear={year}
                    technicians={technicians as any}
                    totalPages={totalPages}
                />
            </div>
        </ContentLayout>
    );
}
