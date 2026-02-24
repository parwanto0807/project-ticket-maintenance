"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrencyQtt } from "@/lib/utils";
import { BarChart3, AlertTriangle } from "lucide-react";

export interface AssetOverviewStats {
  totalAssets: number;
  totalBookValue: number;
  totalAccumulatedDepreciation: number;
  totalPurchaseCost: number;
  expired: number;
  kritis: number;
  waspada: number;
  normal: number;
  dataError: number;
}

interface AssetOverviewStatsCardsProps {
  stats: AssetOverviewStats;
  /** Tanggal laporan, format: "24 Februari 2026" */
  reportDate: string;
}

export function AssetOverviewStatsCards({
  stats,
  reportDate,
}: AssetOverviewStatsCardsProps) {
  const totalCost = stats.totalPurchaseCost || 1;
  const pctDepreciated =
    totalCost > 0
      ? Math.round((stats.totalAccumulatedDepreciation / totalCost) * 1000) / 10
      : 0;
  const pctBookValue =
    totalCost > 0
      ? Math.round((stats.totalBookValue / totalCost) * 1000) / 10
      : 0;
  const akanHabis6Bulan = stats.kritis + stats.waspada;
  const masihAktif = stats.normal;
  const pctHabis =
    stats.totalAssets > 0
      ? Math.round((stats.expired / stats.totalAssets) * 100)
      : 0;
  const pctAkanHabis =
    stats.totalAssets > 0
      ? Math.round((akanHabis6Bulan / stats.totalAssets) * 100)
      : 0;
  const pctAktif =
    stats.totalAssets > 0
      ? Math.round((masihAktif / stats.totalAssets) * 100)
      : 0;

  return (
    <Card className="overflow-hidden border-2 border-slate-200/80 dark:border-slate-800 shadow-lg bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <CardHeader className="pb-2 pt-5 px-6 border-b bg-slate-50/80 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            RINGKASAN ASET per {reportDate}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Aset</span>
            <span className="font-semibold tabular-nums">{stats.totalAssets}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Harga Beli</span>
            <span className="font-semibold tabular-nums">
              {formatCurrencyQtt(stats.totalPurchaseCost)}
            </span>
          </div>
          <div className="flex justify-between sm:col-span-2">
            <span className="text-muted-foreground">Akumulasi Depresiasi</span>
            <span className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {formatCurrencyQtt(stats.totalAccumulatedDepreciation)}{" "}
              <span className="text-muted-foreground font-normal">
                ({pctDepreciated}%)
              </span>
            </span>
          </div>
          <div className="flex justify-between sm:col-span-2">
            <span className="text-muted-foreground">Nilai Buku Saat Ini</span>
            <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatCurrencyQtt(stats.totalBookValue)}{" "}
              <span className="text-muted-foreground font-normal">
                ({pctBookValue}%)
              </span>
            </span>
          </div>
        </div>

        {/* Progress bar: Nilai buku vs terdepresiasi */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-medium text-muted-foreground">
            Nilai Buku Tersisa: {formatCurrencyQtt(stats.totalBookValue)} (
            {pctBookValue}%)
          </p>
          <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="absolute inset-y-0 left-0 bg-emerald-500 dark:bg-emerald-600 transition-all"
              style={{ width: `${pctBookValue}%` }}
            />
            <div
              className="absolute inset-y-0 bg-amber-500/80 dark:bg-amber-600/80 transition-all"
              style={{
                left: `${pctBookValue}%`,
                width: `${pctDepreciated}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Terdepresiasi: {formatCurrencyQtt(stats.totalAccumulatedDepreciation)}{" "}
            ({pctDepreciated}%)
          </p>
        </div>

        {/* Perlu Perhatian */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Perlu Perhatian
          </div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="text-red-500" aria-hidden>🔴</span>
                Habis Masa Manfaat
              </span>
              <span className="tabular-nums font-medium">
                {stats.expired} aset ({pctHabis}%)
              </span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="text-amber-500" aria-hidden>🟡</span>
                Akan Habis dalam 6 Bulan
              </span>
              <span className="tabular-nums font-medium">
                {akanHabis6Bulan} aset ({pctAkanHabis}%)
              </span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="text-emerald-500" aria-hidden>🟢</span>
                Masih Aktif
              </span>
              <span className="tabular-nums font-medium">
                {masihAktif} aset ({pctAktif}%)
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
