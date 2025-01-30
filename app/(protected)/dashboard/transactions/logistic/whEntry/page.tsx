import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import WhEntryTable from "@/components/dashboard/transactions/logistic/whEntry/table";
import { CreateWhEntry } from "@/components/dashboard/transactions/logistic/whEntry/buttons";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { fetchWhEntryPages } from "@/data/transactions/logistic/wh-entry";
import Pagination from "@/components/ui/pagination";

const WarehouseEntry = async ({
  searchParams
}: {
  searchParams?: {
    query: string;
    page?: string;
  }
}) => {
  const { query="", page } = await searchParams || {
    query: "", page: "1" };

    const currentPage = Number(page) || 1;
    const totalPages = await fetchWhEntryPages(query || "");

  return (
    <ContentLayout title="Warehouse Entry">
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
              <Link href="/dashboard">Logistic</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Warehouse Entry</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="h-full w-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <Search placeholder="Search Product..." />
            <CreateWhEntry />
          </div>

          <div className="w-full">
            <WhEntryTable query={query} currentPage={currentPage}/>
          </div>

          <div className="flex justify-center mt-4">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default WarehouseEntry;