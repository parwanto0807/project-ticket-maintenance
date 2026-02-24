import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { fetchTicketListPages } from "@/data/asset/ticket";
import { Badge } from "@/components/ui/badge";
import TechnicianScheduleTable from "@/components/asset-management/technician/schedule/tabel-technician";
import DashboardStats from "@/components/asset-management/technician/assign/stats";

const TicketPage = async ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const { query = "", page } = await searchParams || { query: "", page: "1" };
  const currentPage = Number(page) || 1;
  const totalPages = await fetchTicketListPages(query || "");

  return (
    <ContentLayout title="Technician Schedule">
      <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Badge className="items-center justify-center text-center bg-white/50 backdrop-blur-sm border-gray-100 hover:bg-white transition-colors" variant="outline">
                  <Link href="/dashboard">Dashboard</Link>
                </Badge>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Badge className="items-center justify-center text-center bg-white/50 backdrop-blur-sm border-gray-100 hover:bg-white transition-colors" variant="outline">
                  <Link href="/dashboard">Technician</Link>
                </Badge>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Badge className="items-center justify-center text-center bg-blue-50 text-blue-600 border-blue-100" variant="outline">
                <BreadcrumbPage className="text-blue-600">Technician Schedule</BreadcrumbPage>
              </Badge>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DashboardStats />

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full md:w-72">
              <Search placeholder="Search Schedule..." />
            </div>
          </div>

          <div className="w-full">
            <TechnicianScheduleTable query={query} currentPage={currentPage} />
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