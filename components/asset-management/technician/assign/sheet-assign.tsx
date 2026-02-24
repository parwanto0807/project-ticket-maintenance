"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Technician {
  id: string;
  name: string;
  specialization: string;
}

interface TicketMaintenanceUpdateSheetProps {
  ticketId: string;
  initialTechnicianId?: string;
  initialScheduledDate?: string;
  onUpdate?: () => void;
  technicians: Technician[];
  children?: React.ReactNode;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, UserCheck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const TicketMaintenanceUpdateSheet: React.FC<TicketMaintenanceUpdateSheetProps> = ({
  ticketId,
  technicians,
  initialTechnicianId = "",
  initialScheduledDate = "",
  onUpdate,
  children,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [technicianId, setTechnicianId] = useState(initialTechnicianId);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    initialScheduledDate ? new Date(initialScheduledDate) : undefined
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTechnicianId(initialTechnicianId);
      setScheduledDate(initialScheduledDate ? new Date(initialScheduledDate) : undefined);
    }
  }, [open, initialTechnicianId, initialScheduledDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!technicianId) {
      alert("Pilih Technician terlebih dahulu.");
      return;
    }

    if (!scheduledDate) {
      alert("Masukkan tanggal schedule.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (scheduledDate < today) {
      alert("Tanggal schedule tidak boleh kurang dari hari ini.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/ticket/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          technicianId,
          scheduledDate: scheduledDate.toISOString().split("T")[0],
          status: "Assigned",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket maintenance");
      }
      router.refresh();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            className="flex items-center gap-2 text-blue-600 bg-white border border-blue-200 rounded-lg px-4 py-2 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:shadow-md font-bold text-xs"
          >
            <Wrench className="w-4 h-4" />
            Assign Technician
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-md border-l-0 shadow-2xl">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Update Assignment
          </SheetTitle>
          <SheetDescription className="text-gray-500">
            Pilih teknisi yang tersedia dan tetapkan jadwal pengerjaan untuk tiket ini.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Technician
            </label>
            <Select value={technicianId} onValueChange={setTechnicianId}>
              <SelectTrigger className="w-full h-11 bg-gray-50/50 border-gray-100 focus:ring-blue-500 rounded-xl">
                <SelectValue placeholder="Pilih Teknisi" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id} className="py-3">
                    <div className="flex flex-col">
                      <span className="font-bold">{tech.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{tech.specialization}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Schedule Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal bg-gray-50/50 border-gray-100 rounded-xl",
                    !scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                  {scheduledDate ? format(scheduledDate, "PPP") : <span>Pilih Tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl shadow-2xl border-none" align="start">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="rounded-xl"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all uppercase tracking-widest text-xs"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm Assignment"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketMaintenanceUpdateSheet;
