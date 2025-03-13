import Link from "next/link"
//import PageProduct from "@/components/demo/products-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
// import Pagination from "@/components/ui/pagination";


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
// import { fetchTicketListPagesUser } from "@/data/asset/ticket";
import { CreateTicketButton } from "@/components/asset-management/maintenance/buttons";
import { Badge } from "@/components/ui/badge";
import TicketTableUser from "@/components/asset-management/maintenance/tabel-user";

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
  // const totalPages = await fetchTicketListPagesUser(query);

  return (
    <ContentLayout title="Maintenance Ticket">
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
                <Link href="/dashboard">Maintenance</Link>
              </Badge>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Badge className="items-center justify-center text-center" variant="outline">
              <BreadcrumbPage>Ticket List</BreadcrumbPage>
            </Badge>
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
            <TicketTableUser query={query} currentPage={currentPage} />
          </div>
{/* 
          <div className="flex justify-center mt-4">
            <Pagination totalPages={totalPages} />
          </div> */}
        </div>
      </div>
    </ContentLayout>
  );
};

export default TicketPage;