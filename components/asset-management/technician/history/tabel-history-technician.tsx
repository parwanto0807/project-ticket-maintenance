"use client"; // Mark this as a client component

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TicketDialog } from "./dialog-ticket-detail";
import {
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    ArrowDownCircle,
    ArrowLeft,
    CheckCircle,
    Clock,
    Loader2,
    UserCheck,
    XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ticket } from "@/types/ticket";
import { useCurrentUser } from "@/hooks/use-current-user";

// 🔹 Fungsi Fetch Data dari API berdasarkan Role
async function fetchTickets(query: string, currentPage: number, email: string) {
    try {
        // 🔹 Panggil API dengan parameter yang sesuai
        const response = await fetch(
            `/api/ticket-history?query=${encodeURIComponent(query)}&currentPage=${currentPage}&email=${encodeURIComponent(email)}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch tickets");
        }

        const result = await response.json();
        return result.data; // Mengembalikan hanya data tiket
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return [];
    }
}


export default function HistoryTableTechnician({ offset, searchParams }: { offset: number; searchParams: { query?: string; page?: string } }) {
    // 🔹 State untuk menyimpan data tiket
    const [data, setData] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useCurrentUser();
    const email = user?.email;

    // 🔹 Default nilai query dan halaman awal
    const query = searchParams.query || "";
    const currentPage = parseInt(searchParams.page || "1", 10);

    // 🔹 State untuk multi-select filter
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);

    // 🔹 Ambil data tiket berdasarkan email saat pertama kali komponen dimuat
    useEffect(() => {
        async function loadTickets() {
            setLoading(true);
            try {
                const tickets = await fetchTickets(query, currentPage, email || "");
                setData(tickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoading(false);
            }
        }
        loadTickets();
    }, [query, email, currentPage]); // 🔹 Memastikan data diperbarui jika email atau halaman berubah


    // Filter data berdasarkan multi-select filter
    const filteredData = data.filter((item) => {
        const matchesEmployee =
            selectedEmployees.length > 0
                ? selectedEmployees.includes(item.employee.name)
                : true;
        const matchesTechnician =
            selectedTechnicians.length > 0
                ? selectedTechnicians.includes(item.technician.name)
                : true;
        return matchesEmployee && matchesTechnician;
    });

    // Fungsi toggle untuk multi-select
    const toggleEmployee = (name: string, checked: boolean) => {
        const newSelected = checked
            ? [...selectedEmployees, name]
            : selectedEmployees.filter((n) => n !== name);
        setSelectedEmployees(newSelected);
    };

    const toggleTechnician = (name: string, checked: boolean) => {
        const newSelected = checked
            ? [...selectedTechnicians, name]
            : selectedTechnicians.filter((n) => n !== name);
        setSelectedTechnicians(newSelected);
    };

    // 🔹 Dapatkan list unik nama employee dan technician
    const employees = Array.from(new Set(data.map((item) => item.employee.name)));
    const technicians = Array.from(new Set(data.map((item) => item.technician.name)));

    return (
        <div className="mt-0 flow-root">
            <div className="mx-auto max-w-8xl">
                <Card className="p-2 rounded-lg bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    <CardHeader className="px-4 py-2 flex justify-between">
                        <CardTitle className="text-lg font-bold text-center">
                            Technician History Tickets
                        </CardTitle>

                        {/* 🔹 Dropdown untuk memilih Role */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {selectedEmployees.length > 0
                                        ? selectedEmployees.join(", ")
                                        : "All Employees"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select Employees</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {employees.map((name) => (
                                    <DropdownMenuCheckboxItem
                                        key={name}
                                        checked={selectedEmployees.includes(name)}
                                        onCheckedChange={(checked) => toggleEmployee(name, checked)}
                                    >
                                        {name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {selectedTechnicians.length > 0
                                        ? selectedTechnicians.join(", ")
                                        : "All Technicians"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select Technicians</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {technicians.map((name) => (
                                    <DropdownMenuCheckboxItem
                                        key={name}
                                        checked={selectedTechnicians.includes(name)}
                                        onCheckedChange={(checked) => toggleTechnician(name, checked)}
                                    >
                                        {name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* 🔹 Loader saat data masih di-fetch */}
                        {loading ? (
                            <div className="text-center p-4">
                                <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
                            </div>
                        ) : (
                            <>
                                {/* 🔹 Tampilan untuk Mobile */}
                                <div className="md:hidden">
                                    {filteredData.map((ticket) => (
                                        <Card key={ticket.id} className="mb-2 w-full p-2 bg-orange-100 dark:bg-slate-800">
                                            <div className="grid grid-cols-1">
                                                <div>
                                                    <Badge className="font-mono tracking-widest uppercase">
                                                        {ticket.ticketNumber}
                                                    </Badge>
                                                    <Badge
                                                        className={`font-mono tracking-widest uppercase ${ticket.status === "Pending" ? "bg-red-100 text-red-500"
                                                            : ticket.status === "Assigned" ? "bg-blue-100 text-blue-500"
                                                                : ticket.status === "In_Progress" ? "bg-orange-100 text-orange-500"
                                                                    : ticket.status === "Completed" ? "bg-green-100 text-green-500"
                                                                        : "bg-gray-100 text-gray-500"
                                                            }`}
                                                    >
                                                        {ticket.status.replace("_", " ")}
                                                    </Badge>
                                                    <p className="text-sm pt-1">{ticket.asset.product.part_name}</p>
                                                    <p className="text-sm font-bold">{ticket.employee.name}</p>
                                                    <p className="text-sm">{ticket.scheduledDate ? new Date(ticket.scheduledDate).toDateString() : "-"}
                                                    </p>
                                                    <p className="text-sm font-bold">Teknisi: {ticket.technician?.name || "N/A"}</p>
                                                </div>
                                                <div className="flex justify-end">
                                                    <TicketDialog ticket={ticket} />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* 🔹 Tampilan untuk Desktop */}
                                <Table className="hidden md:table">
                                    <TableHeader>
                                        <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                            <TableHead className="text-black dark:text-white">No</TableHead>
                                            <TableHead className="text-black dark:text-white text-center">
                                                Ticket
                                            </TableHead>
                                            <TableHead className="text-black dark:text-white">Title</TableHead>
                                            <TableHead className="text-black dark:text-white">
                                                Technician
                                            </TableHead>
                                            <TableHead className="text-black dark:text-white text-center">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-black dark:text-white text-center">
                                                Priority
                                            </TableHead>
                                            <TableHead className="text-black dark:text-white text-center">
                                                Schedule Action
                                            </TableHead>
                                            <TableHead className="text-black dark:text-white text-center">
                                                Detail
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.map((ticket, index) => (
                                            <TableRow key={ticket.id}>
                                                <TableCell>{offset + index + 1}</TableCell>
                                                <TableCell>{ticket.ticketNumber}</TableCell>
                                                <TableCell>{ticket.troubleUser}</TableCell>
                                                <TableCell>{ticket.technician?.name || "N/A"}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {ticket.status === "Pending" && (
                                                            <Clock className="w-4 h-4 text-gray-500" />
                                                        )}
                                                        {ticket.status === "Assigned" && (
                                                            <UserCheck className="w-4 h-4 text-blue-500" />
                                                        )}
                                                        {ticket.status === "In_Progress" && (
                                                            <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                                                        )}
                                                        {ticket.status === "Completed" && (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        )}
                                                        {ticket.status === "Canceled" && (
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                        )}
                                                        <span className="ml-1">
                                                            {ticket.status.replace("_", " ")}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-start justify-start gap-1">
                                                        {ticket.priorityStatus === "Low" && (
                                                            <ArrowDownCircle className="w-4 h-4 text-green-500" />
                                                        )}
                                                        {ticket.priorityStatus === "Medium" && (
                                                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                                        )}
                                                        {ticket.priorityStatus === "High" && (
                                                            <AlertOctagon className="w-4 h-4 text-orange-500" />
                                                        )}
                                                        {ticket.priorityStatus === "Critical" && (
                                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                                        )}
                                                        <span>{ticket.priorityStatus}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{ticket.priorityStatus}</TableCell>
                                                <TableCell>{ticket.scheduledDate ? new Date(ticket.scheduledDate).toDateString() : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <TicketDialog ticket={ticket} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        )}
                    </CardContent>
                </Card>
                <div className="flex justify-end items-end w-full pt-2">
                    <Link href="/dashboard">
                        <Button variant="destructive" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
