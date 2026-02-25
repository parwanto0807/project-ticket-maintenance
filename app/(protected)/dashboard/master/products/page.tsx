"use client";

import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search"
import { fetchProductPages, fetchProductOverviewStats, fetchProducts } from "@/data/master/products";
import Pagination from "@/components/ui/pagination";
import ProductsTable from "@/components/dashboard/master/product/tabel";
import { CreateProduct } from "@/components/dashboard/master/product/buttons";
import { ProductStatsCards } from "@/components/dashboard/master/product/stats-cards";
import { PageAnimate } from "@/components/dashboard/master/product/client-wrapper";
import { PackageSearch } from "lucide-react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const ProductsPage = ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams?.query || "";
  const page = searchParams?.page || "1";
  const currentPage = Number(page) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pages, overviewStats, productsData] = await Promise.all([
          fetchProductPages(query || ""),
          fetchProductOverviewStats(),
          fetchProducts(query, currentPage)
        ]);
        setTotalPages(pages);
        setStats(overviewStats);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, currentPage]);

  return (
    <ContentLayout title="produk">
      <div className={cn("flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 md:p-8 min-h-full", font.className)}>
        <MasterPageHeader
          titleKey="produk"
          descKey="products_description"
          icon={PackageSearch}
          breadcrumbKeys={[
            { labelKey: "dashboard", href: "/dashboard" },
            { labelKey: "master", href: "/dashboard" },
            { labelKey: "produk" }
          ]}
        />

        <PageAnimate>
          <div className="space-y-4 sm:space-y-8">
            {/* Stats Section */}
            {stats && <ProductStatsCards stats={stats} />}

            {/* Action Bar & Table Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex-1 max-w-md">
                  <Search placeholder="Quick find product..." />
                </div>
                <CreateProduct />
              </div>

              <div className="w-full">
                <ProductsTable products={products} loading={loading} />
              </div>

              <div className="flex justify-center mt-6 sm:mt-8 pb-10">
                <Pagination totalPages={totalPages} />
              </div>
            </div>
          </div>
        </PageAnimate>
      </div>
    </ContentLayout>
  );
};

export default ProductsPage;