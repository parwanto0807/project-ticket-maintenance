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
  initialAnalisaDescription?: string;
  initialActionDescription?: string;
  initialActualCheckDate?: string;
  onUpdate?: () => void;
  technicians: Technician[];
  children?: React.ReactNode;
}

const TicketMaintenanceUpdateSheet: React.FC<TicketMaintenanceUpdateSheetProps> = ({
  ticketId,
  technicians,
  initialTechnicianId = "",
  initialScheduledDate = "",
  initialAnalisaDescription = "",
  initialActionDescription = "",
  // Default actualCheckDate ke hari ini jika tidak ada
  initialActualCheckDate = new Date().toISOString().split("T")[0],
  onUpdate,
  children,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [transformClass, setTransformClass] = useState("translate-x-10 opacity-0");

  // Karena technician tidak diubah, gunakan nilai langsung dari prop
  const technicianId = initialTechnicianId || "";
  const [scheduledDate] = useState(initialScheduledDate);

  // Field tambahan untuk input yang dapat diedit
  const [analisaDescription, setAnalisaDescription] = useState(initialAnalisaDescription);
  const [actionDescription, setActionDescription] = useState(initialActionDescription);
  const [actualCheckDate, setActualCheckDate] = useState(initialActualCheckDate);
  const status = "In_Progress";
  const [loading, setLoading] = useState(false);

  // State untuk file image
  const [ticketImage1, setTicketImage1] = useState<File | null>(null);
  const [ticketImage2, setTicketImage2] = useState<File | null>(null);
  const [ticketImage3, setTicketImage3] = useState<File | null>(null);

  // Deteksi perangkat mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // Saat sheet terbuka, reset state input dengan nilai awal dari props
  useEffect(() => {
    if (open) {
      setAnalisaDescription(initialAnalisaDescription);
      setActionDescription(initialActionDescription);
      setActualCheckDate(initialActualCheckDate);
    }
  }, [open, initialAnalisaDescription, initialActionDescription, initialActualCheckDate]);

  // Efek animasi saat sheet terbuka (slide-in dengan fade in)
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

    const today = new Date().toISOString().split("T")[0];
    if (actualCheckDate && actualCheckDate < today) {
      alert("Tanggal check tidak boleh kurang dari hari ini.");
      return;
    }

    setLoading(true);
    try {
      // Gunakan FormData untuk mengirim file gambar dan field lainnya
      const formData = new FormData();
      formData.append("technicianId", technicianId);
      formData.append("scheduledDate", scheduledDate);
      formData.append("analisaDescription", analisaDescription);
      formData.append("actionDescription", actionDescription);
      formData.append("status", status);
      formData.append("actualCheckDate", new Date(actualCheckDate).toISOString());

      if (ticketImage1) {
        formData.append("ticketImage1", ticketImage1);
      }
      if (ticketImage2) {
        formData.append("ticketImage2", ticketImage2);
      }
      if (ticketImage3) {
        formData.append("ticketImage3", ticketImage3);
      }

      const response = await fetch(`/api/schedule/${ticketId}`, {
        method: "PUT",
        body: formData,
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
        {/* Tambahkan container dengan scroll jika konten terlalu panjang */}
        <div className="max-h-[80vh] overflow-y-auto pr-2">
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
            {/* Actual Check Date */}
            <div>
              <label htmlFor="actualCheckDate" className="block text-sm font-medium text-gray-700">
                Actual Check Date
              </label>
              <input
                id="actualCheckDate"
                type="date"
                value={actualCheckDate}
                onChange={(e) => setActualCheckDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {/* File Input untuk Ticket Image 1 */}
            <div>
              <label htmlFor="ticketImage1" className="block text-sm font-medium text-gray-700">
                Ticket Image 1
              </label>
              <input
                id="ticketImage1"
                type="file"
                accept="image/*"
                {...(isMobile ? { capture: "environment" } : {})}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setTicketImage1(e.target.files[0]);
                  }
                }}
                className="mt-1 block w-full"
              />
            </div>
            {/* File Input untuk Ticket Image 2 */}
            <div>
              <label htmlFor="ticketImage2" className="block text-sm font-medium text-gray-700">
                Ticket Image 2
              </label>
              <input
                id="ticketImage2"
                type="file"
                accept="image/*"
                {...(isMobile ? { capture: "environment" } : {})}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setTicketImage2(e.target.files[0]);
                  }
                }}
                className="mt-1 block w-full"
              />
            </div>
            {/* File Input untuk Ticket Image 3 */}
            <div>
              <label htmlFor="ticketImage3" className="block text-sm font-medium text-gray-700">
                Ticket Image 3
              </label>
              <input
                id="ticketImage3"
                type="file"
                accept="image/*"
                {...(isMobile ? { capture: "environment" } : {})}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setTicketImage3(e.target.files[0]);
                  }
                }}
                className="mt-1 block w-full"
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketMaintenanceUpdateSheet;
