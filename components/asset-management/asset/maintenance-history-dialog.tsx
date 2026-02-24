'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Ticket {
    id: string;
    ticketNumber: string;
    troubleUser: string;
    analisaDescription: string | null;
    actionDescription: string | null;
    priorityStatus: string;
    status: string;
    createdAt: Date;
    completedDate: Date | null;
}

interface MaintenanceHistoryDialogProps {
    tickets?: Ticket[];
    assetNumber: string;
}

export function MaintenanceHistoryDialog({ 
    tickets = [], 
    assetNumber 
}: MaintenanceHistoryDialogProps) {
    const [open, setOpen] = useState(false);

    const maintenanceCount = tickets.length;
    const completedCount = tickets.filter(t => t.status === 'Completed').length;
    const pendingCount = tickets.filter(t => t.status === 'Pending' || t.status === 'Assigned' || t.status === 'In_Progress').length;

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return 'bg-red-500 text-white';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-yellow-500 text-white';
            case 'low': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700';
            case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700';
            case 'assigned': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
            case 'canceled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-300 dark:border-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return '✅';
            case 'in_progress': return '⏱️';
            case 'assigned': return '👤';
            case 'pending': return '⏳';
            case 'canceled': return '❌';
            default: return '❓';
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm"
                    className="relative h-8 px-2 font-bold text-[10px] uppercase tracking-tight bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-600 transition-all duration-200"
                >
                    🔧 {maintenanceCount}
                    {maintenanceCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black">
                            {maintenanceCount}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col z-50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        🔧 Riwayat Maintenance
                        <Badge variant="outline" className="ml-auto">{assetNumber}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Riwayat lengkap maintenance dan perbaikan untuk aset ini
                    </DialogDescription>
                </DialogHeader>

                {maintenanceCount === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-5xl mb-4">😊</div>
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                            Aset ini belum pernah di-maintenance
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Aset dalam kondisi baik-baik saja
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                                <CardContent className="p-3 text-center">
                                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                        {maintenanceCount}
                                    </div>
                                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-1">
                                        Total Maintenance
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                                <CardContent className="p-3 text-center">
                                    <div className="text-2xl font-black text-green-600 dark:text-green-400">
                                        {completedCount}
                                    </div>
                                    <p className="text-xs font-medium text-green-700 dark:text-green-300 mt-1">
                                        Selesai
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
                                <CardContent className="p-3 text-center">
                                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                                        {pendingCount}
                                    </div>
                                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mt-1">
                                        Pending
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tickets List */}
                        <ScrollArea className="flex-1 border rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="p-4 space-y-3">
                                {tickets.map((ticket) => (
                                    <Card 
                                        key={ticket.id} 
                                        className="bg-white/60 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-300"
                                    >
                                        <CardHeader className="pb-2 pt-3 px-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-lg">{getStatusIcon(ticket.status)}</span>
                                                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {ticket.ticketNumber}
                                                        </CardTitle>
                                                        <Badge variant="outline" className={`text-[9px] font-bold ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        Dilaporkan oleh: <span className="font-semibold">{ticket.troubleUser}</span>
                                                    </p>
                                                </div>
                                                <Badge className={`text-[9px] font-bold whitespace-nowrap ${getPriorityColor(ticket.priorityStatus)}`}>
                                                    {ticket.priorityStatus}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0 px-4 pb-3">
                                            <div className="space-y-2 text-xs">
                                                {ticket.analisaDescription && (
                                                    <div>
                                                        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                                                            Analisa Masalah:
                                                        </p>
                                                        <p className="text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/30 rounded px-2 py-1.5 line-clamp-2">
                                                            {ticket.analisaDescription}
                                                        </p>
                                                    </div>
                                                )}
                                                {ticket.actionDescription && (
                                                    <div>
                                                        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                                                            Tindakan Perbaikan:
                                                        </p>
                                                        <p className="text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/30 rounded px-2 py-1.5 line-clamp-2">
                                                            {ticket.actionDescription}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        📅 {format(new Date(ticket.createdAt), 'dd MMM yyyy HH:mm', { locale: idLocale })}
                                                    </span>
                                                    {ticket.completedDate && (
                                                        <span className="text-green-600 dark:text-green-400 font-semibold text-[10px]">
                                                            ✅ Selesai: {format(new Date(ticket.completedDate), 'dd MMM yyyy', { locale: idLocale })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
