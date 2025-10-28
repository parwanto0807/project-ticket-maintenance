"use server";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchTicketListSchedule } from "@/data/asset/ticket";
import { Badge } from "@/components/ui/badge";
import { TicketDialog } from "./dialog-ticket-detail";
import TicketMaintenanceUpdateSheet from "./sheet-assign";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertOctagon, AlertTriangle, ArrowDownCircle, CheckCircle, Clock, FileEdit, Loader2, UserCheck, XCircle } from "lucide-react";
import ReadMoreText from "./read-more";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ITEMS_PER_PAGE_PRODUCT = 15;

export default async function AssignTable({ query, currentPage }: { query: string; currentPage: number; }) {

    const dataSource = await fetchTicketListSchedule(query, currentPage);
    const data = Array.isArray(dataSource) ? dataSource : [];
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;

    return (
        <div className="mt-0 flow-root">
            <div className="mx-auto max-w-8xl">
                <Card className="p-2 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    <CardHeader className="px-4 py-2">
                        <CardTitle className="text-lg font-bold text-center">
                            Technician Schedule Tickets.
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="md:hidden">
                            {Array.isArray(data) &&
                                data.map((data) => (
                                    <Card key={data.id} className="mb-2 w-full rounded-md p-2 bg-gradient-to-b from-blue-100 to-blue-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                        <div className="grid grid-cols-1 items-center justify-between pb-1">
                                            <div>
                                                <div className="mb-2 flex items-center justify-between font-bold text-black dark:text-white">
                                                    <Badge variant="secondary" className="font-mono tracking-widest uppercase h-10 border-orange-500">
                                                        {data.ticketNumber}
                                                    </Badge>
                                                    &nbsp;
                                                    <Badge
                                                        className={`
                                          absolute right-8 font-mono tracking-widest uppercase
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
                                                        {data.status.replace("_", " ")}
                                                    </Badge>
                                                    &nbsp;
                                                </div>
                                                <div>
                                                    <p className="text-sm pt-1">
                                                        {data.asset.product.part_name} &nbsp;
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="flex-none text-sm"> {data.priorityStatus}</p>
                                                    &nbsp;
                                                    <p className="flex-none text-sm font-bold text-gray-500">{data.employee?.name}</p>
                                                </div>
                                                <div className="flex flex-row items-center gap-2">
                                                    <p className="flex-nonetext-sm text-gray-500">
                                                        {data.scheduledDate?.toDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-start justify-start ">
                                                    <p className="text-gray-500 font-bold">Teknisi : {data.technician?.name}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-end justify-end gap-2">
                                                    <TicketDialog ticket={data} />
                                                    <TicketMaintenanceUpdateSheet
                                                        ticketId={data.id}
                                                        technicians={data.technician ? [data.technician] : []}
                                                        initialTicketImage1={data.ticketImage1 ?? undefined}
                                                        initialTicketImage2={data.ticketImage2 ?? undefined}
                                                        initialTicketImage3={data.ticketImage3 ?? undefined}
                                                        initialTroubleUser={data.troubleUser}
                                                        initialTechnicianId={data.technicianId ? data.technicianId : ""}
                                                        initialScheduledDate={
                                                            data.scheduledDate
                                                                ? new Date(data.scheduledDate).toISOString().split("T")[0]
                                                                : ""
                                                        }
                                                        initialAnalisaDescription={data.analisaDescription || ""}
                                                        initialActionDescription={data.actionDescription || ""}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            disabled={!data.scheduledDate}
                                                            className="flex items-center gap-2 text-blue-500 bg-white border border-blue-500 rounded-md px-3 py-1 transition-all duration-200 transform hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <FileEdit className="w-4 h-4" />
                                                            Action
                                                        </Button>
                                                    </TicketMaintenanceUpdateSheet>

                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>

                        <Table className="hidden w-full max-w-full mt-2 md:table">
                            <TableHeader>
                                <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-blue-100 to-blue-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                    <TableHead className="text-black dark:text-white">No</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Ticket</TableHead>
                                    <TableHead className="text-black dark:text-white">Title</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Status</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Priority</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Schedule Action</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-[12px] border-none">
                                {Array.isArray(data) &&
                                    data.map((data, index) => (
                                        <TableRow key={data.id}>
                                            <TableCell className="text-center">{offset + index + 1}</TableCell>
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
                                                <Badge variant="outline" className="font-mono bg-slate-100 dark:text-black ">
                                                    {data.employee.name}
                                                </Badge>
                                                &nbsp;
                                                <Badge variant="outline" className="font-mono bg-slate-100 dark:text-black ">
                                                    {data.asset.location}
                                                </Badge>
                                                &nbsp;
                                                <ReadMoreText text={data.troubleUser} />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {data.status === "Pending" && (
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                    )}
                                                    {data.status === "Assigned" && (
                                                        <UserCheck className="w-4 h-4 text-blue-500" />
                                                    )}
                                                    {data.status === "In_Progress" && (
                                                        <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                                                    )}
                                                    {data.status === "Completed" && (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    )}
                                                    {data.status === "Canceled" && (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                    <span className="ml-1">{data.status.replace("_", " ")}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-start justify-start gap-1">
                                                    {data.priorityStatus === "Low" && (
                                                        <ArrowDownCircle className="w-4 h-4 text-green-500" />
                                                    )}
                                                    {data.priorityStatus === "Medium" && (
                                                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                                    )}
                                                    {data.priorityStatus === "High" && (
                                                        <AlertOctagon className="w-4 h-4 text-orange-500" />
                                                    )}
                                                    {data.priorityStatus === "Critical" && (
                                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                    <span>{data.priorityStatus}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{data.scheduledDate?.toDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <TicketMaintenanceUpdateSheet
                                                        ticketId={data.id}
                                                        technicians={data.technician ? [data.technician] : []}
                                                        initialTechnicianId={data.technicianId ? data.technicianId : ""}
                                                        initialScheduledDate={
                                                            data.scheduledDate
                                                                ? new Date(data.scheduledDate).toISOString().split("T")[0]
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
                                                            className="flex items-center gap-2 text-blue-500 bg-white border border-blue-500 rounded-md px-3 py-1 transition-all duration-200 transform hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <FileEdit className="w-4 h-4" />
                                                            Action
                                                        </Button>
                                                    </TicketMaintenanceUpdateSheet>
                                                    <TicketDialog ticket={data} />
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="flex justify-end items-end w-full p-2">
                    <Link href="/dashboard">
                        <Button variant="destructive" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}