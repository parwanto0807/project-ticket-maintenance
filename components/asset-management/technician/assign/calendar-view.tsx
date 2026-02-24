"use client";

import React, { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, User, Wrench, Calendar as CalendarIcon, ListTodo, MapPin, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TicketDialog } from "./dialog-ticket-detail";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AssignCalendarViewProps {
    initialTickets: any[];
}

function DailyTaskDialog({ day, tickets }: { day: Date; tickets: any[] }) {
    if (tickets.length === 0) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Badge
                    variant="outline"
                    className="text-[11px] font-black h-6 px-3 border-red-200 text-red-600 bg-red-50 cursor-pointer hover:bg-red-600 hover:text-white transition-all shadow-sm rounded-lg"
                >
                    {tickets.length} Tugas
                </Badge>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                            <ListTodo className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Daftar Tugas</DialogTitle>
                            <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                {format(day, "EEEE, d MMMM yyyy", { locale: id })}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] p-6">
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                            >
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <div className="min-w-0">
                                        <Badge variant="outline" className="font-mono text-[10px] tracking-tight border-blue-200 text-blue-600 bg-blue-50/50 truncate">
                                            {ticket.ticketNumber}
                                        </Badge>
                                    </div>
                                    <TicketDialog ticket={ticket} />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                                            <Wrench className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-100 line-clamp-2 leading-relaxed">
                                                {ticket.asset.product.part_name}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1 font-medium text-gray-500 italic text-[10px] line-clamp-1">
                                                <ClipboardList className="w-3 h-3 shrink-0" />
                                                "{ticket.troubleUser}"
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                                                <User className="w-3 h-3 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] font-black text-blue-400 uppercase leading-none mb-0.5">Technician</p>
                                                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{ticket.technician?.name || "Unassigned"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-right justify-end">
                                            <div className="min-w-0">
                                                <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">Location</p>
                                                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{ticket.asset.location || "N/A"}</p>
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                <MapPin className="w-3 h-3 text-slate-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default function AssignCalendarView({ initialTickets }: AssignCalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getTicketsForDay = (day: Date) => {
        return initialTickets.filter((ticket) => {
            if (!ticket.scheduledDate) return false;
            return isSameDay(new Date(ticket.scheduledDate), day);
        });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 capitaize">
                            {format(currentDate, "MMMM yyyy", { locale: id })}
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            Monthly Assignment Schedule
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9 rounded-xl border-gray-200 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="h-9 px-4 rounded-xl border-gray-200 font-bold text-xs uppercase" onClick={() => setCurrentDate(new Date())}>
                        Hari Ini
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9 rounded-xl border-gray-200 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 bg-slate-50/30 dark:bg-slate-800/30 border-b border-gray-100 dark:border-slate-800">
                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                    <div key={day} className="py-3 text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                    const dayTickets = getTicketsForDay(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-slate-800 transition-colors relative group",
                                !isCurrentMonth && "bg-slate-50/50 dark:bg-slate-800/10",
                                isToday && "bg-blue-50/30 dark:bg-blue-900/10",
                                idx % 7 === 6 && "border-r-0"
                            )}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span
                                    className={cn(
                                        "text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-lg transition-all",
                                        !isCurrentMonth ? "text-gray-300 dark:text-gray-600" : "text-gray-600 dark:text-gray-300",
                                        isToday ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "group-hover:bg-slate-100 dark:group-hover:bg-slate-800"
                                    )}
                                >
                                    {format(day, "d")}
                                </span>
                                <DailyTaskDialog day={day} tickets={dayTickets} />
                            </div>

                            <div className="space-y-1.5 max-h-[100px] overflow-y-auto scrollbar-hide">
                                {dayTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:border-blue-200 dark:hover:border-blue-900 group/item transition-all"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between gap-1 overflow-hidden">
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 truncate block">
                                                        {ticket.ticketNumber}
                                                    </span>
                                                </div>
                                                <TicketDialog ticket={ticket} />
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight">
                                                {ticket.asset.product.part_name}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <User className="w-2.5 h-2.5 text-gray-400" />
                                                <span className="text-[9px] font-medium text-gray-500 truncate">
                                                    {ticket.technician?.name || "Unassigned"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
