import Link from "next/link"
//import PageProduct from "@/components/demo/products-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import { FetchPriceAllPages } from "@/data/master/price";
import Pagination from "@/components/ui/pagination";
import PriceTable from "@/components/dashboard/master/product-price/table";
import { CreatePrice } from "@/components/dashboard/master/product-price/buttons";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const PricePage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await FetchPriceAllPages(query);
  return (
    <ContentLayout title="Product Price">
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
            <BreadcrumbPage>Product Price</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <Search placeholder="Search product price..." />
            <CreatePrice />
          </div>

          <div className="w-full">
            <PriceTable query={query} currentPage={currentPage} />
          </div>

          <div className="flex justify-center mt-4">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default PricePage;