import Link from "next/link"
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
// import HistoryTable from "@/components/asset-management/technician/history/tabel";
// import { Ticket } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";
import HistoryTableTechnician from "@/components/asset-management/technician/history/tabel-history-technician";

const TicketPage = async ({ searchParams }: { searchParams: { query?: string; page?: string } }) => {
  const query = searchParams.query || "";
  const currentPage = parseInt(searchParams.page || "1", 10);
  const totalPages = await fetchTicketListPages(query || "");
  const offset = (currentPage - 1);

  return (
    <ContentLayout title="Technician History">
      <div className="mb-6 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-blue-100 text-blue-600 bg-blue-50/50">
                    Dashboard
                  </Badge>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/technician/schedule" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-blue-100 text-blue-600 bg-blue-50/50">
                    Technician
                  </Badge>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-slate-200 text-slate-500 bg-slate-50">
                  History
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="w-full md:max-w-sm">
              <Search placeholder="Search tickets..." />
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
    </ContentLayout>
  );
};

export default TicketPage;