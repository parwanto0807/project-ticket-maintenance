
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
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="flex-wrap gap-y-1">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="text-[10px] md:text-xs font-black text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="[&>svg]:w-3 [&>svg]:h-3" />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="text-[10px] md:text-xs font-black text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                Asset
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="[&>svg]:w-3 [&>svg]:h-3" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-widest">
              Asset List
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="h-full w-full">
        <div className="flex-1 space-y-4 p-0.5 pt-6 md:p-8">
          <div className="flex items-center justify-between gap-2 scale-95 md:scale-100 origin-left">
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