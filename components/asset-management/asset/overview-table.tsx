"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyQtt } from "@/lib/utils";
import type { DepreciationResult } from "@/lib/finance";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";

export interface AssetWithDepreciation {
  id: string;
  assetNumber: string;
  status: string;
  location: string | null;
  purchaseDate: Date | string | null;
  purchaseCost: number | null;
  residualValue: number | null;
  usefulLife: number | null;
  product?: { part_name: string | null; part_number: string | null } | null;
  assetType?: { name: string } | null;
  department?: { dept_name: string | null } | null;
  employee?: { name: string | null } | null;
  depreciation: DepreciationResult;
}

interface AssetOverviewTableProps {
  assets: AssetWithDepreciation[];
}

const STATUS_CONFIG: Record<
  DepreciationResult["statusCategory"],
  { label: string; className: string }
> = {
  habis: {
    label: "Habis Masa Manfaat",
    className: "bg-red-500/90 hover:bg-red-600 text-white border-0",
  },
  kritis: {
    label: "Kritis",
    className: "bg-orange-500/90 hover:bg-orange-600 text-white border-0",
  },
  waspada: {
    label: "Waspada",
    className: "bg-amber-500/90 hover:bg-amber-600 text-white border-0",
  },
  normal: {
    label: "Aktif",
    className: "bg-emerald-500/90 hover:bg-emerald-600 text-white border-0",
  },
  data_error: {
    label: "Data Error",
    className: "bg-slate-500/90 hover:bg-slate-600 text-white border-0",
  },
};

function DepreciationStatusBadge({ dep }: { dep: DepreciationResult }) {
  const config = STATUS_CONFIG[dep.statusCategory];
  return (
    <Badge className={config.className} variant={undefined as never}>
      {config.label}
    </Badge>
  );
}

function AssetRowTooltip({ row }: { row: AssetWithDepreciation }) {
  const d = row.depreciation;
  const purchaseDateStr = row.purchaseDate
    ? formatDate(
        typeof row.purchaseDate === "string"
          ? row.purchaseDate
          : row.purchaseDate.toISOString()
      )
    : "—";
  const sisaBulan = d.isValid ? d.monthsRemaining : "—";
  const depPerBulan = d.isValid
    ? formatCurrencyQtt(d.monthlyDepreciation)
    : "—";
  const nilaiBuku = d.isValid
    ? formatCurrencyQtt(d.bookValue)
    : row.purchaseCost != null
      ? formatCurrencyQtt(row.purchaseCost)
      : "—";
  const masaManfaat =
    row.usefulLife != null ? `${row.usefulLife} bulan` : "—";
  const konsisten = d.isValid
    ? "✅ Data konsisten"
    : "⚠️ Perlu validasi (data tidak lengkap)";

  return (
    <div className="text-left space-y-1 max-w-xs">
      <div className="font-semibold border-b pb-1">{row.assetNumber}</div>
      <div className="text-xs space-y-0.5">
        <p>Tanggal Beli: {purchaseDateStr}</p>
        <p>Masa Manfaat: {masaManfaat}</p>
        <p>
          Sisa Bulan:{" "}
          {typeof sisaBulan === "number"
            ? `${sisaBulan} bulan${sisaBulan < 0 ? ` (lewat ${-sisaBulan} bulan)` : ""}`
            : sisaBulan}
        </p>
        <p>Depresiasi/Bulan: {depPerBulan}</p>
        <p>Nilai Buku: {nilaiBuku}</p>
        <p>{konsisten}</p>
      </div>
    </div>
  );
}

export function AssetOverviewTable({ assets }: AssetOverviewTableProps) {
  if (!assets.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-12 text-center">
        <p className="text-muted-foreground font-medium">
          Belum ada data aset untuk ditampilkan.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Ubah filter atau tambah aset dari Asset List.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
              <TableHead className="font-semibold">No. Aset</TableHead>
              <TableHead className="font-semibold">Produk / Nama</TableHead>
              <TableHead className="font-semibold">Departemen</TableHead>
              <TableHead className="font-semibold text-right">Harga Beli</TableHead>
              <TableHead className="font-semibold text-right">Nilai Buku</TableHead>
              <TableHead className="font-semibold text-right">Akum. Depresiasi</TableHead>
              <TableHead className="font-semibold text-right">% Sisa</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block">
                        <Link
                          href={`/dashboard/asset/asset-list/edit/${row.id}`}
                          className="text-primary hover:underline"
                        >
                          {row.assetNumber}
                        </Link>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-zinc-900 text-zinc-100 border-0 p-3"
                    >
                      <AssetRowTooltip row={row} />
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {row.product?.part_name || row.product?.part_number || "—"}
                    </div>
                    {row.assetType?.name && (
                      <div className="text-xs text-muted-foreground">
                        {row.assetType.name}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.department?.dept_name || "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.purchaseCost != null
                    ? formatCurrencyQtt(row.purchaseCost)
                    : "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.depreciation.isValid
                    ? formatCurrencyQtt(row.depreciation.bookValue)
                    : row.purchaseCost != null
                      ? formatCurrencyQtt(row.purchaseCost)
                      : "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400">
                  {row.depreciation.isValid
                    ? formatCurrencyQtt(
                        row.depreciation.accumulatedDepreciation
                      )
                    : "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.depreciation.isValid
                    ? `${row.depreciation.percentRemaining.toFixed(1)}%`
                    : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <DepreciationStatusBadge dep={row.depreciation} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
