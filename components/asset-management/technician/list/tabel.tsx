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
import { TechnicianStatus } from "@prisma/client";
import { Mail, Phone, ShieldCheck, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function TechnicianTable({ query, currentPage }: { query: string; currentPage: number; }) {
    const data = await getTechnicians(query, currentPage);

    return (
        <div className="w-full">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Mobile View */}
                <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800/50">
                    {Array.isArray(data) && data.map((technician) => (
                        <div
                            key={technician.id}
                            className="p-4 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300"
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                            <UserCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">{technician.name}</div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{technician.specialization}</div>
                                        </div>
                                    </div>
                                    <Badge
                                        className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                            technician.status === TechnicianStatus.ACTIVE
                                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800"
                                                : "bg-slate-500/10 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-800"
                                        )}
                                    >
                                        {technician.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                        <Mail className="w-3.5 h-3.5 opacity-60" />
                                        <span className="truncate">{technician.email || "-"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                                        <Phone className="w-3.5 h-3.5 opacity-60" />
                                        <span>{technician.phone || "-"}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <DeleteAlertTechnician id={technician.id} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800">
                                <TableHead className="w-16 h-12 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">#</TableHead>
                                <TableHead className="h-12 text-[11px] font-black uppercase tracking-widest text-slate-400">Technician</TableHead>
                                <TableHead className="h-12 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Specialization</TableHead>
                                <TableHead className="h-12 text-[11px] font-black uppercase tracking-widest text-slate-400">Contact Details</TableHead>
                                <TableHead className="h-12 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Status</TableHead>
                                <TableHead className="h-12 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(data) && data.map((technician, index) => (
                                <TableRow
                                    key={technician.id}
                                    className="bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300 group"
                                >
                                    <TableCell className="text-center font-bold text-slate-400 py-4 border-b border-slate-50 dark:border-slate-800/30">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500/30 transition-colors duration-300">
                                                <UserCircle2 className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[13px] text-slate-900 dark:text-white">{technician.name}</div>
                                                <div className="text-[10px] font-medium text-slate-500 opacity-70">Joined: {new Date(technician.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30 text-center">
                                        <Badge variant="outline" className="text-[10px] font-bold border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                            {technician.specialization}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                                <Mail className="w-3.5 h-3.5 opacity-50" />
                                                {technician.email || "-"}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                                <Phone className="w-3.5 h-3.5 opacity-50" />
                                                {technician.phone || "-"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30 text-center">
                                        <Badge
                                            className={cn(
                                                "text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm",
                                                technician.status === TechnicianStatus.ACTIVE
                                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800"
                                                    : "bg-slate-500/10 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-800"
                                            )}
                                        >
                                            <span className={cn(
                                                "w-1.5 h-1.5 rounded-full mr-1.5",
                                                technician.status === TechnicianStatus.ACTIVE ? "bg-emerald-500" : "bg-slate-500"
                                            )} />
                                            {technician.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 border-b border-slate-50 dark:border-slate-800/30">
                                        <div className="flex items-center justify-center">
                                            <DeleteAlertTechnician id={technician.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
