import Link from "next/link";
import { Suspense } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import { PageAnimate } from "@/components/dashboard/master/product/client-wrapper";
import { Inter, Source_Code_Pro } from "next/font/google";
import { cn } from "@/lib/utils";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { fetchAssetListPages } from "@/data/asset/asset";
import AssetTable from "@/components/asset-management/asset/tabel";
import { CreateAssetButton } from "@/components/asset-management/asset/buttons";
import { SkeletonAssetTable } from "@/components/asset-management/asset/skeletons";

const fontInter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const fontMono = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-source-code-pro",
});

const TableSection = async ({
  query,
  currentPage,
  filters
}: {
  query: string;
  currentPage: number;
  filters: any
}) => {
  const totalPages = await fetchAssetListPages(query || "", filters);

  return (
    <div className="space-y-6">
      <div className="w-full">
        <AssetTable
          query={query}
          currentPage={currentPage}
          {...filters}
        />
      </div>

      <div className="flex justify-center mt-6 pb-10">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

const AssetListPage = async ({
  searchParams
}: {
  searchParams: {
    query?: string;
    page?: string;
    assetType?: string;
    userName?: string;
    department?: string;
    status?: string;
    location?: string;
    software?: string;
  };
}) => {
  const {
    query = "",
    page,
    assetType,
    userName,
    department,
    status,
    location,
    software
  } = searchParams || { query: "", page: "1" };

  const currentPage = Number(page) || 1;

  const filters = {
    assetType,
    userName,
    department,
    status,
    location,
    software,
  };

  return (
    <ContentLayout title="Asset Management">
      <div className={cn("flex flex-col min-h-full font-inter", fontInter.variable, fontMono.variable)}>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard" className="hover:text-blue-600 transition-colors text-sm">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/asset" className="hover:text-blue-600 transition-colors text-sm">Asset</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-blue-600 dark:text-blue-400 text-sm">Asset List</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page title & subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Daftar Aset
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Kelola dan pantau semua aset perusahaan.
            </p>
          </div>

          <PageAnimate>
            <div className="space-y-6">
              {/* Pencarian */}
              <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm p-4 sm:p-5">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Pencarian</h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="w-full sm:max-w-md">
                    <Search placeholder="Cari nama aset, kode, atau serial..." />
                  </div>
                  <CreateAssetButton />
                </div>
              </section>

              <Suspense fallback={<SkeletonAssetTable />}>
                <TableSection
                  query={query}
                  currentPage={currentPage}
                  filters={filters}
                />
              </Suspense>
            </div>
          </PageAnimate>
        </div>
      </div>
    </ContentLayout>
  );
};

export default AssetListPage;
