"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import { FetchPriceAllPages, FetchPriceAll } from "@/data/master/price";
import Pagination from "@/components/ui/pagination";
import PriceTable from "@/components/dashboard/master/product-price/table";
import { CreatePrice } from "@/components/dashboard/master/product-price/buttons";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { Tag } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import React, { useEffect, useState } from "react";

const PricePage = ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const { t } = useTranslation();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams?.query || "";
  const page = searchParams?.page || "1";
  const currentPage = Number(page) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pages, priceData] = await Promise.all([
          FetchPriceAllPages(query || ""),
          FetchPriceAll(query, currentPage)
        ]);
        setTotalPages(pages);
        setPrices(priceData);
      } catch (error) {
        console.error("Error fetching price data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, currentPage]);

  return (
    <ContentLayout title="harga_produk">
      <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
        <MasterPageHeader
          titleKey="harga_produk"
          descKey="harga_produk_desc"
          icon={Tag}
          breadcrumbKeys={[
            { labelKey: "dashboard", href: "/dashboard" },
            { labelKey: "master", href: "/dashboard/master/products" },
            { labelKey: "harga_produk" }
          ]}
        />
        <div className="h-full">
          <div className="flex-1 space-y-4 p-0.5 pt-6 md:p-8">
            <div className="flex items-center justify-between gap-2">
              <Search placeholder={t("search_price_placeholder")} />
              <CreatePrice />
            </div>

            <div className="w-full">
              <PriceTable prices={prices} loading={loading} currentPage={currentPage} />
            </div>

            <div className="flex justify-center mt-4">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default PricePage;