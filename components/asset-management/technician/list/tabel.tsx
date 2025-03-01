import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteAlertTechnician from "./alert-delete-technician";
import { getTechnicians } from "@/data/asset/technician";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TechnicianStatus } from "@prisma/client";

const ITEMS_PER_PAGE_TECHNICIAN = 15;

export default async function TechnicianTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const data = await getTechnicians(query, currentPage);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_TECHNICIAN;

    return (
        <div className="flex justify-center items-center mt-6">
            <Card className="w-full max-w-8xl shadow-lg border rounded-lg bg-gradient-to-b from-orange-50 to-orange-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-950">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold text-gray-800 dark:text-gray-200">
                        Technician List
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-hidden rounded-lg">
                        {/* Mobile View */}
                        <div className="md:hidden">
                            {Array.isArray(data) && data.map((technician) => (
                                <div
                                    key={technician.id}
                                    className="mb-2 w-full rounded-md p-3 border bg-gray-100 dark:bg-gray-800"
                                >
                                    <div className="grid grid-cols-1 items-center justify-between border-b pb-2">
                                        <div>
                                            <div className="mb-2 flex items-center justify-between font-bold text-black dark:text-white">
                                                <Badge variant="secondary" className="font-mono tracking-widest uppercase h-10 border-blue-500">
                                                    {technician.name}
                                                </Badge>
                                                <Badge
                                                    className={`
        absolute right-10 font-mono tracking-widest uppercase px-3 py-1 rounded-md 
        ${technician.status === TechnicianStatus.ACTIVE ? "bg-green-500 text-white" : "bg-red-500 text-white"}
    `}
                                                >
                                                    {technician.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm pt-1">{technician.specialization}</p>
                                            <p className="text-sm font-bold text-gray-500">{technician.email}</p>
                                            <p className="text-sm text-gray-500">{technician.phone}</p>
                                        </div>
                                        <div className="w-full flex justify-end pt-2">
                                            <DeleteAlertTechnician id={technician.id} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View */}
                        <Table className="hidden w-full max-w-full mt-2 md:table bg-white dark:bg-gray-900">
                            <TableHeader>
                                <TableRow className="text-[10px] font-bold uppercase bg-gray-200 dark:bg-gray-700">
                                    <TableHead className="text-black dark:text-white text-center">#</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Name</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Specialization</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Phone</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Email</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Status</TableHead>
                                    <TableHead className="text-black dark:text-white text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-[12px] border-none">
                                {Array.isArray(data) && data.map((technician, index) => (
                                    <TableRow key={technician.id}>
                                        <TableCell className="text-center">{offset + index + 1}</TableCell>
                                        <TableCell className="font-bold text-nowrap">{technician.name}</TableCell>
                                        <TableCell>{technician.specialization}</TableCell>
                                        <TableCell >{technician.phone || "-"}</TableCell>
                                        <TableCell >{technician.email || "-"}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                className={`${technician.status === TechnicianStatus.ACTIVE ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                                {technician.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <DeleteAlertTechnician id={technician.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
