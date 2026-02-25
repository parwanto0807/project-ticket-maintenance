"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TicketMaintenanceUpdateSheet from "./sheet-assign";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    Activity,
    CheckCircle2,
    Clock,
    FileEdit,
    Loader2,
    Calendar,
    MapPin,
    User,
    Package,
    ArrowRight
} from "lucide-react";
import { TicketDialog } from "./dialog-ticket-detail";
import ImageDialogTicket from "../../maintenance/imageDialogTicket";
import WhatsAppLinkButtonAdmin from "@/components/whatsappButtonTableAdmin";

interface TechnicianScheduleTableProps {
    tickets: any[];
    loading: boolean;
    error: string | null;
}

const whatsappNumbers = [
    { id: 1, label: "Admin Bpk. Ismanto", phone: "6281228046664" },
    { id: 2, label: "Admin Bpk. Nurmisbah", phone: "6287879032758" },
    { id: 3, label: "Admin Bpk. Parwanto", phone: "6281280212068" },
];

export default function TechnicianScheduleTable({
    tickets,
    loading,
    error,
}: TechnicianScheduleTableProps) {

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Schedule...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-2">
            <AlertCircle className="w-8 h-8" />
            <p>{error}</p>
        </div>
    );

    return (
        <div className="mt-0">
            {/* Mobile View */}
            <div className="md:hidden grid grid-cols-2 gap-3">
                {Array.isArray(tickets) && tickets.length > 0 ? (
                    tickets.map((item) => {
                        const dynamicMessage = `Saya telah mengerjakan Ticket Number: ${item.ticketNumber} Asset Name: ${item.asset.product.part_name} mohon di cek dan di Closing. Detail: https://solusiit.net/dashboard/technician/assign?ticket=${item.ticketNumber}`;
                        return (
                            <div key={item.id} className="relative bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-md border border-gray-100 dark:border-slate-800 flex flex-col h-full ring-1 ring-black/5">
                                {/* Status Badge - Floating on Top */}
                                <div className="absolute top-2 right-2 z-10">
                                    <Badge
                                        className={`text-[8px] font-black uppercase rounded-full px-2 py-0.5 shadow-sm border-0 ${item.status === "Pending" ? "bg-red-50 text-white" :
                                            item.status === "Assigned" ? "bg-blue-50 text-white" :
                                                item.status === "In_Progress" ? "bg-amber-50 text-white animate-pulse" :
                                                    "bg-emerald-50 text-white"
                                            }`}
                                    >
                                        {item.status.replace("_", " ")}
                                    </Badge>
                                </div>

                                {/* Image Section */}
                                <div className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 bg-gray-50 mb-3 shadow-inner">
                                    <ImageDialogTicket src={item.asset.assetImage1 || "/noImage.jpg"} alt={item.asset.assetNumber} />
                                </div>

                                {/* Info Section */}
                                <div className="space-y-2 flex-grow">
                                    <div className="space-y-0.5">
                                        <div className="font-mono text-[9px] font-bold text-blue-500/70 tracking-tighter">
                                            {item.ticketNumber}
                                        </div>
                                        <h3 className="font-black text-[12px] text-gray-800 dark:text-gray-100 leading-tight line-clamp-2">
                                            {item.asset.product.part_name}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase truncate">
                                            <MapPin className="w-2.5 h-2.5 shrink-0 text-blue-400" />
                                            {item.asset.location}
                                        </div>
                                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase">
                                            <Calendar className="w-2.5 h-2.5 shrink-0 text-gray-300" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 italic leading-relaxed bg-gray-50/80 dark:bg-slate-800/50 p-2 rounded-xl border-l-2 border-blue-500/20">
                                        "{item.troubleUser}"
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="pt-3 mt-auto space-y-2">
                                    <div className="flex gap-2">
                                        <TicketDialog ticket={item} />
                                        <WhatsAppLinkButtonAdmin numbers={whatsappNumbers} message={dynamicMessage} />
                                    </div>
                                    <TicketMaintenanceUpdateSheet ticket={item} technicians={[]}>
                                        <Button size="sm" className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                                            Update
                                        </Button>
                                    </TicketMaintenanceUpdateSheet>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-2 text-center py-20 bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-800">
                        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4 opacity-50" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No scheduled tickets</p>
                    </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-50/80 transition-none border-b-2 border-slate-100 dark:border-slate-800">
                            <TableHead className="w-[140px] text-[10px] font-black uppercase tracking-widest py-5 px-6">Ticket ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Asset & Problem</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Assignment</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Timeline</TableHead>
                            <TableHead className="w-[150px] text-[10px] font-black uppercase tracking-widest py-5 text-center px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(tickets) && tickets.length > 0 ? (
                            tickets.map((item) => {
                                const dynamicMessage = `Saya telah mengerjakan Ticket Number: ${item.ticketNumber} Asset Name: ${item.asset.product.part_name} mohon di cek dan di Closing. Detail: https://solusiit.net/dashboard/technician/assign?ticket=${item.ticketNumber}`;
                                return (
                                    <TableRow key={item.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                                        <TableCell className="px-6 py-4">
                                            <div className="space-y-1.5">
                                                <div className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform origin-left inline-block">
                                                    {item.ticketNumber}
                                                </div>
                                                <Badge
                                                    className={`text-[9px] font-black uppercase h-5 rounded-full px-2.5 shadow-sm ${item.status === "Pending" ? "bg-red-50 text-red-600 border-red-100" :
                                                        item.status === "Assigned" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            item.status === "In_Progress" ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" :
                                                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        }`}
                                                    variant="outline"
                                                >
                                                    {item.status.replace("_", " ")}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 relative shrink-0 rounded-xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md">
                                                    <ImageDialogTicket src={item.asset.assetImage1 || "/noImage.jpg"} alt={item.asset.assetNumber} />
                                                </div>
                                                <div className="min-w-0 flex flex-col justify-center">
                                                    <div className="font-black text-sm text-gray-800 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                                                        {item.asset.product.part_name}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 italic italic leading-tight">
                                                        "{item.troubleUser}"
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                        <User className="w-3.5 h-3.5 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Reporter</p>
                                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.employee.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                                                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">Technician</p>
                                                        <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase">{item.technician?.name || "UNASSIGNED"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-center bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700 min-w-[75px]">
                                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Created</p>
                                                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">{new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                                </div>
                                                <ArrowRight className="w-3 h-3 text-slate-300" />
                                                <div className="text-center bg-blue-50 dark:bg-blue-900/10 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/30 min-w-[75px] shadow-sm shadow-blue-500/5">
                                                    <p className="text-[8px] font-black text-blue-400 uppercase mb-0.5">Schedule</p>
                                                    <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase">
                                                        {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "TBD"}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <TicketDialog ticket={item} />
                                                <WhatsAppLinkButtonAdmin numbers={whatsappNumbers} message={dynamicMessage} />
                                                <TicketMaintenanceUpdateSheet ticket={item} technicians={[]}>
                                                    <Button variant="outline" size="icon" className="h-9 w-9 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-md rounded-xl">
                                                        <FileEdit className="w-4 h-4" />
                                                    </Button>
                                                </TicketMaintenanceUpdateSheet>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-80 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-200 dark:text-slate-800 gap-3">
                                        <Package className="w-20 h-20 opacity-10" />
                                        <p className="text-sm font-black uppercase tracking-[0.2em]">No Data Available</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
