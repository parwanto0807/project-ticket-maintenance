"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export type OverviewStatusFilter =
  | "all"
  | "aktif"
  | "habis"
  | "akan_habis"
  | "bermasalah";

export type OverviewSortOption =
  | "assetNumber"
  | "bookValue"
  | "percentRemaining"
  | "status";

export interface OverviewFiltersState {
  search: string;
  status: OverviewStatusFilter;
  department: string;
  sort: OverviewSortOption;
  hideExpired: boolean;
}

interface OverviewFiltersProps {
  filters: OverviewFiltersState;
  onFiltersChange: (f: OverviewFiltersState) => void;
  departments: string[];
}

export function OverviewFilters({
  filters,
  onFiltersChange,
  departments,
}: OverviewFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[180px]">
        <Label className="text-xs text-muted-foreground">Cari Aset</Label>
        <div className="relative mt-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="No. aset, nama produk..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-8 h-9"
          />
        </div>
      </div>
      <div className="w-[180px]">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, status: v as OverviewStatusFilter })
          }
        >
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="aktif">Aktif</SelectItem>
            <SelectItem value="habis">Habis Masa Manfaat</SelectItem>
            <SelectItem value="akan_habis">Akan Habis dalam 6 Bulan</SelectItem>
            <SelectItem value="bermasalah">Bermasalah (data inkonsisten)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-[180px]">
        <Label className="text-xs text-muted-foreground">Departemen</Label>
        <Select
          value={filters.department}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, department: v })
          }
        >
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Semua Departemen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Departemen</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-[160px]">
        <Label className="text-xs text-muted-foreground">Urutkan</Label>
        <Select
          value={filters.sort}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, sort: v as OverviewSortOption })
          }
        >
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="assetNumber">No. Aset</SelectItem>
            <SelectItem value="bookValue">Nilai Buku</SelectItem>
            <SelectItem value="percentRemaining">% Sisa</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
