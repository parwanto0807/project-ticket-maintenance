"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Wrench,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    Info,
    User
} from "lucide-react";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toggleMaintenanceSchedule, deleteMaintenanceSchedule } from "@/action/maintenance/planner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/utils";
import Pagination from "@/components/ui/pagination";

import { MaintenanceScheduleDialog } from "./schedule-dialog";

const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export function MaintenancePlannerGrid({ initialData, currentYear, technicians, totalPages }: {
    initialData: any[],
    currentYear: number,
    technicians: any[],
    totalPages: number
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Dialog State
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<{ id: string, name: string, number: string } | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    const handleYearChange = (newYear: number) => {
        router.push(`/dashboard/technician/planner?year=${newYear}`);
    };

    const onCellClick = (asset: any, monthIndex: number) => {
        const monthTicket = asset.tickets.find((t: any) => {
            const d = new Date(t.scheduledDate);
            return d.getMonth() === monthIndex;
        });

        setSelectedAsset({
            id: asset.id,
            name: asset.product.part_name,
            number: asset.assetNumber
        });
        setSelectedMonth(monthIndex);
        setSelectedTicket(monthTicket || null);
        setDialogOpen(true);
    };

    const onConfirmSchedule = async (date: Date, technicianId?: string) => {
        if (!selectedAsset) return;

        startTransition(async () => {
            const result = await toggleMaintenanceSchedule(selectedAsset.id, date.toISOString(), technicianId === 'none' ? undefined : technicianId);
            if (result.success) {
                toast.success(result.success);
                setDialogOpen(false);
            } else {
                toast.error(result.error);
            }
        });
    };

    const onDeleteSchedule = async (ticketId: string) => {
        startTransition(async () => {
            const result = await deleteMaintenanceSchedule(ticketId);
            if (result.success) {
                toast.success(result.success);
                setDialogOpen(false);
            } else {
                toast.error(result.error);
            }
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
            case "In_Progress": return <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />;
            case "Assigned": return <Wrench className="w-3.5 h-3.5 text-blue-500" />;
            default: return <Calendar className="w-3.5 h-3.5 text-slate-300" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800";
            case "In_Progress": return "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800";
            case "Assigned": return "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800";
            case "Pending": return "bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700";
            default: return "bg-transparent border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30";
        }
    };

    return (
        <div className="space-y-6">
            {/* Maintenance Schedule Dialog */}
            {selectedAsset && selectedMonth !== null && (
                <MaintenanceScheduleDialog
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onConfirm={onConfirmSchedule}
                    onDelete={onDeleteSchedule}
                    assetName={selectedAsset.name}
                    assetNumber={selectedAsset.number}
                    monthIndex={selectedMonth}
                    year={currentYear}
                    technicians={technicians}
                    existingTicket={selectedTicket}
                    isLoading={isPending}
                />
            )}

            {/* Header Controls ... Same as before ... */}
            <Card className="border-none shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Maintenance Planner</h2>
                            <p className="text-xs text-slate-500 font-medium">Plan your preventive maintenance for {currentYear}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleYearChange(currentYear - 1)}
                            className="h-9 w-9 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="px-4 font-bold text-sm min-w-[80px] text-center">
                            {currentYear}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleYearChange(currentYear + 1)}
                            className="h-9 w-9 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Main Grid */}
            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                                <th className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 p-4 text-left border-b border-r border-slate-200 dark:border-slate-700 min-w-[280px]">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Information</span>
                                </th>
                                {months.map((month) => (
                                    <th key={month} className="p-4 text-center border-b border-slate-200 dark:border-slate-700 min-w-[100px]">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{month}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {Object.entries(
                                initialData.reduce((acc: Record<string, any[]>, asset) => {
                                    const deptName = asset.department?.dept_name || "Tanpa Departemen";
                                    if (!acc[deptName]) acc[deptName] = [];
                                    acc[deptName].push(asset);
                                    return acc;
                                }, {})
                            ).map(([deptName, assets]) => (
                                <React.Fragment key={deptName}>
                                    {/* Group Header Row */}
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-y border-slate-200 dark:border-slate-700">
                                        <td colSpan={13} className="px-4 py-2 border-r border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-4 bg-blue-600 rounded-full"></div>
                                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                                    Departemen: {deptName}
                                                </span>
                                                <Badge variant="outline" className="ml-2 text-[9px] font-bold bg-white/50 dark:bg-slate-900/50 py-0 border-slate-300">
                                                    {assets.length} Aset
                                                </Badge>
                                            </div>
                                        </td>
                                    </tr>

                                    {assets.map((asset) => (
                                        <tr key={asset.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 p-4 border-r border-slate-100 dark:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/40 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 relative shadow-sm">
                                                        {asset.assetImage1 ? (
                                                            <Image src={asset.assetImage1} alt={asset.assetNumber} fill className="object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full"><Wrench className="w-4 h-4 text-slate-300" /></div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 max-w-[180px]">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400">#{asset.assetNumber}</p>
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate opacity-70">
                                                                {asset.assetType?.name}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mt-0.5" title={asset.product.part_name}>
                                                            {asset.product.part_name}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-1 truncate">
                                                            <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate tracking-tight">
                                                                {asset.employee?.name || "No Employee"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {months.map((_, idx) => {
                                                const monthTicket = asset.tickets.find((t: any) => {
                                                    const d = new Date(t.scheduledDate);
                                                    return d.getMonth() === idx;
                                                });

                                                return (
                                                    <td key={idx} className="p-2 border-r border-slate-50/50 dark:border-slate-800/30 last:border-r-0">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        onClick={() => !isPending && onCellClick(asset, idx)}
                                                                        className={`
                                          h-12 w-full rounded-xl border-2 transition-all cursor-pointer
                                          flex flex-col items-center justify-center gap-0.5
                                          ${getStatusColor(monthTicket?.status)}
                                          ${monthTicket ? 'shadow-sm' : 'border-dashed border-slate-100 dark:border-slate-800/50'}
                                          hover:scale-[1.03] active:scale-95
                                        `}
                                                                    >
                                                                        {isPending ? (
                                                                            <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                                                                        ) : (
                                                                            <>
                                                                                {getStatusIcon(monthTicket?.status)}
                                                                                {monthTicket && (
                                                                                    <div className="flex flex-col items-center leading-none">
                                                                                        <span className={cn(
                                                                                            "font-black uppercase text-[10px]",
                                                                                            monthTicket.status === "Pending" ? "text-rose-600" : "text-slate-500"
                                                                                        )}>
                                                                                            Tgl {new Date(monthTicket.scheduledDate).getDate()}
                                                                                        </span>
                                                                                        <span className="text-[8px] font-black uppercase text-blue-600 dark:text-blue-400 mt-0.5">
                                                                                            {monthTicket.status === 'In_Progress' ? 'Proses' : monthTicket.status === 'Completed' ? 'Selesai' : 'Jadwal'}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" className="bg-slate-900 border-slate-800 text-white p-2 text-[10px] font-bold">
                                                                    {monthTicket ? (
                                                                        <div className="space-y-1">
                                                                            <p>Status: {monthTicket.status}</p>
                                                                            <p>Tanggal: {format(new Date(monthTicket.scheduledDate), "PPP", { locale: id })}</p>
                                                                            <p>Klik untuk edit atau hapus jadwal</p>
                                                                        </div>
                                                                    ) : (
                                                                        <p>Klik untuk buat jadwal pemeliharaan</p>
                                                                    )}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
                <Pagination totalPages={totalPages} />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kosong</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Terjadwal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sedang Berjalan</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selesai</span>
                </div>
                <div className="ml-auto flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Klik kotak untuk mengatur/mengubah tanggal & teknisi spesifik</span>
                </div>
            </div>
        </div>
    );
}
