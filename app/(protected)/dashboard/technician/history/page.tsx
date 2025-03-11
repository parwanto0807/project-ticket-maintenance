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
import { fetchTicketListHistory, fetchTicketListPages } from "@/data/asset/ticket";
import HistoryTable from "@/components/asset-management/technician/history/tabel";
import { Ticket } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";

const TicketPage = async ({ searchParams }: { searchParams: { query?: string; page?: string } }) => {
  // const { query = "", page } = await searchParams || { query: "", page: "1" };
  // const currentPage = Number(page) || 1;


  const query = searchParams.query || "";
  const currentPage = parseInt(searchParams.page || "1", 10);
  const totalPages = await fetchTicketListPages(query || "");
  const tickets = await fetchTicketListHistory(query, currentPage);
  const offset = (currentPage - 1);

  return (
    <ContentLayout title="Technician History">
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
              <BreadcrumbPage>Technician History</BreadcrumbPage>
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
            <HistoryTable data={tickets as Ticket[]} offset={offset} />
          </div>

          <div className="flex justify-center mt-4">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </ContentLayout >
  );
};

export default TicketPage;