
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
// import { fetchAssetListPagesByEmail } from "@/data/asset/asset";
import AssetUserTable from "@/components/asset-management/asset/tabel-user";
import { Badge } from "@/components/ui/badge";

const AssetList = async ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {

  const { query = "", page } = searchParams || { query: "", page: "1" };
  const currentPage = Number(page) || 1;
  // const totalPages = await fetchAssetListPagesByEmail(query || "", email || "");

  return (
    <ContentLayout title="Asset List">
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
                <Link href="/dashboard">Asset</Link>
              </Badge>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Badge className="items-center justify-center text-center" variant="outline">
              <BreadcrumbPage>Asset List User</BreadcrumbPage>
            </Badge>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="h-full w-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <Search placeholder="Search Asset..." />
          </div>

          <div className="w-full">
            <AssetUserTable query={query} currentPage={currentPage} />
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

export default AssetList;