"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

const BULAN: { value: string; label: string }[] = [
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Maret" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Juni" },
  { value: "7", label: "Juli" },
  { value: "8", label: "Agustus" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

interface OverviewPeriodFilterProps {
  /** Current month 1-12 */
  bulan: number;
  /** Current year */
  tahun: number;
}

export function OverviewPeriodFilter({ bulan, tahun }: OverviewPeriodFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updatePeriod(newBulan: number, newTahun: number) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("bulan", String(newBulan));
    p.set("tahun", String(newTahun));
    router.push(`/dashboard/asset/overview?${p.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Label className="text-sm font-medium text-muted-foreground">
          Periode (data sampai akhir bulan):
        </Label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Select
          value={String(bulan)}
          onValueChange={(v) => updatePeriod(Number(v), tahun)}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BULAN.map((b) => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(tahun)}
          onValueChange={(v) => updatePeriod(bulan, Number(v))}
        >
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(
              (y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
