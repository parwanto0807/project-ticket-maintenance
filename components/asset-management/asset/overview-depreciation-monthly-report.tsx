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
import Link from "next/link";

export interface AssetMonthlyExpenseItem {
  id: string;
  assetNumber: string;
  productName: string;
  departmentName: string | null;
  monthlyExpense: number;
}

interface OverviewDepreciationMonthlyReportProps {
  /** Label bulan, e.g. "Februari 2026" */
  monthLabel: string;
  items: AssetMonthlyExpenseItem[];
  totalExpense: number;
}

export function OverviewDepreciationMonthlyReport({
  monthLabel,
  items,
  totalExpense,
}: OverviewDepreciationMonthlyReportProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-zinc-950/80 p-8 text-center">
        <p className="text-muted-foreground">
          Tidak ada beban depresiasi untuk bulan {monthLabel}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/80 dark:bg-zinc-950/80 shadow-md">
      <div className="px-4 py-3 border-b bg-slate-50/80 dark:bg-slate-900/50">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">
          Laporan Depresiasi Bulan {monthLabel}
        </h4>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 dark:bg-slate-900/50">
            <TableHead className="font-semibold">No. Aset</TableHead>
            <TableHead className="font-semibold">Produk / Nama</TableHead>
            <TableHead className="font-semibold">Departemen</TableHead>
            <TableHead className="font-semibold text-right">
              Beban Depresiasi Bulan Ini
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/asset/asset-list/edit/${row.id}`}
                  className="text-primary hover:underline"
                >
                  {row.assetNumber}
                </Link>
              </TableCell>
              <TableCell>{row.productName}</TableCell>
              <TableCell className="text-muted-foreground">
                {row.departmentName || "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400">
                {formatCurrencyQtt(row.monthlyExpense)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-4 py-3 border-t bg-slate-50/50 dark:bg-slate-900/30 flex justify-end">
        <span className="font-semibold tabular-nums text-amber-700 dark:text-amber-300">
          Total: {formatCurrencyQtt(totalExpense)}
        </span>
      </div>
    </div>
  );
}
