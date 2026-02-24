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

const BULAN_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function getMonthLabel(year: number, month: number): string {
  return `${BULAN_NAMES[month - 1]} ${year}`;
}

export default async function AssetOverviewPage({
  searchParams = {},
}: {
  searchParams?: { bulan?: string; tahun?: string };
}) {
  const now = new Date();
  const bulan = Math.min(12, Math.max(1, parseInt(searchParams.bulan ?? String(now.getMonth() + 1), 10) || now.getMonth() + 1));
  const tahun = parseInt(searchParams.tahun ?? String(now.getFullYear()), 10) || now.getFullYear();

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

  const reportDate = `sampai akhir ${getMonthLabel(tahun, bulan)}`;

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
  const historyRows: MonthlyHistoryRow[] = [];
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
      monthLabel: getMonthLabel(y, m),
      year: y,
      month: m,
      totalBookValue: totalBook,
      totalAccumulatedDepreciation: totalAccum,
      monthlyExpense: expense,
    });
  }
  historyRows.reverse();

  const monthLabel = getMonthLabel(tahun, bulan);

  return (
    <ContentLayout title="Asset Overview">
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
              <Link href="/dashboard/asset/asset-list">Asset Management</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Asset Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6 mt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Asset Overview
          </h2>
          <p className="mt-1 text-muted-foreground">
            Ringkasan aset, nilai buku, dan depresiasi — termasuk detail per bulan.
          </p>
        </div>

        <Suspense fallback={<div className="h-10" />}>
          <OverviewPeriodFilter bulan={bulan} tahun={tahun} />
        </Suspense>

        <AssetOverviewStatsCards stats={stats} reportDate={reportDate} />

        <OverviewMonthlyExpenseCard
          monthLabel={monthLabel}
          totalExpense={totalMonthlyExpense}
        />

        <div>
          <h3 className="text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-200">
            Ringkasan Depresiasi Aset ({reportDate})
          </h3>
          <OverviewTableSection
            assets={assetsWithDepreciation}
            departments={departments}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-200">
            Laporan Depresiasi Bulan Ini
          </h3>
          <OverviewDepreciationMonthlyReport
            monthLabel={monthLabel}
            items={monthlyReportItems}
            totalExpense={totalMonthlyExpense}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-200">
            Riwayat Bulanan
          </h3>
          <OverviewMonthlyHistory rows={historyRows} />
        </div>
      </div>
    </ContentLayout>
  );
}
