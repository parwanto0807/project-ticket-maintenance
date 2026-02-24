"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyQtt } from "@/lib/utils";

export interface MonthlyHistoryRow {
  /** e.g. "Februari 2026" */
  monthLabel: string;
  year: number;
  month: number;
  totalBookValue: number;
  totalAccumulatedDepreciation: number;
  monthlyExpense: number;
}

interface OverviewMonthlyHistoryProps {
  rows: MonthlyHistoryRow[];
}

export function OverviewMonthlyHistory({ rows }: OverviewMonthlyHistoryProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-zinc-950/80 p-8 text-center">
        <p className="text-muted-foreground">Belum ada data riwayat bulanan.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/80 dark:bg-zinc-950/80 shadow-md">
      <div className="px-4 py-3 border-b bg-slate-50/80 dark:bg-slate-900/50">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">
          Riwayat Bulanan (12 bulan terakhir)
        </h4>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 dark:bg-slate-900/50">
            <TableHead className="font-semibold">Bulan</TableHead>
            <TableHead className="font-semibold text-right">
              Total Nilai Buku (Akhir Bulan)
            </TableHead>
            <TableHead className="font-semibold text-right">
              Akum. Depresiasi (Akhir Bulan)
            </TableHead>
            <TableHead className="font-semibold text-right">
              Beban Bulan Ini
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.year}-${row.month}`} className="hover:bg-muted/50">
              <TableCell className="font-medium">{row.monthLabel}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyQtt(row.totalBookValue)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400">
                {formatCurrencyQtt(row.totalAccumulatedDepreciation)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrencyQtt(row.monthlyExpense)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
