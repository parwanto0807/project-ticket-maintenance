"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import AssetUserTable from "@/components/asset-management/asset/tabel-user";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { Package } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import React, { useEffect, useState } from "react";

const AssetList = ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const { t } = useTranslation();

  const { query = "", page } = searchParams || { query: "", page: "1" };
  const currentPage = Number(page) || 1;

  return (
    <ContentLayout title="daftar_aset">
      <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
        <MasterPageHeader
          titleKey="daftar_aset"
          descKey="asset_list_desc"
          icon={Package}
          breadcrumbKeys={[
            { labelKey: "dashboard", href: "/dashboard" },
            { labelKey: "aset", href: "/dashboard/asset" },
            { labelKey: "daftar_aset" }
          ]}
        />
        <div className="h-full w-full">
          <div className="flex-1 space-y-4 p-0.5 pt-6 md:p-8">
            <div className="flex items-center justify-between gap-2 scale-95 md:scale-100 origin-left">
              <Search placeholder={t("search_asset_placeholder")} />
            </div>

            <div className="w-full">
              <AssetUserTable query={query} currentPage={currentPage} />
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default AssetList;