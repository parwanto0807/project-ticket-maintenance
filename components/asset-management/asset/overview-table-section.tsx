"use client";

import { useMemo, useState } from "react";
import { AssetOverviewTable } from "./overview-table";
import { OverviewFilters, type OverviewFiltersState } from "./overview-filters";
import type { AssetWithDepreciation } from "./overview-table";
import type { DepreciationResult } from "@/lib/finance";

const DEFAULT_FILTERS: OverviewFiltersState = {
  search: "",
  status: "all",
  department: "all",
  sort: "assetNumber",
  hideExpired: false,
};

const STATUS_ORDER: DepreciationResult["statusCategory"][] = [
  "data_error",
  "habis",
  "kritis",
  "waspada",
  "normal",
];

function filterAndSortAssets(
  assets: AssetWithDepreciation[],
  filters: OverviewFiltersState
): AssetWithDepreciation[] {
  const searchLower = filters.search.trim().toLowerCase();
  let list = assets.filter((a) => {
    if (filters.hideExpired && a.depreciation.statusCategory === "habis") return false;
    if (filters.status !== "all") {
      const cat = a.depreciation.statusCategory;
      if (filters.status === "aktif" && cat !== "normal") return false;
      if (filters.status === "habis" && cat !== "habis") return false;
      if (filters.status === "akan_habis" && cat !== "kritis" && cat !== "waspada") return false;
      if (filters.status === "bermasalah" && cat !== "data_error") return false;
    }
    if (filters.department !== "all" && (a.department?.dept_name || "—") !== filters.department) return false;
    if (searchLower) {
      const an = (a.assetNumber || "").toLowerCase();
      const pn = (a.product?.part_name || "").toLowerCase();
      const pnum = (a.product?.part_number || "").toLowerCase();
      if (!an.includes(searchLower) && !pn.includes(searchLower) && !pnum.includes(searchLower)) return false;
    }
    return true;
  });

  const sort = filters.sort;
  list = [...list].sort((a, b) => {
    if (sort === "assetNumber") {
      return (a.assetNumber || "").localeCompare(b.assetNumber || "");
    }
    if (sort === "bookValue") {
      const va = a.depreciation.isValid ? a.depreciation.bookValue : a.purchaseCost ?? 0;
      const vb = b.depreciation.isValid ? b.depreciation.bookValue : b.purchaseCost ?? 0;
      return va - vb;
    }
    if (sort === "percentRemaining") {
      const pa = a.depreciation.percentRemaining;
      const pb = b.depreciation.percentRemaining;
      return pa - pb;
    }
    if (sort === "status") {
      const ia = STATUS_ORDER.indexOf(a.depreciation.statusCategory);
      const ib = STATUS_ORDER.indexOf(b.depreciation.statusCategory);
      return ia - ib;
    }
    return 0;
  });

  return list;
}

interface OverviewTableSectionProps {
  assets: AssetWithDepreciation[];
  departments: string[];
}

export function OverviewTableSection({ assets, departments }: OverviewTableSectionProps) {
  const [filters, setFilters] = useState<OverviewFiltersState>(DEFAULT_FILTERS);

  const filtered = useMemo(
    () => filterAndSortAssets(assets, filters),
    [assets, filters]
  );

  return (
    <div className="space-y-4">
      <OverviewFilters
        filters={filters}
        onFiltersChange={setFilters}
        departments={departments}
      />
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hideExpired}
            onChange={(e) =>
              setFilters({ ...filters, hideExpired: e.target.checked })
            }
            className="rounded border-input"
          />
          Sembunyikan aset habis masa manfaat
        </label>
      </div>
      <AssetOverviewTable assets={filtered} />
      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Menampilkan {filtered.length} dari {assets.length} aset
        </p>
      )}
    </div>
  );
}
