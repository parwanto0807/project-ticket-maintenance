"use server";

import DeleteAlertTicket from "./alert-delete";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchTicketListAssign } from "@/data/asset/ticket";
import ImageDialog from "../../asset/imageDialog";
import { Badge } from "@/components/ui/badge";
import { TicketDialog } from "./dialog-ticket-detail";
import ReadMoreText from "../../maintenance/read-more";
import TicketMaintenanceUpdateSheet from "./sheet-assign";
import { getTechniciansForData } from "@/data/asset/technician";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertOctagon, AlertTriangle, ArrowDownCircle, FileEdit } from "lucide-react";
import TicketCompleteDialog from "./closing-button";
import ImageDialogTicket from "../../maintenance/imageDialogTicket";
import { ITEMS_PER_PAGE } from '@/lib/constants';


const ITEMS_PER_PAGE_PRODUCT = ITEMS_PER_PAGE;

export default async function AssignTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const data = await fetchTicketListAssign(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;
    const technician = await getTechniciansForData();

    return (
        <div className="w-full mt-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-800"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <Badge variant="outline" className="font-mono text-[10px] tracking-tight border-blue-200 text-blue-600 bg-blue-50/50">
                                    {item.ticketNumber}
                                </Badge>
                                <Badge
                                    className={`
                                        text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full
                                        ${item.status === "Pending" ? "bg-red-50 text-red-600 border border-red-100" :
                                            item.status === "Assigned" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                                item.status === "In_Progress" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                    item.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                        "bg-gray-50 text-gray-600 border border-gray-100"}
                                    `}
                                >
                                    {item.status.replace("_", " ")}
                                </Badge>
                            </div>

                            <div className="flex gap-3 mb-4">
                                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-100">
                                    <ImageDialog
                                        src={item.asset.assetImage1 || "/noImage.jpg"}
                                        alt={item.asset.assetNumber}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                        {item.asset.product.part_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                        {item.troubleUser}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-gray-50 dark:border-slate-800">
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Priority</p>
                                    <div className="flex items-center gap-1.5">
                                        {item.priorityStatus === "Low" && <ArrowDownCircle className="w-3.5 h-3.5 text-green-500" />}
                                        {item.priorityStatus === "Medium" && <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />}
                                        {item.priorityStatus === "High" && <AlertOctagon className="w-3.5 h-3.5 text-orange-500" />}
                                        {item.priorityStatus === "Critical" && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                                        <span className="text-xs font-medium">{item.priorityStatus}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Technician</p>
                                    <p className="text-xs font-medium truncate">{item.technician?.name || "Unassigned"}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800 gap-2">
                                <div className="flex gap-1.5">
                                    <TicketDialog ticket={item} />
                                    {!item.scheduledDate && <DeleteAlertTicket id={item.id} />}
                                    {item.actionDescription && item.actionDescription.trim() !== "" && (
                                        <TicketCompleteDialog ticketId={item.id} />
                                    )}
                                </div>
                                <div>
                                    <TicketMaintenanceUpdateSheet
                                        ticketId={item.id}
                                        technicians={technician}
                                        initialTechnicianId={item.technician?.id}
                                        initialScheduledDate={item.scheduledDate ? new Date(item.scheduledDate).toISOString().split("T")[0] : ""}
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={!!item.analisaDescription}
                                            className="h-8 text-[11px] font-bold border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            {item.technician ? "Change Tech" : "Assign Tech"}
                                        </Button>
                                    </TicketMaintenanceUpdateSheet>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                        <FileEdit className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No tickets found</p>
                    </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                            <TableHead className="w-12 text-center text-[11px] font-bold uppercase text-gray-500">No</TableHead>
                            <TableHead className="w-48 text-[11px] font-bold uppercase text-gray-500">Ticket Detail</TableHead>
                            <TableHead className="text-[11px] font-bold uppercase text-gray-500">Asset & Issue</TableHead>
                            <TableHead className="w-48 text-[11px] font-bold uppercase text-gray-500">Assignment</TableHead>
                            <TableHead className="w-40 text-[11px] font-bold uppercase text-gray-500">Timeline</TableHead>
                            <TableHead className="w-32 text-center text-[11px] font-bold uppercase text-gray-500">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow key={item.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-gray-100 dark:border-slate-800 last:border-0">
                                    <TableCell className="text-center font-medium text-gray-400">
                                        {offset + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1.5">
                                            <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                {item.ticketNumber}
                                            </div>
                                            <Badge
                                                className={`
                                                    text-[10px] font-bold uppercase h-5
                                                    ${item.status === "Pending" ? "bg-red-50 text-red-600 border-red-100" :
                                                        item.status === "Assigned" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            item.status === "In_Progress" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                item.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                    "bg-gray-50 text-gray-600 border-gray-100"}
                                                `}
                                                variant="outline"
                                            >
                                                {item.status.replace("_", " ")}
                                            </Badge>
                                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                                                {item.priorityStatus === "Low" && <ArrowDownCircle className="w-3 h-3 text-green-500" />}
                                                {item.priorityStatus === "Medium" && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                                                {item.priorityStatus === "High" && <AlertOctagon className="w-3 h-3 text-orange-500" />}
                                                {item.priorityStatus === "Critical" && <AlertCircle className="w-3 h-3 text-red-500" />}
                                                {item.priorityStatus}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                                <ImageDialog
                                                    src={item.asset.assetImage1 || "/noImage.jpg"}
                                                    alt={item.asset.assetNumber}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">
                                                    {item.asset.product.part_name}
                                                </div>
                                                <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                    {item.troubleUser}
                                                </div>
                                                <div className="flex gap-2 mt-1.5">
                                                    {item.ticketImage1 && (
                                                        <div className="w-6 h-6 rounded border border-gray-100 overflow-hidden cursor-zoom-in">
                                                            <ImageDialogTicket src={item.ticketImage1} alt="Report" />
                                                        </div>
                                                    )}
                                                    {item.ticketImage2 && (
                                                        <div className="w-6 h-6 rounded border border-gray-100 overflow-hidden cursor-zoom-in">
                                                            <ImageDialogTicket src={item.ticketImage2} alt="Analysis" />
                                                        </div>
                                                    )}
                                                    {item.ticketImage3 && (
                                                        <div className="w-6 h-6 rounded border border-gray-100 overflow-hidden cursor-zoom-in">
                                                            <ImageDialogTicket src={item.ticketImage3} alt="Action" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-[10px] uppercase text-gray-400 font-bold mb-0.5">Reported By</p>
                                                <p className="text-xs font-semibold">{item.employee.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-gray-400 font-bold mb-0.5">Technician</p>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 truncate">
                                                        {item.technician?.name || "Needs Assignment"}
                                                    </span>
                                                    <TicketMaintenanceUpdateSheet
                                                        ticketId={item.id}
                                                        technicians={technician}
                                                        initialTechnicianId={item.technician?.id}
                                                        initialScheduledDate={item.scheduledDate ? new Date(item.scheduledDate).toISOString().split("T")[0] : ""}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={!!item.analisaDescription}
                                                            className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <FileEdit className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </TicketMaintenanceUpdateSheet>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-[10px] uppercase text-gray-400 font-bold mb-0.5">Scheduled</p>
                                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    {item.scheduledDate ? item.scheduledDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                                                </p>
                                            </div>
                                            {item.completedDate && (
                                                <div>
                                                    <p className="text-[10px] uppercase text-gray-400 font-bold mb-0.5">Completed</p>
                                                    <p className="text-xs font-medium text-emerald-600">
                                                        {item.completedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1.5">
                                            <TicketDialog ticket={item} />
                                            {item.scheduledDate ? (
                                                <DeleteAlertTicket id={item.id} disabled />
                                            ) : (
                                                <DeleteAlertTicket id={item.id} />
                                            )}
                                            {item.actionDescription && item.actionDescription.trim() !== "" ? (
                                                <TicketCompleteDialog ticketId={item.id} />
                                            ) : (
                                                <TicketCompleteDialog ticketId={item.id} disabled />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <FileEdit className="w-12 h-12 mb-2 opacity-20" />
                                        <p>No tickets available</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
