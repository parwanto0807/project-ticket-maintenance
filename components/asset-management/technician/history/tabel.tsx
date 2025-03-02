"use server";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchTicketListHistory } from "@/data/asset/ticket";
import { Badge } from "@/components/ui/badge";
import { TicketDialog } from "./dialog-ticket-detail";
import { AlertCircle, AlertOctagon, AlertTriangle, ArrowDownCircle, CheckCircle, Clock, Loader2, UserCheck, XCircle } from "lucide-react";
import ReadMoreText from "./read-more";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ITEMS_PER_PAGE_PRODUCT = 15;

export default async function HistoryTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const data = await fetchTicketListHistory(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;

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
                        <div className="md:hidden">
                            {Array.isArray(data) &&
                                data.map((data) => (
                                    <Card key={data.id} className="mb-2 w-full rounded-md p-2 bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
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
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>

                        <Table className="hidden w-full max-w-full mt-2 md:table">
                            <TableHeader>
                                <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
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
                                                    <TicketDialog ticket={data} />
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
    )
}