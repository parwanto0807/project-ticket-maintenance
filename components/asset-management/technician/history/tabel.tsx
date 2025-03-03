"use client"; // Mark this as a client component

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
    CheckCircle,
    Clock,
    Loader2,
    UserCheck,
    XCircle,
} from "lucide-react";
import ReadMoreText from "./read-more";
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
import { useState } from "react";
import { Ticket } from "@/types/ticket"; // Import the updated Ticket type

export default function HistoryTableClient({
    data = [],
    offset,
}: {
    data?: Ticket[];
    offset: number;
}) {
    // State for multi-select filtering
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);

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

    // Dapatkan list unik nama employee dan technician
    const employees = Array.from(new Set(data.map((item) => item.employee.name)));
    const technicians = Array.from(new Set(data.map((item) => item.technician.name)));

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

    return (
        <div className="mt-0 flow-root">
            <div className="mx-auto max-w-8xl">
                <Card className="p-2 rounded-lg bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    <CardHeader className="px-4 py-2">
                        <CardTitle className="text-lg font-bold text-center">
                            Technician History Tickets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Dropdown untuk filtering multi-select */}
                        <div className="flex gap-2 p-4">
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
                        </div>

                        {/* Tampilan untuk mobile */}
                        <div className="md:hidden">
                            {filteredData.map((ticket) => (
                                <Card
                                    key={ticket.id}
                                    className="mb-2 w-full rounded-md p-2 bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950"
                                >
                                    <div className="grid grid-cols-1 items-center justify-between pb-1">
                                        <div>
                                            <div className="mb-2 flex items-center justify-between font-bold text-black dark:text-white">
                                                <Badge
                                                    variant="secondary"
                                                    className="font-mono tracking-widest uppercase h-10 border-orange-500"
                                                >
                                                    {ticket.ticketNumber}
                                                </Badge>
                                                &nbsp;
                                                <Badge
                                                    className={`
                            absolute right-8 font-mono tracking-widest uppercase
                            ${ticket.status === "Pending"
                                                            ? "bg-red-100 text-red-500"
                                                            : ticket.status === "Assigned"
                                                                ? "bg-blue-100 text-blue-500"
                                                                : ticket.status === "In_Progress"
                                                                    ? "bg-orange-100 text-orange-500"
                                                                    : ticket.status === "Completed"
                                                                        ? "bg-green-100 text-green-500"
                                                                        : ticket.status === "Canceled"
                                                                            ? "bg-red-100 text-red-500"
                                                                            : "bg-gray-100 text-gray-500"
                                                        }
                          `}
                                                >
                                                    {ticket.status.replace("_", " ")}
                                                </Badge>
                                                &nbsp;
                                            </div>
                                            <div>
                                                <p className="text-sm pt-1">
                                                    {ticket.asset.product.part_name} &nbsp;
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="flex-none text-sm">
                                                    {ticket.priorityStatus}
                                                </p>
                                                &nbsp;
                                                <p className="flex-none text-sm font-bold text-gray-500">
                                                    {ticket.employee.name}
                                                </p>
                                            </div>
                                            <div className="flex flex-row items-center gap-2">
                                                <p className="flex-nonetext-sm text-gray-500">
                                                    {ticket.scheduledDate?.toDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-start justify-start">
                                                <p className="text-gray-500 font-bold">
                                                    Teknisi : {ticket.technician?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-end justify-end gap-2">
                                                <TicketDialog ticket={ticket} />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Tampilan untuk desktop */}
                        <Table className="hidden w-full max-w-full mt-2 md:table">
                            <TableHeader>
                                <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                    <TableHead className="text-black dark:text-white">No</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">
                                        Ticket
                                    </TableHead>
                                    <TableHead className="text-black dark:text-white">Title</TableHead>
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
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-[12px] border-none">
                                {filteredData.map((ticket, index) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="text-center">
                                            {offset + index + 1}
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-nowrap">
                                            <Badge
                                                className={`
                          font-mono tracking-widest uppercase
                          ${ticket.status === "Pending"
                                                        ? "bg-red-100 text-red-500"
                                                        : ticket.status === "Assigned"
                                                            ? "bg-blue-100 text-blue-500"
                                                            : ticket.status === "In_Progress"
                                                                ? "bg-orange-100 text-orange-500"
                                                                : ticket.status === "Completed"
                                                                    ? "bg-green-100 text-green-500"
                                                                    : ticket.status === "Canceled"
                                                                        ? "bg-red-100 text-red-500"
                                                                        : "bg-gray-100 text-gray-500"
                                                    }
                        `}
                                            >
                                                {ticket.ticketNumber.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="font-mono bg-slate-100 dark:text-black"
                                            >
                                                {ticket.employee.name}
                                            </Badge>
                                            &nbsp;
                                            <Badge
                                                variant="outline"
                                                className="font-mono bg-slate-100 dark:text-black"
                                            >
                                                {ticket.asset.location}
                                            </Badge>
                                            &nbsp;
                                            <ReadMoreText text={ticket.troubleUser} />
                                        </TableCell>
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
                                        <TableCell>
                                            {ticket.scheduledDate?.toDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <TicketDialog ticket={ticket} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
