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
import { FiAlertTriangle } from "react-icons/fi";

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
  const [transformClass, setTransformClass] = useState("translate-x-10 opacity-0");
  const [technicianId, setTechnicianId] = useState(initialTechnicianId);
  const [scheduledDate, setScheduledDate] = useState(initialScheduledDate);
  const [loading, setLoading] = useState(false);

  // Reset state setiap kali sheet terbuka
  useEffect(() => {
    if (open) {
      setTechnicianId(initialTechnicianId);
      setScheduledDate(initialScheduledDate);
    }
  }, [open, initialTechnicianId, initialScheduledDate]);

  // Animasi transisi sheet
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setTransformClass("translate-x-0 opacity-100");
      }, 200);
    } else {
      setTransformClass("translate-x-10 opacity-0");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!technicianId) {
      alert("Pilih Technician terlebih dahulu.");
      return;
    }

    if (!scheduledDate) {
      alert("Masukkan tanggal schedule.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
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
          scheduledDate,
          status: "Assigned", // Set status ke "Assigned"
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
            className="flex items-center gap-2 text-yellow-700 bg-white border border-yellow-600 rounded-md px-4 py-2 transition-all duration-200 hover:bg-yellow-600 hover:text-white hover:shadow-md"
          >
            <FiAlertTriangle className="w-5 h-5" />
            <span className="font-semibold animate-blink">Assign Technician</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className={`transition-transform duration-300 ease-out ${transformClass}`}>
        <SheetHeader>
          <SheetTitle>Update Ticket Maintenance</SheetTitle>
          <SheetDescription>
            Pilih technician dan tentukan jadwal action untuk tiket ini.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="technician" className="block text-sm font-medium text-gray-700">
              Technician
            </label>
            <select
              id="technician"
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Pilih Technician</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} &nbsp; {tech.specialization}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
              Schedule Date
            </label>
            <input
              type="date"
              id="scheduledDate"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default TicketMaintenanceUpdateSheet;
