
import DeleteAlertTicket from "./alert-delete";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { fetchTicketList } from "@/data/asset/ticket";
import ImageDialog from "../asset/imageDialog";
import { Badge } from "@/components/ui/badge";
import { TicketDialog } from "./dialog-ticket-detail";
import ReadMoreText from "./read-more";

const ITEMS_PER_PAGE_PRODUCT = 15;

export default async function TicketTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const data = await fetchTicketList(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_PRODUCT;
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
                                            <Badge variant="destructive" className="absolute right-10 font-mono tracking-widest uppercase">
                                                {data.status}
                                            </Badge> &nbsp;
                                        </div>
                                        <div>
                                            <p className="text-sm pt-1">
                                                {data.asset.product.part_name}  &nbsp;
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
                                    <div className="w-full items-center justify-between pt-2">
                                        <div className="flex items-center justify-end gap-2 ">
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
                            <TableRow className="text-[10px] font-bold uppercase ">
                                <TableHead className="text-black dark:text-white">No</TableHead>
                                <TableHead className="text-black dark:text-white">Ticket Number</TableHead>
                                <TableHead className="text-black dark:text-white">Trouble User</TableHead>
                                <TableHead className="text-black dark:text-white">Analisa Technician</TableHead>
                                <TableHead className="text-black dark:text-white">Action Technician</TableHead>
                                <TableHead className="text-black dark:text-white">Priority Status</TableHead>
                                <TableHead className="text-black dark:text-white">Ticket Status</TableHead>
                                <TableHead className="text-black dark:text-white">Check Date</TableHead>
                                <TableHead className="text-black dark:text-white">Complete Date </TableHead>
                                <TableHead className="text-black dark:text-white">User Ticket</TableHead>
                                <TableHead className="text-black dark:text-white">Asset Name</TableHead>
                                <TableHead className="text-black dark:text-white">Asset Image</TableHead>
                                <TableHead className="text-black dark:text-white text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[12px] border-none">
                            {Array.isArray(data) && data.map((data, index) => (
                                <TableRow key={data.id}>
                                    <TableCell className="text-center">{offset + index + 1}</TableCell>
                                    <TableCell className="text-center font-bold text-nowrap">{data.ticketNumber}</TableCell>
                                    <TableCell><ReadMoreText text={data.troubleUser} /></TableCell>
                                    <TableCell><ReadMoreText text={data.analisaDescription ?? ""} /></TableCell>
                                    <TableCell className="text-center"><ReadMoreText text={data.actionDescription ?? ""} /></TableCell>
                                    <TableCell className="text-center">{data.priorityStatus}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="destructive" className="font-mono tracking-widest uppercase">
                                            {data.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell >{data.scheduledDate?.toDateString()}</TableCell>
                                    <TableCell >{data.completedDate?.toDateString()}</TableCell>
                                    <TableCell >{data.employee.name}</TableCell>
                                    <TableCell >{data.asset.product.part_name}</TableCell>
                                    <TableCell className="flex whitespace-nowrap gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-12 overflow-hidden rounded">
                                                <ImageDialog
                                                    src={data.asset.assetImage1 || "/noImage.jpg"}
                                                    alt={`${data.asset.assetNumber} Asset Image`}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center object-center gap-2">
                                            {data.scheduledDate ? (
                                                <DeleteAlertTicket id={data.id} disabled />
                                            ) : (
                                                <DeleteAlertTicket id={data.id} />
                                            )}
                                            <TicketDialog ticket={data} />
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