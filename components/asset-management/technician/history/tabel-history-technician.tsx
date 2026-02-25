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
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Loader2,
    Calendar,
    MapPin,
    User,
    Package,
    ArrowRight,
    Activity,
    XCircle,
    AlertTriangle,
    AlertOctagon,
    Filter
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types/ticket";
import { useCurrentUser } from "@/hooks/use-current-user";
import { TicketDialog } from "./dialog-ticket-detail";
import ImageDialogTicket from "../../maintenance/imageDialogTicket";

export default function HistoryTableTechnician({
    offset,
    searchParams
}: {
    offset: number;
    searchParams: { query?: string; page?: string }
}) {
    const [data, setData] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useCurrentUser();
    const email = user?.email || "";
    const role = user?.role || "";

    const query = searchParams.query || "";
    const currentPage = parseInt(searchParams.page || "1", 10);

    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);

    const fetchTickets = useCallback(async () => {
        if (!role || !email) return;
        setLoading(true);
        try {
            let apiUrl = "";
            if (role === "TECHNICIAN") {
                apiUrl = `/api/ticket-history?query=${encodeURIComponent(query)}&currentPage=${currentPage}&email=${encodeURIComponent(email)}`;
            } else if (role === "ADMIN") {
                apiUrl = `/api/ticket-history-admin?query=${encodeURIComponent(query)}&currentPage=${currentPage}`;
            }

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch tickets");
            const result = await response.json();
            setData(result.data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoading(false);
        }
    }, [query, email, role, currentPage]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const filteredData = data.filter((item) => {
        const matchesEmployee = selectedEmployees.length > 0 ? selectedEmployees.includes(item.employee.name) : true;
        const matchesTechnician = selectedTechnicians.length > 0 ? selectedTechnicians.includes(item.technician?.name || "N/A") : true;
        return matchesEmployee && matchesTechnician;
    });

    const toggleEmployee = (name: string, checked: boolean) => {
        setSelectedEmployees(prev => checked ? [...prev, name] : prev.filter(n => n !== name));
    };

    const toggleTechnician = (name: string, checked: boolean) => {
        setSelectedTechnicians(prev => checked ? [...prev, name] : prev.filter(n => n !== name));
    };

    const employees = Array.from(new Set(data.map(item => item.employee.name)));
    const technicians = Array.from(new Set(data.map(item => item.technician?.name || "N/A")));

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading History...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Filters Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Filters</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 px-4 font-bold text-[10px] uppercase tracking-widest border-slate-200 dark:border-slate-700">
                                {selectedEmployees.length > 0 ? `Employees (${selectedEmployees.length})` : "All Employees"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className="text-[10px] uppercase font-black text-slate-400">Select Employees</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {employees.map((name) => (
                                <DropdownMenuCheckboxItem
                                    key={name}
                                    checked={selectedEmployees.includes(name)}
                                    onCheckedChange={(checked) => toggleEmployee(name, checked)}
                                    className="text-xs font-semibold"
                                >
                                    {name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 px-4 font-bold text-[10px] uppercase tracking-widest border-slate-200 dark:border-slate-700">
                                {selectedTechnicians.length > 0 ? `Technicians (${selectedTechnicians.length})` : "All Technicians"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className="text-[10px] uppercase font-black text-slate-400">Select Technicians</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {technicians.map((name) => (
                                <DropdownMenuCheckboxItem
                                    key={name}
                                    checked={selectedTechnicians.includes(name)}
                                    onCheckedChange={(checked) => toggleTechnician(name, checked)}
                                    className="text-xs font-semibold"
                                >
                                    {name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {(selectedEmployees.length > 0 || selectedTechnicians.length > 0) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSelectedEmployees([]); setSelectedTechnicians([]); }}
                            className="h-9 px-3 text-[10px] font-black uppercase text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">
                                        {item.ticketNumber}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <Badge
                                    className={`text-[10px] font-black uppercase rounded-full px-3 ${item.status === "Pending" ? "bg-red-50 text-red-600 border-red-100" :
                                        item.status === "Assigned" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                            item.status === "In_Progress" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                item.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    "bg-slate-50 text-slate-600 border-slate-100"
                                        }`}
                                    variant="outline"
                                >
                                    {item.status.replace("_", " ")}
                                </Badge>
                            </div>

                            <div className="flex gap-3 bg-gray-50/50 dark:bg-slate-800/50 rounded-xl p-3 border border-gray-100/50 dark:border-slate-800">
                                <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm shrink-0">
                                    <ImageDialogTicket src={item.ticketImage1 || "/noImage.jpg"} alt={item.ticketNumber} />
                                </div>
                                <div className="min-w-0 flex flex-col justify-center">
                                    <div className="font-black text-[13px] text-gray-800 dark:text-gray-100 truncate leading-tight">
                                        {item.asset.product.part_name}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold uppercase mt-1">
                                        <MapPin className="w-2.5 h-2.5" />
                                        {item.asset.location}
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic border-l-4 border-blue-500/20 pl-3 py-1 bg-slate-50/50 dark:bg-slate-800/30 rounded-r-lg">
                                "{item.troubleUser}"
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[9px] font-bold text-slate-500">
                                        PRIORITY: {item.priorityStatus}
                                    </div>
                                </div>
                                <TicketDialog ticket={item} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-800">
                        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No history tickets</p>
                    </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-50/80 transition-none border-b-2 border-slate-100 dark:border-slate-800">
                            <TableHead className="w-[140px] text-[10px] font-black uppercase tracking-widest py-5 px-4">Ticket ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Asset & Problem</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Assignment</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-5">Status & Priority</TableHead>
                            <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest py-5 text-center px-4">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <TableCell className="px-4 py-4">
                                        <div className="space-y-1.5">
                                            <div className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">
                                                {item.ticketNumber}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold tracking-widest uppercase">
                                                <Calendar className="w-2.5 h-2.5 text-slate-300" />
                                                {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md bg-slate-50">
                                                <ImageDialogTicket src={item.ticketImage1 || "/noImage.jpg"} alt={item.ticketNumber} />
                                            </div>
                                            <div className="min-w-0 flex flex-col justify-center">
                                                <div className="font-black text-sm text-gray-800 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                                                    {item.asset.product.part_name}
                                                </div>
                                                <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 italic leading-tight">
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
                                                    <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-tight">{item.technician?.name || "UNASSIGNED"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                {item.status === "Pending" && <Clock className="w-3.5 h-3.5 text-slate-400" />}
                                                {item.status === "In_Progress" && <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                                                {item.status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                                {item.status === "Canceled" && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Completed' ? 'text-emerald-600' : item.status === 'In_Progress' ? 'text-amber-600' : 'text-slate-600'}`}>
                                                    {item.status.replace("_", " ")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700 w-fit">
                                                {item.priorityStatus === "Low" && <ArrowRight className="w-3 h-3 text-emerald-500 rotate-45" />}
                                                {item.priorityStatus === "Medium" && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                                                {item.priorityStatus === "High" && <AlertOctagon className="w-3 h-3 text-orange-500" />}
                                                {item.priorityStatus === "Critical" && <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />}
                                                <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{item.priorityStatus} Priority</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-center">
                                        <div className="flex justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                            <TicketDialog ticket={item} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    No tickets match your filters
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
