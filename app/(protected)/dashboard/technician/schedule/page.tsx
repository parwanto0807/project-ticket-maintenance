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
import { Badge } from "@/components/ui/badge";
import TechnicianScheduleTable from "@/components/asset-management/technician/schedule/tabel-technician";

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Badge className="items-center justify-center text-center" variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Badge>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Badge className="items-center justify-center text-center" variant="outline">
                <Link href="/dashboard">Technician</Link>
              </Badge>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Badge className="items-center justify-center text-center" variant="outline">
              <BreadcrumbPage>Technician Schedule</BreadcrumbPage>
            </Badge>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="h-full w-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <Search placeholder="Search Ticket Assign..." />
            {/* <CreateTicketButtonAssign /> */}
          </div>

          <div className="w-full">
            <TechnicianScheduleTable query={query} currentPage={currentPage} />
          </div>

          <div className="flex justify-center mt-4">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default TicketPage;