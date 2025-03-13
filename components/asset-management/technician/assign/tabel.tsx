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

const ITEMS_PER_PAGE_PRODUCT = 15;

export default async function AssignTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const data = await fetchTicketListAssign(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;
    const technician = await getTechniciansForData();

    return (
        <div className="mt-0 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-0 md:pt-0 md:table  bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                    <div className="md:hidden">
                        {Array.isArray(data) && data.map((data) => (
                            <div
                                key={data.id}
                                className="mb-1 w-full rounded-md p-3"
                            >
                                <div className="grid grid-cols-1 items-center justify-between border-b pb-1">
                                    <div>
                                        <div className="mb-2 flex items-center justify-between font-bold text-black dark:text-white">
                                            <Badge variant="secondary" className="font-mono tracking-widest uppercase h-10 border-orange-500">{data.ticketNumber}</Badge>  &nbsp;
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
                                            </Badge> &nbsp;
                                        </div>
                                        <div>
                                            <p className="text-sm pt-1 text-wrap">
                                                {<ReadMoreText text={data.asset.product.part_name} />}  &nbsp;
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="flex-none text-sm"> {data.priorityStatus}</p>  &nbsp;
                                            <p className="flex-none text-sm font-bold text-gray-500">{data.employee?.name}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">

                                            <p className="flex-nonetext-sm text-gray-500">{data.scheduledDate?.toDateString()}</p>
                                        </div>
                                        <div className="w-12 h-12 overflow-hidden rounded">
                                            <ImageDialog
                                                src={data.asset.assetImage1 || "/noImage.jpg"}
                                                alt={`${data.asset.assetNumber} Asset Image`}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full items-center justify-between pt-0">
                                        <span className="font-bold text-gray-700">Technician</span> &nbsp;
                                        <span>{data.technician?.name}</span>
                                        <div className="flex items-center justify-end gap-2 ">
                                            <TicketCompleteDialog ticketId={data.id} />
                                            <div>
                                                {data.technician ? (
                                                    <div className="flex items-center justify-between w-full">

                                                        <TicketMaintenanceUpdateSheet
                                                            ticketId={data.id}
                                                            technicians={technician} // array technician dari getTechniciansForData()
                                                            initialTechnicianId={data.technician.id}
                                                            initialScheduledDate={
                                                                data.scheduledDate
                                                                    ? new Date(data.scheduledDate).toISOString().split("T")[0]
                                                                    : ""
                                                            }
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={!!data.analisaDescription}  // Jika analisaDescription ada, disable tombol
                                                                className="flex items-center gap-2 text-blue-500 bg-white border border-blue-500 rounded-md px-3 py-1 transition-all duration-200 transform hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <FileEdit className="w-4 h-4" />
                                                                Change
                                                            </Button>
                                                        </TicketMaintenanceUpdateSheet>
                                                    </div>
                                                ) : (
                                                    <TicketMaintenanceUpdateSheet
                                                        ticketId={data.id}
                                                        technicians={technician}
                                                        initialScheduledDate={
                                                            data.scheduledDate
                                                                ? new Date(data.scheduledDate).toISOString().split("T")[0]
                                                                : ""
                                                        }
                                                    />
                                                )}
                                            </div>
                                            {data.scheduledDate ? (
                                                <DeleteAlertTicket id={data.id} disabled />
                                            ) : (
                                                <DeleteAlertTicket id={data.id} />
                                            )}
                                            <TicketDialog ticket={data} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Table className="hidden w-full max-w-full mt-2 md:table bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                        <TableHeader>
                            <TableRow className="text-[12px] font-bold uppercase bg-gradient-to-b from-orange-100 to-orange-200 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                                <TableHead className="text-black dark:text-white">No</TableHead>
                                <TableHead className="text-black dark:text-white text-center">Ticket Number</TableHead>
                                <TableHead className="text-black dark:text-white">Trouble User</TableHead>
                                <TableHead></TableHead>
                                <TableHead className="text-black dark:text-white">Analisa Technician</TableHead>
                                <TableHead></TableHead>
                                <TableHead className="text-black dark:text-white">Action Technician</TableHead>
                                <TableHead></TableHead>
                                <TableHead className="text-black dark:text-white">Schedule Check Date</TableHead>
                                <TableHead className="text-black dark:text-white">Complete Date </TableHead>
                                <TableHead className="text-black dark:text-white">User Ticket</TableHead>
                                <TableHead className="text-black dark:text-white text-center">Technician</TableHead>
                                <TableHead className="text-black dark:text-white">Asset Name</TableHead>
                                {/* <TableHead className="text-black dark:text-white">Asset Image</TableHead> */}
                                <TableHead className="text-black dark:text-white text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[12px] border-none">
                            {Array.isArray(data) && data.map((data, index) => (
                                <TableRow key={data.id}>
                                    <TableCell className="text-center">{offset + index + 1}</TableCell>
                                    <TableCell
                                        className="text-center font-bold text-nowrap">{data.ticketNumber} <br />
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
                                            {data.status.replace("_", " ")}
                                        </Badge> <br />
                                        <div className="flex items-center justify-center gap-1">
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
                                    <TableCell><ReadMoreText text={data.troubleUser} /></TableCell>
                                    <TableCell>
                                        <div className="w-12 h-12 overflow-hidden rounded">
                                            <ImageDialogTicket
                                                src={data.ticketImage1 || "/noImage.jpg"}
                                                alt={`${data.ticketImage1} Asset Image`}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell><ReadMoreText text={data.analisaDescription ?? ""} /></TableCell>
                                    <TableCell>
                                        <div className="w-12 h-12 overflow-hidden rounded">
                                            <ImageDialogTicket
                                                src={data.ticketImage2 || "/noImage.jpg"}
                                                alt={`${data.ticketImage2} Asset Image`}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center"><ReadMoreText text={data.actionDescription ?? ""} /></TableCell>
                                    <TableCell>
                                        <div className="w-12 h-12 overflow-hidden rounded">
                                            <ImageDialogTicket
                                                src={data.ticketImage3 || "/noImage.jpg"}
                                                alt={`${data.ticketImage3} Asset Image`}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell >{data.scheduledDate?.toDateString()}</TableCell>
                                    <TableCell >{data.completedDate?.toDateString()}</TableCell>
                                    <TableCell >
                                        <Badge variant="destructive">
                                            {data.employee.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {data.technician ? (
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-bold text-gray-700">{data.technician.name}</span>
                                                <TicketMaintenanceUpdateSheet
                                                    ticketId={data.id}
                                                    technicians={technician} // array technician dari getTechniciansForData()
                                                    initialTechnicianId={data.technician.id}
                                                    initialScheduledDate={
                                                        data.scheduledDate
                                                            ? new Date(data.scheduledDate).toISOString().split("T")[0]
                                                            : ""
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={!!data.analisaDescription}  // Jika analisaDescription ada, disable tombol
                                                        className="flex items-center gap-2 text-blue-500 bg-white border border-blue-500 rounded-md px-3 py-1 transition-all duration-200 transform hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FileEdit className="w-4 h-4" />
                                                        Change
                                                    </Button>
                                                </TicketMaintenanceUpdateSheet>
                                            </div>
                                        ) : (
                                            <TicketMaintenanceUpdateSheet
                                                ticketId={data.id}
                                                technicians={technician}
                                                initialScheduledDate={
                                                    data.scheduledDate
                                                        ? new Date(data.scheduledDate).toISOString().split("T")[0]
                                                        : ""
                                                }
                                            />
                                        )}
                                    </TableCell>



                                    <TableCell >{data.asset.product.part_name}</TableCell>
                                    {/* <TableCell className="flex whitespace-nowrap gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-12 overflow-hidden rounded">
                                                <ImageDialog
                                                    src={data.asset.assetImage1 || "/noImage.jpg"}
                                                    alt={`${data.asset.assetNumber} Asset Image`}
                                                />
                                            </div>
                                        </div>
                                    </TableCell> */}
                                    <TableCell>
                                        <div className="flex items-center justify-center object-center gap-2">
                                            {data.scheduledDate ? (
                                                <DeleteAlertTicket id={data.id} disabled />
                                            ) : (
                                                <DeleteAlertTicket id={data.id} />
                                            )}
                                            <TicketDialog ticket={data} />

                                            {data.actionDescription && data.actionDescription.trim() !== "" ?(
                                                <TicketCompleteDialog
                                                    ticketId={data.id}
                                                />
                                            ) : (
                                                <TicketCompleteDialog 
                                                ticketId={data.id} 
                                                disabled
                                            />
                                            )}

                                        </div>
                                    </TableCell>

                                </TableRow >
                            ))}

                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}