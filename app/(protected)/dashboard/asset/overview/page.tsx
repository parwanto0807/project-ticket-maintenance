import { Suspense } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { fetchAllAssetsGeneral } from "@/data/asset/asset";
import {
  calculateAssetDepreciationAsOf,
  getEndOfMonth,
  getMonthlyDepreciationExpense,
} from "@/lib/finance";
import { AssetOverviewStatsCards } from "@/components/asset-management/asset/overview-stats-cards";
import { type AssetWithDepreciation } from "@/components/asset-management/asset/overview-table";
import { OverviewTableSection } from "@/components/asset-management/asset/overview-table-section";
import { OverviewPeriodFilter } from "@/components/asset-management/asset/overview-period-filter";
import { OverviewMonthlyExpenseCard } from "@/components/asset-management/asset/overview-monthly-expense-card";
import {
  OverviewDepreciationMonthlyReport,
  type AssetMonthlyExpenseItem,
} from "@/components/asset-management/asset/overview-depreciation-monthly-report";
import {
  OverviewMonthlyHistory,
  type MonthlyHistoryRow,
} from "@/components/asset-management/asset/overview-monthly-history";

import { LocalizedAssetOverview } from "@/components/asset-management/asset/localized-asset-overview";

export default async function AssetOverviewPage({
  searchParams = {},
}: {
  searchParams?: { bulan?: string; tahun?: string };
}) {
  const params = await searchParams;
  const now = new Date();
  const bulan = Math.min(12, Math.max(1, parseInt(params.bulan ?? String(now.getMonth() + 1), 10) || now.getMonth() + 1));
  const tahun = parseInt(params.tahun ?? String(now.getFullYear()), 10) || now.getFullYear();

  const asOfDate = getEndOfMonth(tahun, bulan);

  const data = await fetchAllAssetsGeneral();
  const assetsRaw = Array.isArray(data) ? data : [];

  const assetsWithDepreciation: AssetWithDepreciation[] = assetsRaw.map(
    (asset) => {
      const dep = calculateAssetDepreciationAsOf(
        asset.purchaseCost,
        asset.purchaseDate,
        asset.usefulLife ?? undefined,
        asset.residualValue,
        asOfDate
      );
      return {
        id: asset.id,
        assetNumber: asset.assetNumber,
        status: asset.status,
        location: asset.location,
        purchaseDate: asset.purchaseDate,
        purchaseCost: asset.purchaseCost,
        residualValue: asset.residualValue,
        usefulLife: asset.usefulLife,
        product: asset.product
          ? {
            part_name: asset.product.part_name,
            part_number: asset.product.part_number,
          }
          : null,
        assetType: asset.assetType ? { name: asset.assetType.name } : null,
        department: asset.department
          ? { dept_name: asset.department.dept_name }
          : null,
        employee: asset.employee ? { name: asset.employee.name } : null,
        depreciation: dep,
      };
    }
  );

  const stats = {
    totalAssets: assetsWithDepreciation.length,
    totalBookValue: assetsWithDepreciation.reduce(
      (sum, a) =>
        sum +
        (a.depreciation.isValid
          ? a.depreciation.bookValue
          : a.purchaseCost ?? 0),
      0
    ),
    totalAccumulatedDepreciation: assetsWithDepreciation.reduce(
      (sum, a) => sum + a.depreciation.accumulatedDepreciation,
      0
    ),
    totalPurchaseCost: assetsWithDepreciation.reduce(
      (sum, a) => sum + (a.purchaseCost ?? 0),
      0
    ),
    expired: assetsWithDepreciation.filter(
      (a) => a.depreciation.statusCategory === "habis"
    ).length,
    kritis: assetsWithDepreciation.filter(
      (a) => a.depreciation.statusCategory === "kritis"
    ).length,
    waspada: assetsWithDepreciation.filter(
      (a) => a.depreciation.statusCategory === "waspada"
    ).length,
    normal: assetsWithDepreciation.filter(
      (a) => a.depreciation.statusCategory === "normal"
    ).length,
    dataError: assetsWithDepreciation.filter(
      (a) => a.depreciation.statusCategory === "data_error"
    ).length,
  };

  const departments = [
    ...new Set(
      assetsWithDepreciation
        .map((a) => a.department?.dept_name)
        .filter((d): d is string => !!d)
    ),
  ].sort();

  // 1. Beban depresiasi per bulan (periode terpilih)
  const totalMonthlyExpense = assetsRaw.reduce(
    (sum, asset) =>
      sum +
      getMonthlyDepreciationExpense(
        asset.purchaseCost,
        asset.purchaseDate,
        asset.usefulLife ?? undefined,
        asset.residualValue,
        tahun,
        bulan
      ),
    0
  );

  // 4. Laporan depresiasi bulan ini: daftar aset + beban bulan ini
  const monthlyReportItems: AssetMonthlyExpenseItem[] = assetsRaw
    .map((asset) => {
      const expense = getMonthlyDepreciationExpense(
        asset.purchaseCost,
        asset.purchaseDate,
        asset.usefulLife ?? undefined,
        asset.residualValue,
        tahun,
        bulan
      );
      return {
        id: asset.id,
        assetNumber: asset.assetNumber,
        productName:
          asset.product?.part_name || asset.product?.part_number || "—",
        departmentName: asset.department?.dept_name ?? null,
        monthlyExpense: expense,
      };
    })
    .filter((r) => r.monthlyExpense > 0)
    .sort((a, b) => b.monthlyExpense - a.monthlyExpense);

  // 2. Riwayat bulanan: 12 bulan terakhir
  const historyRows: any[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(tahun, bulan - 1 - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const endOf = getEndOfMonth(y, m);
    let totalBook = 0;
    let totalAccum = 0;
    let expense = 0;
    assetsRaw.forEach((asset) => {
      const dep = calculateAssetDepreciationAsOf(
        asset.purchaseCost,
        asset.purchaseDate,
        asset.usefulLife ?? undefined,
        asset.residualValue,
        endOf
      );
      totalBook += dep.isValid ? dep.bookValue : asset.purchaseCost ?? 0;
      totalAccum += dep.accumulatedDepreciation;
      expense += getMonthlyDepreciationExpense(
        asset.purchaseCost,
        asset.purchaseDate,
        asset.usefulLife ?? undefined,
        asset.residualValue,
        y,
        m
      );
    });
    historyRows.push({
      year: y,
      month: m,
      totalBookValue: totalBook,
      totalAccumulatedDepreciation: totalAccum,
      monthlyExpense: expense,
    });
  }
  historyRows.reverse();

  return (
    <ContentLayout title="asset_overview">
      <div className="p-4 sm:p-6 lg:p-8">
        <LocalizedAssetOverview
          bulan={bulan}
          tahun={tahun}
          stats={stats}
          totalMonthlyExpense={totalMonthlyExpense}
          monthlyReportItems={monthlyReportItems}
          historyRows={historyRows}
          assetsWithDepreciation={assetsWithDepreciation}
          departments={departments}
        />
      </div>
    </ContentLayout>
  );
}
