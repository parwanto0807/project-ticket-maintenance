"use client";

import React, { useEffect, useState, useCallback } from "react";
// import Link from "next/link";
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
    AlertOctagon,
    AlertTriangle,
    ArrowDownCircle,
    CheckCircle,
    Clock,
    FileEdit,
    Loader2,
    UserCheck,
    XCircle,
    // ArrowLeft,
} from "lucide-react";
import ReadMoreText from "./read-more";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PriorityStatus, StatusTicket } from "@prisma/client";
import { FaCalendarAlt, FaExclamationCircle, FaHandsHelping, FaTicketAlt, FaUser } from "react-icons/fa";
import ImageDialogTicket from "../../maintenance/imageDialogTicket";
import WhatsAppLinkButtonAdmin from "@/components/whatsappButtonTableAdmin";
// import { TicketDialog } from "./dialog-ticket-detail";

interface Ticket {
    id: string;
    countNumber: number;
    ticketNumber: string;
    troubleUser: string;
    analisaDescription?: string;
    actionDescription?: string;
    priorityStatus: PriorityStatus;
    status: StatusTicket;
    createdAt: Date;
    updatedAt: Date;
    scheduledDate?: Date;
    actualCheckDate?: Date;
    completedDate?: Date;
    employeeId: string;
    assetId: string;
    technicianId?: string;
    ticketImage1?: string;
    ticketImage2?: string;
    ticketImage3?: string;
    employee: {
        name: string;
        email: string;
    };
    asset: {
        assetImage1?: string;
        assetNumber: string;
        product: {
            part_name: string;
        };
        location: string;
    };
    technician?: {
        id: string;
        name: string;
        phone: string;
        email: string;
        specialization: string;
    };
}

interface TechnicianScheduleTableProps {
    query: string;
    currentPage: number;
}

const DATA_PER_PAGE_PRODUCT = 15;

// Daftar nomor WhatsApp
const whatsappNumbers = [
    { id: 1, label: "Admin Bpk. Ismanto", phone: "6281228046664" },
    { id: 2, label: "Admin Bpk. Nurmisbah", phone: "6287879032758" },
    { id: 3, label: "Admin Bpk. Parwanto", phone: "6281280212068" },
];

