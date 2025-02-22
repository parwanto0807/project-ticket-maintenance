import Link from "next/link"
//import PageProduct from "@/components/demo/products-content";
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
import TicketTable from "@/components/asset-management/maintenance/tabel";
import { CreateTicketButton } from "@/components/asset-management/maintenance/buttons";

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
    <ContentLayout title="Maintenance Ticket">
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
            <BreadcrumbPage>Maintenance Ticket</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="h-full w-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <Search placeholder="Search Ticket..." />
            <CreateTicketButton />
          </div>

          <div className="w-full">
            <TicketTable query={query} currentPage={currentPage} />
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