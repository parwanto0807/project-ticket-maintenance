"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, User, Wrench, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Technician {
    id: string;
    name: string;
    specialization: string;
}

interface MaintenanceScheduleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: Date, technicianId?: string) => void;
    onDelete?: (ticketId: string) => void;
    assetName: string;
    assetNumber: string;
    monthIndex: number;
    year: number;
    technicians: Technician[];
    existingTicket?: {
        id: string;
        scheduledDate: Date | null;
        technicianId: string | null;
        status: string;
    };
    isLoading: boolean;
}

export function MaintenanceScheduleDialog({
    isOpen,
    onClose,
    onConfirm,
    onDelete,
    assetName,
    assetNumber,
    monthIndex,
    year,
    technicians,
    existingTicket,
    isLoading
}: MaintenanceScheduleDialogProps) {
    // Sync state with props when dialog opens or existingTicket changes
    // We use a key on the component to reset state or useEffect
    const [date, setDate] = useState<Date | undefined>(
        existingTicket?.scheduledDate ? new Date(existingTicket.scheduledDate) : new Date(year, monthIndex, 1)
    );
    const [technicianId, setTechnicianId] = useState<string | undefined>(
        existingTicket?.technicianId || "none"
    );

    // Reset local state when existingTicket changes or dialog closes/opens
    React.useEffect(() => {
        if (isOpen) {
            setDate(existingTicket?.scheduledDate ? new Date(existingTicket.scheduledDate) : new Date(year, monthIndex, 1));
            setTechnicianId(existingTicket?.technicianId || "none");
        }
    }, [isOpen, existingTicket, year, monthIndex]);

    const handleConfirm = () => {
        if (date) {
            onConfirm(date, technicianId === "none" ? undefined : technicianId);
        }
    };

    const isDeletable = existingTicket && (existingTicket.status === "Pending" || existingTicket.status === "Assigned");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] border-none shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold">
                            {existingTicket ? "Edit Jadwal Pemeliharaan" : "Atur Jadwal Pemeliharaan"}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm">
                        Menangani perawatan rutin untuk aset <span className="font-bold text-slate-900 dark:text-white">#{assetNumber}</span> ({assetName})
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Date Picker */}
                    <div className="grid gap-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Tanggal Pelaksanaan</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-12 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                                    {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    defaultMonth={date || new Date(year, monthIndex)}
                                    // Restrict to the chosen month
                                    fromDate={new Date(year, monthIndex, 1)}
                                    toDate={new Date(year, monthIndex + 1, 0)}
                                    initialFocus
                                    className="bg-white dark:bg-slate-900"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Technician Selector */}
                    <div className="grid gap-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Pilih Teknisi (Opsional)</Label>
                        <Select onValueChange={setTechnicianId} value={technicianId || "none"}>
                            <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-500" />
                                    <SelectValue placeholder="Belum ditugaskan" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="border-none shadow-2xl rounded-xl bg-white dark:bg-slate-900">
                                <SelectItem value="none" className="font-medium">Belum ditugaskan</SelectItem>
                                {technicians.map((tech) => (
                                    <SelectItem key={tech.id} value={tech.id} className="cursor-pointer">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{tech.name}</span>
                                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-tight">{tech.specialization}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-slate-400 font-medium italic">
                            * Jika teknisi dipilih, tiket akan otomatis berstatus "Assigned".
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                    {onDelete && isDeletable && (
                        <Button
                            variant="ghost"
                            onClick={() => onDelete(existingTicket.id)}
                            disabled={isLoading}
                            className="w-full sm:w-auto rounded-xl h-11 font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 mr-auto"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus Jadwal
                        </Button>
                    )}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 sm:flex-none rounded-xl h-11 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            Batal
                        </Button>
                        <Button
                            disabled={!date || isLoading}
                            onClick={handleConfirm}
                            className="flex-1 sm:flex-none rounded-xl h-11 px-8 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 text-white"
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Proses...</>
                            ) : (
                                existingTicket ? "Update Jadwal" : "Simpan Jadwal"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