export default function TechnicianScheduleTable({
    query,
    currentPage,
}: TechnicianScheduleTableProps) {
    const user = useCurrentUser();
    const email = user?.email || "";
    const role = user?.role || "";

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        if (!role) return; // Pastikan role sudah tersedia sebelum fetch
        setLoading(true);
        try {
            let apiUrl = "";

            if (role === "TECHNICIAN") {
                apiUrl = `/api/schedule/technician?query=${encodeURIComponent(query)}&currentPage=${currentPage}&email=${encodeURIComponent(email)}`;
            } else if (role === "ADMIN") {
                apiUrl = `/api/schedule/admin?query=${encodeURIComponent(query)}&currentPage=${currentPage}`;
            }

            // console.log("Fetching data from:", apiUrl); 

            const res = await fetch(apiUrl);
            const result = await res.json();
            setTickets(result);
            console.log("Fetched tickets:", result);

        } catch (err) {
            console.error("Error fetching schedule:", err);
            setError("Terjadi kesalahan saat mengambil data.");
        } finally {
            setLoading(false);
        }
    }, [query, currentPage, email, role]);

    useEffect(() => {
        if (role === "TECHNICIAN" || role === "ADMIN") {
            fetchTickets();
        }
    }, [fetchTickets, role]);

    const offset = (currentPage - 1) * DATA_PER_PAGE_PRODUCT;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="mt-0 flow-root">
            <div className="mx-auto max-w-8xl">
                <Card className="p-2 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    <CardHeader className="px-4 py-2">
                        <CardTitle className="text-lg font-bold text-center">
                            Technician Schedule Tickets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Tampilan Mobile */}
                        <div className="md:hidden">
                            {Array.isArray(tickets) && tickets.map((data) => {
                                const dynamicMessage =
                                    `Saya telah mengerjakan Ticket Number: ${data.ticketNumber} 
        Asset Name: ${data.asset.product.part_name} mohon di cek dan di Closing , 
        Cek detail ticket di sini: https://solusiit.net/dashboard/technician/assign?ticket=${data.ticketNumber}`;
                                return (
                                    <Card
                                        key={data.id}
                                        className="mb-2 w-full rounded-md p-2 bg-gradient-to-b from-blue-100 to-blue-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950"
                                    >
                                        <Card className="mb-4 w-full rounded-lg p-4 bg-gradient-to-b from-blue-100 to-blue-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950 shadow-md hover:shadow-lg transition-shadow">
                                            <div className="flex flex-col gap-3">
                                                {/* Header Card */}
                                                <div className="flex justify-between datas-center">
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-mono tracking-widest uppercase h-8 border-orange-500 flex datas-center gap-2"
                                                    >
                                                        <FaTicketAlt className="w-4 h-4" />
                                                        {data.ticketNumber}
                                                    </Badge>
                                                    <Badge
                                                        className={`font-mono tracking-widest uppercase h-8 ${data.status === "Pending"
                                                            ? "bg-red-100 text-red-500"
                                                            : data.status === "Assigned"
                                                                ? "bg-blue-100 text-blue-500"
                                                                : data.status === "In_Progress"
                                                                    ? "bg-orange-100 text-orange-500"
                                                                    : data.status === "Completed"
                                                                        ? "bg-green-100 text-green-500"
                                                                        : data.status === "Canceled"
                                                                            ? "bg-red-100 text-red-500"
                                                                            : "bg-gray-100 text-gray-500"
                                                            }`}
                                                    >
                                                        {data.status.replace("_", " ")}
                                                    </Badge>
                                                </div>

                                                {/* Konten Card */}
                                                <div className="space-y-0 items-end justify-end">
                                                    <div className="flex datas-center gap-2">
                                                        <FaExclamationCircle className="w-4 h-4 text-orange-500" />
                                                        <p className="text-sm font-semibold">
                                                            {data.asset.product.part_name}
                                                        </p>
                                                    </div>
                                                    <div className="flex datas-center gap-2">
                                                        <FaUser className="w-4 h-4 text-orange-500" />
                                                        <p className="font-bold text-sm items-center justify-center text-nowrap">
                                                            User Complain :
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {data.employee?.name}
                                                        </p>
                                                    </div>
                                                    <div className="flex datas-center gap-2">
                                                        <FaHandsHelping className="w-4 h-4 text-orange-500" />
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {data.troubleUser}
                                                        </p>
                                                    </div>
                                                    <div className="flex datas-center gap-2">
                                                        <FaCalendarAlt className="w-4 h-4 text-orange-500" />
                                                        <p className="font-bold text-sm items-center justify-center text-nowrap">
                                                            Schedule Action :
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {data.scheduledDate
                                                                ? new Date(data.scheduledDate).toDateString()
                                                                : "No Schedule"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Gambar Tiket */}
                                                <div className="flex full max-h-16 overflow-hidden rounded-lg gap-2">
                                                    <ImageDialogTicket
                                                        src={data.ticketImage1 || "/noImage.jpg"}
                                                        alt={`${data.ticketImage1} Asset Image`}
                                                    />
                                                    <ImageDialogTicket
                                                        src={data.ticketImage2 || "/noImage.jpg"}
                                                        alt={`${data.ticketImage2} Asset Image`}
                                                    />
                                                    <ImageDialogTicket
                                                        src={data.ticketImage3 || "/noImage.jpg"}
                                                        alt={`${data.ticketImage3} Asset Image`}
                                                    />
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex justify-end gap-2">
                                                    <div className="flex datas-center justify-center gap-2">
                                                        <WhatsAppLinkButtonAdmin
                                                            numbers={whatsappNumbers}
                                                            message={dynamicMessage}
                                                        />
                                                        <TicketMaintenanceUpdateSheet
                                                            ticketId={data.id}
                                                            technicians={data.technician ? [data.technician] : []}
                                                            initialTechnicianId={data.technicianId || ""}
                                                            initialScheduledDate={
                                                                data.scheduledDate
                                                                    ? new Date(data.scheduledDate)
                                                                        .toISOString()
                                                                        .split("T")[0]
                                                                    : ""
                                                            }
                                                            initialAnalisaDescription={data.analisaDescription || ""}
                                                            initialActionDescription={data.actionDescription || ""}
                                                            initialTicketImage1={data.ticketImage1 || ""}
                                                            initialTicketImage2={data.ticketImage2 || ""}
                                                            initialTicketImage3={data.ticketImage3 || ""}
                                                            initialTroubleUser={data.troubleUser || ""}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={!data.scheduledDate}
                                                                className="flex datas-center gap-2 text-blue-500 bg-white border border-blue-500 rounded-md px-3 py-1 transition-all duration-200 transform hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <FileEdit className="w-4 h-4" />
                                                                Action
                                                            </Button>
                                                        </TicketMaintenanceUpdateSheet>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Card>
                                );
                            })}
                        </div>


                        {/* Tampilan Desktop */}
                        <Table className="hidden w-full max-w-full mt-2 md:table">
                            <TableHeader>
                                <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 dark:from-sky-500 dark:to-indigo-700 dark:hover:from-sky-600 dark:hover:to-indigo-800">
                                    <TableHead className="text-white py-5">No</TableHead>
                                    <TableHead className="text-white py-5 text-center">
                                        Ticket
                                    </TableHead>
                                    <TableHead className="text-white py-5">
                                        Title
                                    </TableHead>
                                    <TableHead className="text-white py-5">
                                        Technician
                                    </TableHead>
                                    <TableHead className="text-white py-5 text-center">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-white py-5 text-center">
                                        Priority
                                    </TableHead>
                                    <TableHead className="text-white py-5 text-center">
                                        Schedule Action
                                    </TableHead>
                                    <TableHead className="text-white py-5 text-center">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-[12px] border-none">
                                {Array.isArray(tickets) && tickets.map((data, index) => {
                                    const dynamicMessage =
                                        `Saya telah mengerjakan Ticket Number: ${data.ticketNumber} 
        Asset Name: ${data.asset.product.part_name} mohon di cek dan di Closing , 
        Cek detail ticket di sini: https://solusiit.net/dashboard/technician/assign?ticket=${data.ticketNumber}`;

                                    return (
                                        <TableRow key={data.id}>
                                            <TableCell className="text-center">
                                                {offset + index + 1}
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-nowrap">
                                                <Badge
                                                    className={`
                            font-mono tracking-widest uppercase
                            ${data.status === "Pending"
                                                            ? "bg-red-100 text-red-500"
                                                            : data.status === "Assigned"
                                                                ? "bg-blue-100 text-blue-500"
                                                                : data.status === "In_Progress"
                                                                    ? "bg-orange-100 text-orange-500"
                                                                    : data.status === "Completed"
                                                                        ? "bg-green-100 text-green-500"
                                                                        : data.status === "Canceled"
                                                                            ? "bg-red-100 text-red-500"
                                                                            : "bg-gray-100 text-gray-500"
                                                        }
                        `}
                                                >
                                                    {data.ticketNumber.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="font-mono bg-slate-100 dark:text-black"
                                                >
                                                    {data.employee.name}
                                                </Badge>
                                                &nbsp;
                                                <Badge
                                                    variant="outline"
                                                    className="font-mono bg-slate-100 dark:text-black"
                                                >
                                                    {data.asset.location}
                                                </Badge>
                                                &nbsp;
                                                <ReadMoreText text={data.troubleUser} />
                                            </TableCell>
                                            <TableCell>{data.technician?.name}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex datas-center justify-center gap-1">
                                                    {data.status === "Pending" && <Clock className="w-4 h-4 text-gray-500" />}
                                                    {data.status === "Assigned" && <UserCheck className="w-4 h-4 text-blue-500" />}
                                                    {data.status === "In_Progress" && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
                                                    {data.status === "Completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                                                    {data.status === "Canceled" && <XCircle className="w-4 h-4 text-red-500" />}
                                                    <span className="ml-1">{data.status.replace("_", " ")}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex datas-start justify-start gap-1">
                                                    {data.priorityStatus === "Low" && <ArrowDownCircle className="w-4 h-4 text-green-500" />}
                                                    {data.priorityStatus === "Medium" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                                    {data.priorityStatus === "High" && <AlertOctagon className="w-4 h-4 text-orange-500" />}
                                                    {data.priorityStatus === "Critical" && <AlertCircle className="w-4 h-4 text-red-500" />}
                                                    <span>{data.priorityStatus}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {data.scheduledDate ? new Date(data.scheduledDate).toDateString() : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex datas-center justify-center gap-2">
                                                    {data.completedDate ? (
                                                        <WhatsAppLinkButtonAdmin
                                                            numbers={whatsappNumbers}
                                                            message={dynamicMessage}
                                                            disabled
                                                        />
                                                    ) : (
                                                        <WhatsAppLinkButtonAdmin
                                                            numbers={whatsappNumbers}
                                                            message={dynamicMessage}
                                                        />
                                                    )}
                                                    <TicketMaintenanceUpdateSheet
                                                        ticketId={data.id}
                                                        technicians={data.technician ? [data.technician] : []}
                                                        initialTechnicianId={data.technicianId || ""}
                                                        initialScheduledDate={
                                                            data.scheduledDate
                                                                ? new Date(data.scheduledDate)
                                                                    .toISOString()
                                                                    .split("T")[0]
                                                                : ""
                                                        }
                                                        initialAnalisaDescription={data.analisaDescription || ""}
                                                        initialActionDescription={data.actionDescription || ""}
                                                        initialTicketImage1={data.ticketImage1 || ""}
                                                        initialTicketImage2={data.ticketImage2 || ""}
                                                        initialTicketImage3={data.ticketImage3 || ""}
                                                        initialTroubleUser={data.troubleUser || ""}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={!data.scheduledDate}
                                                            className="flex datas-center gap-2 text-blue-500 bg-white border border-blue-500 rounded-md px-3 py-1 transition-all duration-200 transform hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <FileEdit className="w-4 h-4" />
                                                            Action
                                                        </Button>
                                                    </TicketMaintenanceUpdateSheet>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>

                        </Table>
                    </CardContent>
                </Card>
                {/* <div className="flex justify-end datas-end w-full pt-2">
                    <Link href="/dashboard">
                        <Button
                            variant="destructive"
                            className="flex datas-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div> */}
            </div>
        </div>
    );
}