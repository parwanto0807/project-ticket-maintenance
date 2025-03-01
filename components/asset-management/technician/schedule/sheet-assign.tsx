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

  // Gunakan nilai langsung dari prop karena tidak ada perubahan
  const technicianId = initialTechnicianId || "";
  const [scheduledDate] = useState(initialScheduledDate);

  // Field tambahan untuk input yang dapat diedit
  const [analisaDescription, setAnalisaDescription] = useState("");
  const [actionDescription, setActionDescription] = useState("");
  // Karena status hanya ditampilkan sebagai read-only, kita bisa gunakan konstanta
  const status = "In_Progress";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setTransformClass("translate-x-0 opacity-100");
      }, 200);
    } else {
      setTransformClass("translate-x-10 opacity-0");
    }
  }, [open]);

  const safeTechnicians = Array.isArray(technicians) ? technicians : [];
  const selectedTechnician = safeTechnicians.find((tech) => tech.id === technicianId);
  const technicianDisplay = selectedTechnician
    ? `${selectedTechnician.name} - ${selectedTechnician.specialization}`
    : "Not Assigned";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!analisaDescription.trim()) {
      alert("Masukkan analisa description.");
      return;
    }
    if (!actionDescription.trim()) {
      alert("Masukkan action description.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (scheduledDate && scheduledDate < today) {
      alert("Tanggal schedule tidak boleh kurang dari hari ini.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/schedule/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          technicianId,
          scheduledDate,
          analisaDescription,
          actionDescription,
          status,
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
            Detail tiket dan aksi update:
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Readonly Technician */}
          <div>
            <label htmlFor="technician" className="block text-sm font-medium text-gray-700">
              Technician
            </label>
            <input
              id="technician"
              type="text"
              value={technicianDisplay}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
            />
          </div>
          {/* Readonly Scheduled Date */}
          <div>
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
              Schedule Date
            </label>
            <input
              id="scheduledDate"
              type="text"
              value={scheduledDate || "Not set"}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
            />
          </div>
          {/* Analisa Description */}
          <div>
            <label htmlFor="analisaDescription" className="block text-sm font-medium text-gray-700">
              Analisa Description
            </label>
            <textarea
              id="analisaDescription"
              value={analisaDescription}
              onChange={(e) => setAnalisaDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter analisa description..."
              rows={3}
            />
          </div>
          {/* Action Description */}
          <div>
            <label htmlFor="actionDescription" className="block text-sm font-medium text-gray-700">
              Action Description
            </label>
            <textarea
              id="actionDescription"
              value={actionDescription}
              onChange={(e) => setActionDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter action description..."
              rows={3}
            />
          </div>
          {/* Readonly Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              id="status"
              type="text"
              value={status}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
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
