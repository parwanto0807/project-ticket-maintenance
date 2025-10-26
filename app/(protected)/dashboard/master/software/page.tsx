import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search"
import Pagination from "@/components/ui/pagination";
import SoftwareTable from "@/components/dashboard/master/software/table";
import { CreateSoftware } from "@/components/dashboard/master/software/buttons";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { fetchSoftwarePages } from "@/data/asset/software";

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

    return (
        <ContentLayout title="Software">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Master</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Software</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="h-full w-full">
                <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                    <div className="flex items-center justify-between gap-2">
                        <Search placeholder="Search Software..." />
                        <CreateSoftware />
                    </div>

                    <div className="w-full">
                        <SoftwareTable query={query} currentPage={currentPage} />
                    </div>

                    <div className="flex justify-center mt-4">
                        <Pagination totalPages={totalPages} />
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default SoftwarePage;