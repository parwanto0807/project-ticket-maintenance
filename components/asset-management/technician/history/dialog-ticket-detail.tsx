"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    User,
    MapPin,
    Wrench,
    MessageSquare,
    Camera,
    Info,
    CheckCircle2,
    Search
} from "lucide-react";
import Image from "next/image";
import { Ticket } from "@/types/ticket";

export function TicketDialog({ ticket }: { ticket: Ticket }) {
    const statusSteps = [
        { status: "Pending", label: "Reported", icon: MessageSquare },
        { status: "Assigned", label: "Assigned", icon: User },
        { status: "In_Progress", label: "Working", icon: Wrench },
        { status: "Completed", label: "Finished", icon: CheckCircle2 },
    ];

    const currentStepIndex = statusSteps.findIndex(step => step.status === ticket.status);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-blue-600 border-blue-100 hover:bg-blue-50 transition-colors shadow-sm"
                >
                    <Search className="w-3.5 h-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 mb-2">
                                Ticket Details
                            </Badge>
                            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                {ticket.ticketNumber}
                            </DialogTitle>
                            <p className="text-blue-100/80 text-xs font-medium flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Created on {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <Badge className={`px-4 py-1.5 rounded-full border-none font-bold text-xs uppercase tracking-tighter shadow-lg ${ticket.status === 'Completed' ? 'bg-emerald-500 text-white' :
                            ticket.status === 'In_Progress' ? 'bg-amber-500 text-white animate-pulse' :
                                'bg-blue-500 text-white'
                            }`}>
                            {ticket.status.replace('_', ' ')}
                        </Badge>
                    </div>

                    {/* Timeline */}
                    <div className="mt-8 flex justify-between relative px-2">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -translate-y-1/2" />
                        {statusSteps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const Icon = step.icon;

                            return (
                                <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-white border-white scale-90' :
                                        isCurrent ? 'bg-blue-400 border-white scale-110 shadow-lg' :
                                            'bg-blue-800 border-white/30'
                                        }`}>
                                        <Icon className={`w-4 h-4 ${isCompleted ? 'text-blue-600' : 'text-white'}`} />
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-tighter ${isCurrent ? 'text-white' : 'text-blue-200/60'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 grid md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
                    {/* Left Column: Report Info */}
                    <div className="space-y-6">
                        <section className="space-y-3">
                            <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                <Info className="w-3.5 h-3.5" /> Trouble Report
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Description</p>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic leading-relaxed">
                                        "{ticket.troubleUser}"
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><User className="w-2.5 h-2.5" /> Reporter</p>
                                        <p className="text-xs font-bold truncate">{ticket.employee.name}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1.5"><Clock className="w-2.5 h-2.5" /> Priority</p>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase h-5 border-blue-100 text-blue-600">{ticket.priorityStatus}</Badge>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" /> Asset Location
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex gap-4">
                                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-sm shrink-0">
                                    <Image
                                        src={ticket.ticketImage1 || "/noImage.jpg"}
                                        alt="Asset"
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold truncate">{ticket.asset.product.part_name}</p>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase mt-1.5 flex items-center gap-1">
                                        <MapPin className="w-3" /> {ticket.asset.location}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Execution Info */}
                    <div className="space-y-6">
                        <section className="space-y-3">
                            <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                <Wrench className="w-3.5 h-3.5" /> Execution Info
                            </h4>
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/30 space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-indigo-600/70 font-bold uppercase text-[10px]">Technician Name</span>
                                    <span className="text-indigo-700 dark:text-indigo-400 font-black tracking-tight">
                                        {ticket.technician?.name || "UNASSIGNED"}
                                    </span>
                                </div>
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-3 space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Analysis</p>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {ticket.analisaDescription || "No analysis provided yet."}
                                        </p>
                                    </div>
                                    <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Action Taken</p>
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {ticket.actionDescription || "No action documented."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                <Camera className="w-3.5 h-3.5" /> Documentation
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                {[ticket.ticketImage1, ticket.ticketImage2, ticket.ticketImage3].map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 relative group cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                                        <Image
                                            src={img || "/noImage.jpg"}
                                            alt={`Doc ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Search className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 hover:bg-black text-white px-8 font-bold text-xs uppercase tracking-widest">
                            Close
                        </Button>
                    </DialogTrigger>
                </div>
            </DialogContent>
        </Dialog>
    );
}
