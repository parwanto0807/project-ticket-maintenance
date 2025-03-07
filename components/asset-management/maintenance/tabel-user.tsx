"use client";

import { useEffect, useState } from "react";
import DeleteAlertTicket from "./alert-delete";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ImageDialog from "../asset/imageDialog";
import { Badge } from "@/components/ui/badge";
import { TicketDialog } from "./dialog-ticket-detail";
import ReadMoreText from "./read-more";
import ImageDialogTicket from "./imageDialogTicket";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Card } from "@/components/ui/card";
import WhatsAppLinkButtonTable from "@/components/whatsappButtonTable";

const ITEMS_PER_PAGE_PRODUCT = 10;

interface Ticket {
    id: string;
    ticketNumber: string;
    status: string;
    troubleUser: string;
    analisaDescription?: string;
    actionDescription?: string;
    priorityStatus: string;
    scheduledDate?: string;
    completedDate?: string;
    ticketImage1?: string;
    ticketImage2?: string;
    ticketImage3?: string;
    createdAt: Date;
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
    };
    technician?: {
        name: string;
    };
}

interface TicketTableProps {
    query: string;
    currentPage: number;
}

export default function TicketTableUser({ query, currentPage }: TicketTableProps) {
    const user = useCurrentUser();
    const email = user?.email || "";
    const [data, setData] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;

    // Daftar nomor WhatsApp
    const whatsappNumbers = [
        { id: 1, label: "Teknisi 1 Parwanto", phone: "6281280212068" },
        { id: 2, label: "Teknisi 2 Agung", phone: "6281280660953" },
    ];


    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Contoh endpoint API, sesuaikan dengan implementasi backend Anda
                const res = await fetch(
                    `/api/ticket-list?query=${encodeURIComponent(
                        query
                    )}&currentPage=${currentPage}&email=${encodeURIComponent(email)}`
                );
                if (!res.ok) {
                    throw new Error("Gagal mengambil data tiket");
                }
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching ticket list:", error);
            } finally {
                setLoading(false);
            }
        }

        if (email) {
            fetchData();
        }
    }, [query, currentPage, email]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="mt-0 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-0 md:pt-0 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    {/* Tampilan Mobile */}
                    <div className="md:hidden">
                        {Array.isArray(data) &&
                            data.map((item) => {
                                // Pesan dinamis untuk setiap tiket
                                const dynamicMessage = `Saya telah membuka ticket maintenance mohon di cek.
Ticket Number: ${item.ticketNumber}
Asset Name: ${item.asset.product.part_name}`;

                                return (
                                    <Card
                                        key={item.id}
                                        className="mb-2 w-full rounded-md p-2 bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950"
                                    >
                                        <div className="grid grid-cols-1 items-center justify-between border-b pb-1">
                                            <div>
                                                <div className="mb-2 flex items-center justify-between font-bold text-black dark:text-white">
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-mono tracking-widest uppercase h-10 border-orange-500"
                                                    >
                                                        {item.ticketNumber}
                                                    </Badge>
                                                    &nbsp;
                                                    <Badge
                                                        className={`
                              absolute right-8 font-mono tracking-widest uppercase
                              ${item.status === "Pending"
                                                                ? "bg-red-100 text-red-500"
                                                                : item.status === "Assigned"
                                                                    ? "bg-blue-100 text-blue-500"
                                                                    : item.status === "In_Progress"
                                                                        ? "bg-orange-100 text-orange-500"
                                                                        : item.status === "Completed"
                                                                            ? "bg-green-100 text-green-500"
                                                                            : item.status === "Canceled"
                                                                                ? "bg-red-100 text-red-500"
                                                                                : "bg-gray-100 text-gray-500"
                                                            }
                            `}
                                                    >
                                                        {item.status.replace("_", " ")}
                                                    </Badge>
                                                    &nbsp;
                                                </div>
                                                <div>
                                                    <p className="text-sm pt-1">
                                                        {item.asset.product.part_name} &nbsp;
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="flex-none text-sm">
                                                        {item.priorityStatus}
                                                    </p>
                                                    &nbsp;
                                                    <p className="flex-none text-sm font-bold text-gray-500">
                                                        {item.employee?.name}
                                                    </p>
                                                </div>
                                                <div className="flex flex-row items-center gap-2">
                                                    <p className="flex-none text-sm text-gray-500">
                                                        {item.scheduledDate
                                                            ? new Date(item.scheduledDate).toDateString()
                                                            : ""}
                                                    </p>
                                                </div>
                                                <div className="w-12 h-12 overflow-hidden rounded">
                                                    <div className="w-12 h-12 overflow-hidden rounded">
                                                        <ImageDialogTicket
                                                            src={item.ticketImage1 || "/noImage.jpg"}
                                                            alt={`${item.ticketImage1} Asset Image`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full items-center justify-between pt-2">
                                                <div className="flex items-center justify-end gap-2">
                                                    {item.completedDate ? (
                                                        <WhatsAppLinkButtonTable
                                                            numbers={whatsappNumbers}
                                                            message={dynamicMessage}
                                                            disabled
                                                        />
                                                    ) : (
                                                        <WhatsAppLinkButtonTable
                                                            numbers={whatsappNumbers}
                                                            message={dynamicMessage}
                                                        />
                                                    )}

                                                    {item.scheduledDate ? (
                                                        <DeleteAlertTicket id={item.id} disabled />
                                                    ) : (
                                                        <DeleteAlertTicket id={item.id} />
                                                    )}
                                                    <TicketDialog ticket={item} />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                    </div>

                    {/* Tampilan Desktop */}
                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                        <TableHeader>
                            <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                <TableHead className="text-black dark:text-white">No</TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Ticket Number
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Trouble User
                                </TableHead>
                                <TableHead></TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Analisa Technician
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Action Technician
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Priority Status
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Ticket Status
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Check Date
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Complete Date
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    User Ticket
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Asset Name
                                </TableHead>
                                <TableHead className="text-black dark:text-white">
                                    Asset Image
                                </TableHead>
                                <TableHead className="text-black dark:text-white text-center">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[12px] border-none">
                            {Array.isArray(data) &&
                                data.map((item, index) => {
                                    const dynamicMessage = `Saya telah membuka ticket maintenance mohon di cek.
Ticket Number: ${item.ticketNumber}
Asset Name: ${item.asset.product.part_name}`;
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-center">
                                                {offset + index + 1}
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-nowrap">
                                                {item.ticketNumber}
                                            </TableCell>
                                            <TableCell>
                                                <ReadMoreText text={item.troubleUser} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-12 h-12 overflow-hidden rounded">
                                                    <ImageDialogTicket
                                                        src={item.ticketImage1 || "/noImage.jpg"}
                                                        alt={`${item.ticketImage1} Asset Image`}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <ReadMoreText text={item.analisaDescription ?? ""} />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <ReadMoreText text={item.actionDescription ?? ""} />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.priorityStatus}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={`
                            font-mono tracking-widest uppercase
                            ${item.status === "Pending"
                                                            ? "bg-red-100 text-red-500"
                                                            : item.status === "Assigned"
                                                                ? "bg-blue-100 text-blue-500"
                                                                : item.status === "In_Progress"
                                                                    ? "bg-orange-100 text-orange-500"
                                                                    : item.status === "Completed"
                                                                        ? "bg-green-100 text-green-500"
                                                                        : item.status === "Canceled"
                                                                            ? "bg-red-100 text-red-500"
                                                                            : "bg-gray-100 text-gray-500"
                                                        }
                          `}
                                                >
                                                    {item.status.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {item.scheduledDate
                                                    ? new Date(item.scheduledDate).toDateString()
                                                    : ""}
                                            </TableCell>
                                            <TableCell>
                                                {item.completedDate
                                                    ? new Date(item.completedDate).toDateString()
                                                    : ""}
                                            </TableCell>
                                            <TableCell>{item.employee.name}</TableCell>
                                            <TableCell>{item.asset.product.part_name}</TableCell>
                                            <TableCell className="flex whitespace-nowrap gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-12 overflow-hidden rounded">
                                                        <ImageDialog
                                                            src={item.asset.assetImage1 || "/noImage.jpg"}
                                                            alt={`${item.asset.assetNumber} Asset Image`}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center object-center gap-2">
                                                    <WhatsAppLinkButtonTable
                                                        numbers={whatsappNumbers}
                                                        message={dynamicMessage}
                                                    />
                                                    {item.scheduledDate ? (
                                                        <DeleteAlertTicket id={item.id} disabled />
                                                    ) : (
                                                        <DeleteAlertTicket id={item.id} />
                                                    )}
                                                    <TicketDialog ticket={item} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
