"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import { PageAnimate } from "@/components/dashboard/master/product/client-wrapper";
import { Inter, Source_Code_Pro } from "next/font/google";
import { cn } from "@/lib/utils";

import { fetchAssetListPages, fetchAssetList, fetchAllAssetsGeneral } from "@/data/asset/asset";
import AssetTable from "@/components/asset-management/asset/tabel";
import { CreateAssetButton } from "@/components/asset-management/asset/buttons";
import { SkeletonAssetTable } from "@/components/asset-management/asset/skeletons";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { List, Scan } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { AssetScanner } from "@/components/asset-management/asset/asset-scanner";

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

const AssetListPage = ({
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
  const { t } = useTranslation();
  const [totalPages, setTotalPages] = useState(0);
  const [assets, setAssets] = useState<any[]>([]);
  const [assetsGeneral, setAssetsGeneral] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams?.query || "";
  const page = searchParams?.page || "1";
  const {
    assetType,
    userName,
    department,
    status,
    location,
    software
  } = searchParams || {};

  const currentPage = Number(page) || 1;

  const filters = {
    assetType,
    userName,
    department,
    status,
    location,
    software,
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pages, assetsData, assetsGeneralData] = await Promise.all([
          fetchAssetListPages(query || "", filters),
          fetchAssetList(query, currentPage, filters),
          fetchAllAssetsGeneral()
        ]);
        setTotalPages(pages);
        setAssets(Array.isArray(assetsData) ? assetsData : []);
        setAssetsGeneral(Array.isArray(assetsGeneralData) ? assetsGeneralData : []);
      } catch (error) {
        console.error("Error fetching asset data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, currentPage, JSON.stringify(filters)]);

  return (
    <ContentLayout title="asset_list">
      <div className={cn("flex flex-col min-h-full font-inter", fontInter.variable, fontMono.variable)}>
        <div className="w-full mx-auto px-0 sm:px-6 lg:px-8 py-6 space-y-6">
          <MasterPageHeader
            titleKey="daftar_aset"
            descKey="asset_list_desc"
            icon={List}
            breadcrumbKeys={[
              { labelKey: "dashboard", href: "/dashboard" },
              { labelKey: "aset", href: "/dashboard/asset/asset-list" },
              { labelKey: "asset_overview" }
            ]}
          />

          <PageAnimate>
            <div className="space-y-6">
              {/* Pencarian */}
              <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm p-3 sm:p-5">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">{t("pencarian")}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="w-full sm:max-w-md">
                    <Search placeholder={t("search_asset_placeholder")} />
                  </div>
                  <div className="flex items-center gap-2">
                    <AssetScanner
                      trigger={
                        <Button variant="outline" className="h-10 px-4 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 transition-all font-semibold italic text-xs uppercase tracking-widest">
                          <Scan className="w-4 h-4 mr-2" />
                          Scan Asset
                        </Button>
                      }
                    />
                    <CreateAssetButton />
                  </div>
                </div>
              </section>

              <div className="space-y-6">
                <div className="w-full">
                  <AssetTable
                    assets={assets}
                    assetsGeneral={assetsGeneral}
                    loading={loading}
                    query={query}
                    currentPage={currentPage}
                    {...filters}
                  />
                </div>

                <div className="flex justify-center mt-6 pb-10">
                  <Pagination totalPages={totalPages} />
                </div>
              </div>
            </div>
          </PageAnimate>
        </div>
      </div>
    </ContentLayout>
  );
};

export default AssetListPage;
