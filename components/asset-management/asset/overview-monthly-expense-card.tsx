"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrencyQtt } from "@/lib/utils";
import { TrendingDown } from "lucide-react";

interface OverviewMonthlyExpenseCardProps {
  /** Label bulan, e.g. "Februari 2026" */
  monthLabel: string;
  /** Total beban depresiasi untuk bulan tersebut */
  totalExpense: number;
}

export function OverviewMonthlyExpenseCard({
  monthLabel,
  totalExpense,
}: OverviewMonthlyExpenseCardProps) {
  return (
    <Card className="border-2 border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            Beban Depresiasi per Bulan
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-sm text-muted-foreground mb-1">
          Bulan {monthLabel}
        </p>
        <p className="text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-300">
          {formatCurrencyQtt(totalExpense)}
        </p>
      </CardContent>
    </Card>
  );
}
