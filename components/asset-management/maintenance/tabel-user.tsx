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
import { cn } from "@/lib/utils";
import {
    FaTicketAlt,
    FaExclamationCircle,
    FaCalendarAlt,
    FaUser,
    FaTools,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaImage,
    FaWrench,
    FaCog
} from "react-icons/fa";
import { motion } from "framer-motion";
import Pagination from "@/components/ui/pagination";
import { CardSkeleton, TableSkeleton } from "@/components/skeleton/common-skeleton";

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
    const [totalPages, setTotalPages] = useState<number>(1);

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
                const res = await fetch(
                    `/api/ticket-list?query=${encodeURIComponent(query)}&currentPage=${currentPage}&email=${encodeURIComponent(email)}`
                );
                if (!res.ok) {
                    throw new Error("Gagal mengambil data tiket");
                }
                const json = await res.json();

                // Cek struktur response yang sebenarnya
                console.log("API Response:", json);

                // Coba beberapa kemungkinan struktur response
                if (json.tickets) {
                    // Jika response memiliki property tickets
                    setData(json.tickets);
                    setTotalPages(json.totalPages || 1);
                } else if (Array.isArray(json)) {
                    // Jika response langsung array
                    setData(json);
                    setTotalPages(1);
                } else {
                    // Fallback ke array kosong
                    setData([]);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error("Error fetching ticket list:", error);
                setData([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        }

        if (email) {
            fetchData();
        }
    }, [query, currentPage, email]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed":
                return <FaCheckCircle className="w-4 h-4 text-green-500" />;
            case "In_Progress":
                return <FaWrench className="w-4 h-4 text-orange-500" />;
            case "Assigned":
                return <FaCog className="w-4 h-4 text-blue-500" />;
            case "Pending":
                return <FaClock className="w-4 h-4 text-yellow-500" />;
            case "Canceled":
                return <FaExclamationTriangle className="w-4 h-4 text-red-500" />;
            default:
                return <FaTicketAlt className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-2";

        switch (status) {
            case "Completed":
                return `${baseClasses} bg-green-50 text-green-700 border border-green-200`;
            case "In_Progress":
                return `${baseClasses} bg-orange-50 text-orange-700 border border-orange-200`;
            case "Assigned":
                return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
            case "Pending":
                return `${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`;
            case "Canceled":
                return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
            default:
                return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

        switch (priority?.toLowerCase()) {
            case "high":
                return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
            case "medium":
                return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
            case "low":
                return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
        }
    };

    if (loading) {
        return (
            <div className="mt-6 space-y-4">
                <div className="md:hidden space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
                <div className="hidden md:block">
                    <TableSkeleton rows={10} />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-xl p-0.5 md:pt-4 bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-lg border border-orange-100 dark:border-slate-700 mx-auto max-w-7xl">

                    {/* Mobile View: Cards */}
                    <div className="md:hidden grid grid-cols-1 gap-4 p-0.5">
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((item) => {
                                const dynamicMessage = `Halo, saya ingin menanyakan status ticket maintenance:\n\nTicket Number: ${item.ticketNumber}\nAsset: ${item.asset.product.part_name}\nStatus: ${item.status}`;

                                return (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300">
                                            <div className="p-4">
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 rounded-lg bg-orange-500 text-white shadow-sm">
                                                            <FaTicketAlt className="w-3 h-3" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-[10px] text-slate-900 dark:text-white uppercase tracking-tighter">
                                                                {item.ticketNumber}
                                                            </span>
                                                            <div className={cn(getPriorityBadge(item.priorityStatus), "mt-0.5 text-[8px] font-black uppercase tracking-widest px-1.5 py-0")}>
                                                                {item.priorityStatus}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={cn(getStatusBadge(item.status), "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest")}>
                                                        {getStatusIcon(item.status)}
                                                        <span>
                                                            {item.status.replace("_", " ")}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <FaExclamationCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-[10px] font-black text-slate-800 dark:text-white truncate uppercase tracking-tight">
                                                                {item.asset.product.part_name}
                                                            </p>
                                                            <p className="text-[8px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-tighter">
                                                                {item.asset.assetNumber}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                                        <div className="flex items-center gap-2">
                                                            <FaUser className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" />
                                                            <span className="text-[9px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-tighter truncate">
                                                                {item.employee.name}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <FaCalendarAlt className="w-2.5 h-2.5 text-purple-500 flex-shrink-0" />
                                                            <span className="text-[9px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-tighter">
                                                                {item.scheduledDate
                                                                    ? new Date(item.scheduledDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
                                                                    : "Pending"
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {item.technician && (
                                                        <div className="flex items-center gap-2">
                                                            <FaTools className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                                                            <span className="text-[9px] font-bold text-slate-600 dark:text-gray-300 uppercase tracking-tighter">
                                                                Tech: {item.technician.name}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-3">
                                                        <FaCalendarAlt className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {item.scheduledDate
                                                                ? new Date(item.scheduledDate).toLocaleDateString()
                                                                : "Belum dijadwalkan"
                                                            }
                                                        </span>
                                                    </div>

                                                    {/* Trouble Description */}
                                                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 border border-slate-100 dark:border-slate-700/30">
                                                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                                                            Description:
                                                        </p>
                                                        <div className="text-[9px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-tight leading-relaxed">
                                                            <ReadMoreText text={item.troubleUser} />
                                                        </div>
                                                    </div>

                                                    {/* Images */}
                                                    <div className="flex gap-2">
                                                        {[item.ticketImage1, item.ticketImage2, item.ticketImage3].map((image, index) => (
                                                            image && (
                                                                <div key={index} className="w-16 h-16 rounded-lg border-2 border-orange-200 dark:border-slate-600 overflow-hidden">
                                                                    <ImageDialogTicket
                                                                        src={image}
                                                                        alt={`Ticket Image ${index + 1}`}
                                                                    />
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-slate-600">
                                                    <TicketDialog ticket={item} />
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
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <FaTicketAlt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Tidak ada tiket ditemukan</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block">
                        <Card className="border-0 bg-transparent shadow-none">
                            <Card className="mb-6 border-0 bg-gradient-to-r from-orange-500 to-amber-500">
                                <div className="p-6 text-center">
                                    <div className="inline-flex items-center gap-3 mb-2">
                                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                            <FaTicketAlt className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">
                                            Maintenance Tickets
                                        </h2>
                                    </div>
                                    <p className="text-orange-100 text-sm">
                                        Kelola dan pantau tiket maintenance peralatan Anda
                                    </p>
                                </div>
                            </Card>

                            <div className="rounded-xl border border-orange-100 dark:border-slate-700 overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-500 border-0">
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 text-center border-0 w-12">
                                                #
                                            </TableHead>
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                                                <div className="flex items-center gap-2">
                                                    <FaTicketAlt className="w-3 h-3" />
                                                    Ticket Info
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                                                <div className="flex items-center gap-2">
                                                    <FaExclamationCircle className="w-3 h-3" />
                                                    Issue
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-center">
                                                <div className="flex items-center gap-2 justify-center">
                                                    <FaImage className="w-3 h-3" />
                                                    Evidence
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-center">
                                                Priority
                                            </TableHead>
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-center">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    Schedule
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 border-0">
                                                Asset
                                            </TableHead>
                                            <TableHead className="text-white font-bold uppercase text-xs py-4 border-0 text-center">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white/80 dark:bg-slate-800/80">
                                        {Array.isArray(data) && data.length > 0 ? (
                                            data.map((item, index) => {
                                                const dynamicMessage = `Halo, saya ingin menanyakan status ticket maintenance:\n\nTicket Number: ${item.ticketNumber}\nAsset: ${item.asset.product.part_name}\nStatus: ${item.status}`;

                                                return (
                                                    <TableRow
                                                        key={item.id}
                                                        className="border-b border-orange-50 dark:border-slate-700/50 hover:bg-orange-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                                    >
                                                        <TableCell className="text-center text-sm font-medium text-gray-900 dark:text-white py-4">
                                                            {offset + index + 1}
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <FaTicketAlt className="w-3 h-3 text-orange-500" />
                                                                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                                                                        {item.ticketNumber}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <FaUser className="w-3 h-3" />
                                                                    {item.employee.name}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4 max-w-xs">
                                                            <div className="space-y-2">
                                                                <ReadMoreText
                                                                    text={item.troubleUser}
                                                                />
                                                                {item.analisaDescription && (
                                                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                                                                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                                                                            Analisa Teknisi:
                                                                        </p>
                                                                        <ReadMoreText
                                                                            text={item.analisaDescription}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex justify-center gap-1">
                                                                {[item.ticketImage1, item.ticketImage2, item.ticketImage3]
                                                                    .filter(Boolean)
                                                                    .map((image, idx) => (
                                                                        <div key={idx} className="w-10 h-10 rounded border border-orange-200 dark:border-slate-600 overflow-hidden">
                                                                            <ImageDialogTicket
                                                                                src={image!}
                                                                                alt={`Evidence ${idx + 1}`}
                                                                            />
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center py-4">
                                                            <Badge className={getPriorityBadge(item.priorityStatus)}>
                                                                {item.priorityStatus}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex justify-center">
                                                                <div className={getStatusBadge(item.status)}>
                                                                    {getStatusIcon(item.status)}
                                                                    <span className="text-xs">
                                                                        {item.status.replace("_", " ")}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="space-y-1 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <FaCalendarAlt className="w-3 h-3 text-purple-500" />
                                                                    <span className="text-gray-700 dark:text-gray-300">
                                                                        {item.scheduledDate
                                                                            ? new Date(item.scheduledDate).toLocaleDateString()
                                                                            : "Belum dijadwalkan"
                                                                        }
                                                                    </span>
                                                                </div>
                                                                {item.completedDate && (
                                                                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                                                                        <FaCheckCircle className="w-3 h-3" />
                                                                        Selesai: {new Date(item.completedDate).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded border border-orange-200 dark:border-slate-600 overflow-hidden">
                                                                    <ImageDialog
                                                                        src={item.asset.assetImage1 || "/noImage.jpg"}
                                                                        alt={item.asset.assetNumber}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                                        {item.asset.product.part_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {item.asset.assetNumber}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex justify-center gap-2">
                                                                <TicketDialog ticket={item} />
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
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FaTicketAlt className="w-8 h-8 text-gray-300" />
                                                        Tidak ada tiket ditemukan
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 px-4">
                            <Pagination totalPages={totalPages} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}