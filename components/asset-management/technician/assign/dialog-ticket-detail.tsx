import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TicketMaintenance, Technician } from "@prisma/client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";

interface TicketWithRelations extends TicketMaintenance {
  technician?: Technician | null;
}

export function TicketDialog({ ticket }: { ticket: TicketWithRelations }) {
  // Pastikan URL gambar tidak kosong, gunakan fallback "/noImage.jpg"
  const imageSrc1 = ticket.ticketImage1?.trim() || "/noImage.jpg";
  const imageSrc2 = ticket.ticketImage2?.trim() || "/noImage.jpg";
  const imageSrc3 = ticket.ticketImage3?.trim() || "/noImage.jpg";

  const createdAt = ticket.createdAt instanceof Date ? ticket.createdAt : new Date(ticket.createdAt);

  const statuses = [
    { label: "Pending", value: "Pending", icon: Clock },
    { label: "Assigned", value: "Assigned", icon: Circle },
    { label: "In Progress", value: "In_Progress", icon: Loader2 },
    { label: "Completed", value: "Completed", icon: CheckCircle2 },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.value === ticket.status);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
        >
          <MagnifyingGlassIcon className="w-3.5 h-3.5 mr-1.5" />
          Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {ticket.ticketNumber}
                </DialogTitle>
                <DialogDescription className="text-blue-100 mt-1">
                  Created on {createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </DialogDescription>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md uppercase tracking-wider text-[10px]">
                {ticket.priorityStatus} Priority
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-8">
          {/* Status Timeline */}
          <div className="relative">
            <div className="flex justify-between">
              {statuses.map((s, i) => {
                const Icon = s.icon;
                const isActive = i <= currentStatusIndex;
                const isCurrent = i === currentStatusIndex;

                return (
                  <div key={s.value} className="flex flex-col items-center relative z-10 w-1/4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                      ${isActive ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-gray-200 text-gray-300"}
                      ${isCurrent ? "ring-4 ring-blue-100 animate-pulse" : ""}
                    `}>
                      <Icon className={`w-5 h-5 ${isCurrent && s.value === "In_Progress" ? "animate-spin" : ""}`} />
                    </div>
                    <span className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Timeline Line */}
            <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-gray-100 -z-0">
              <div
                className="h-full bg-blue-600 transition-all duration-1000"
                style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <section>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Problem Description</h4>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {ticket.troubleUser}
                  </p>
                </div>
              </section>

              {ticket.analisaDescription && (
                <section>
                  <h4 className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Technician Analysis</h4>
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30 font-medium italic text-emerald-800 dark:text-emerald-400">
                    {ticket.analisaDescription}
                  </div>
                </section>
              )}

              {ticket.actionDescription && (
                <section>
                  <h4 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-3">Resolution Action</h4>
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 font-medium text-blue-800 dark:text-blue-400">
                    {ticket.actionDescription}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <section>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Documentation</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { src: imageSrc1, label: "Issue" },
                    { src: imageSrc2, label: "Analysis" },
                    { src: imageSrc3, label: "Action" }
                  ].map((img, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-sm transition-transform hover:scale-105 cursor-zoom-in">
                        <Image
                          src={img.src}
                          alt={img.label}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[9px] text-center font-bold text-gray-400 uppercase">{img.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gray-900 rounded-xl p-4 text-white shadow-xl">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3">Execution Info</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Schedule</span>
                    <span className="font-mono">{ticket.scheduledDate ? new Date(ticket.scheduledDate).toLocaleDateString() : "TBD"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Completed</span>
                    <span className="font-mono">{ticket.completedDate ? new Date(ticket.completedDate).toLocaleDateString() : "--"}</span>
                  </div>
                  <div className="h-px bg-gray-800 my-1" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Technician Name</span>
                    <span className="text-blue-400 font-bold truncate ml-4 text-right">{ticket.technician?.name || "UNASSIGNED"}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-slate-900 dark:border-slate-800">
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full md:w-auto font-bold uppercase text-[11px]">
              Close Overview
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}