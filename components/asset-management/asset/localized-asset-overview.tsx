"use client";

import { useTranslation } from "@/hooks/use-translation";
import { TranslationKeys } from "@/lib/translations";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { LayoutDashboard } from "lucide-react";
import { Suspense } from "react";
import { OverviewPeriodFilter } from "@/components/asset-management/asset/overview-period-filter";
import { AssetOverviewStatsCards } from "@/components/asset-management/asset/overview-stats-cards";
import { OverviewMonthlyExpenseCard } from "@/components/asset-management/asset/overview-monthly-expense-card";
import { OverviewTableSection } from "@/components/asset-management/asset/overview-table-section";
import { OverviewDepreciationMonthlyReport } from "@/components/asset-management/asset/overview-depreciation-monthly-report";
import { OverviewMonthlyHistory } from "@/components/asset-management/asset/overview-monthly-history";

interface LocalizedAssetOverviewProps {
    bulan: number;
    tahun: number;
    stats: any;
    totalMonthlyExpense: number;
    monthlyReportItems: any[];
    historyRows: any[];
    assetsWithDepreciation: any[];
    departments: string[];
}

export function LocalizedAssetOverview({
    bulan,
    tahun,
    stats,
    totalMonthlyExpense,
    monthlyReportItems,
    historyRows,
    assetsWithDepreciation,
    departments
}: LocalizedAssetOverviewProps) {
    const { t } = useTranslation();

    const getMonthName = (m: number) => {
        const monthKeys: TranslationKeys[] = [
            "januari", "februari", "maret", "april", "mei", "juni",
            "juli", "agustus", "september", "oktober", "november", "desember"
        ];
        return t(monthKeys[m - 1]);
    };

    const monthLabel = `${getMonthName(bulan)} ${tahun}`;
    const reportDate = `${t("sampai_akhir")} ${monthLabel}`;

    // Localize history labels
    const localizedHistoryRows = historyRows.map(row => ({
        ...row,
        monthLabel: `${getMonthName(row.month)} ${row.year}`
    }));

    return (
        <div className="space-y-6">
            <MasterPageHeader
                titleKey="asset_overview"
                descKey="asset_overview_desc"
                icon={LayoutDashboard}
                breadcrumbKeys={[
                    { labelKey: "dashboard", href: "/dashboard" },
                    { labelKey: "aset", href: "/dashboard/asset/asset-list" },
                    { labelKey: "asset_overview" }
                ]}
            />

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
                    {t("depreciation_summary")} ({reportDate})
                </h3>
                <OverviewTableSection
                    assets={assetsWithDepreciation}
                    departments={departments}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-200">
                    {t("monthly_depreciation_report")}
                </h3>
                <OverviewDepreciationMonthlyReport
                    monthLabel={monthLabel}
                    items={monthlyReportItems}
                    totalExpense={totalMonthlyExpense}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3 text-zinc-800 dark:text-zinc-200">
                    {t("monthly_history")}
                </h3>
                <OverviewMonthlyHistory rows={localizedHistoryRows} />
            </div>
        </div>
    );
}
