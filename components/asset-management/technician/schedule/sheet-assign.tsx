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
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  User,
  Wrench,
  MessageSquare,
  Camera,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Loader2,
  FileText
} from "lucide-react";
import { TicketMaintenance, Employee, Asset, Product, Technician } from "@prisma/client";

// Fungsi resize (contoh sederhana)
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  let { width, height } = imageBitmap;
  const aspectRatio = width / height;

  if (width > maxWidth) {
    width = maxWidth;
    height = Math.round(width / aspectRatio);
  }
  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * aspectRatio);
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(imageBitmap, 0, 0, width, height);
  }
  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const resizedFile = new File([blob], file.name, { type: file.type });
        resolve(resizedFile);
      }
    }, file.type);
  });
}

interface TicketWithRelations extends TicketMaintenance {
  employee: Employee;
  asset: Asset & {
    product: Product;
  };
  technician?: Technician | null;
}

interface TicketMaintenanceUpdateSheetProps {
  ticket: TicketWithRelations;
  onUpdate?: () => void;
  technicians: Technician[];
  children?: React.ReactNode;

  // Optional legacy props for backward compatibility
  ticketId?: string;
  initialTroubleUser?: string;
  initialTechnicianId?: string;
  initialScheduledDate?: string;
  initialAnalisaDescription?: string;
  initialActionDescription?: string;
  initialActualCheckDate?: string;
  initialTicketImage1?: string;
  initialTicketImage2?: string;
  initialTicketImage3?: string;
}

const TicketMaintenanceUpdateSheet: React.FC<TicketMaintenanceUpdateSheetProps> = ({
  ticket,
  onUpdate,
  children,
  ticketId: legacyTicketId,
  initialAnalisaDescription,
  initialActionDescription,
  initialActualCheckDate,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const ticketId = ticket?.id || legacyTicketId || "";

  // State for editable fields
  const [analisaDescription, setAnalisaDescription] = useState("");
  const [actionDescription, setActionDescription] = useState("");
  const [actualCheckDate, setActualCheckDate] = useState("");

  // State for file images
  const [ticketImage2, setTicketImage2] = useState<File | null>(null);
  const [ticketImage3, setTicketImage3] = useState<File | null>(null);

  // State for preview image URLs
  const [previewImage1, setPreviewImage1] = useState<string>("");
  const [previewImage2, setPreviewImage2] = useState<string>("");
  const [previewImage3, setPreviewImage3] = useState<string>("");

  useEffect(() => {
    if (open && ticket) {
      setAnalisaDescription(ticket.analisaDescription || "");
      setActionDescription(ticket.actionDescription || "");
      setActualCheckDate(ticket.actualCheckDate ? new Date(ticket.actualCheckDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
      setPreviewImage1(ticket.ticketImage1 || "");
      setPreviewImage2(ticket.ticketImage2 || "");
      setPreviewImage3(ticket.ticketImage3 || "");
    } else if (open && !ticket) {
      // Fallback for legacy usage if any
      setAnalisaDescription(initialAnalisaDescription || "");
      setActionDescription(initialActionDescription || "");
      setActualCheckDate(initialActualCheckDate || new Date().toISOString().split("T")[0]);
    }
  }, [open, ticket, initialAnalisaDescription, initialActionDescription, initialActualCheckDate]);

  const handleFileSelection = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (url: string) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      let finalFile = file;
      if (file.size > 1048576) {
        finalFile = await resizeImage(file, 800, 800);
      }
      setFile(finalFile);
      setPreview(URL.createObjectURL(finalFile));
    }
  };

  const triggerFileInput = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) input.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!analisaDescription.trim()) {
      alert("Please provide an analysis description.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("analisaDescription", analisaDescription);
      formData.append("actionDescription", actionDescription);
      formData.append("status", "In_Progress");
      formData.append("actualCheckDate", new Date(actualCheckDate).toISOString());

      // Fix: Add required fields for API
      const finalTechnicianId = ticket?.technicianId || "";
      const finalScheduledDate = ticket?.scheduledDate ? new Date(ticket.scheduledDate).toISOString() : "";

      formData.append("technicianId", finalTechnicianId);
      formData.append("scheduledDate", finalScheduledDate);

      if (ticketImage2) formData.append("ticketImage2", ticketImage2);
      if (ticketImage3) formData.append("ticketImage3", ticketImage3);

      const response = await fetch(`/api/schedule/${ticketId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update ticket");

      router.refresh();
      if (onUpdate) onUpdate();
      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold">
            <Activity className="w-4 h-4" />
            Update Progress
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl flex flex-col h-full bg-slate-50 dark:bg-slate-950">
        {/* Modern Header */}
        <div className="bg-white dark:bg-slate-900 px-6 pt-10 pb-6 shrink-0 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <Badge className="bg-blue-600 text-white border-none text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
              Execution Mode
            </Badge>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              Live Update
            </div>
          </div>
          <SheetTitle className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
            {ticket?.ticketNumber || "Update Progress"}
          </SheetTitle>

          {/* Asset Context Context Card */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm shrink-0">
              <Image src={ticket?.asset?.assetImage1 || "/noImage.jpg"} alt="Asset" width={48} height={48} className="object-cover h-full w-full" />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-[13px] text-gray-800 dark:text-gray-100 truncate leading-tight">
                {ticket?.asset?.product?.part_name}
              </h4>
              <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold uppercase mt-1">
                <MapPin className="w-2.5 h-2.5" />
                {ticket?.asset?.location}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide space-y-6">
          <form id="update-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Segment: Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Ticket Summary
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-50 dark:border-slate-800">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Technician</p>
                  <p className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase truncate">
                    {ticket?.technician?.name || "Unassigned"}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-50 dark:border-slate-800">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Report Date</p>
                  <p className="text-xs font-black text-gray-700 dark:text-gray-200">
                    {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-GB') : "-"}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10">
                <p className="text-[8px] font-black text-amber-600 uppercase mb-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Reported Problem
                </p>
                <p className="text-[13px] font-medium text-amber-900 dark:text-amber-200 italic leading-relaxed">
                  "{ticket?.troubleUser || "No issue description"}"
                </p>
              </div>
            </div>

            {/* Segment: Maintenance Data */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-5">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5" /> Maintenance Action
              </h4>

              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase mb-2 block px-1">Check Execution Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 z-10" />
                  <input
                    type="date"
                    value={actualCheckDate}
                    onChange={(e) => setActualCheckDate(e.target.value)}
                    className="w-full bg-slate-50/80 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-black text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Analysis UI */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-gray-400 uppercase block px-1">Problem Analysis</label>
                <div className="flex gap-4">
                  <div
                    onClick={() => triggerFileInput("ticketImage2")}
                    className="w-24 h-24 shrink-0 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all overflow-hidden relative group"
                  >
                    {previewImage2 ? (
                      <>
                        <Image src={previewImage2} alt="Analysis" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-2">
                        <Camera className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                        <p className="text-[8px] font-black text-slate-400 uppercase">Analysis Photo</p>
                      </div>
                    )}
                  </div>
                  <textarea
                    placeholder="Detail analysis results..."
                    value={analisaDescription}
                    onChange={(e) => setAnalisaDescription(e.target.value)}
                    className="flex-1 h-24 bg-slate-50/80 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-[13px] font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Action Taken UI */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-gray-400 uppercase block px-1">Action Log</label>
                <div className="flex gap-4">
                  <div
                    onClick={() => triggerFileInput("ticketImage3")}
                    className="w-24 h-24 shrink-0 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all overflow-hidden relative group"
                  >
                    {previewImage3 ? (
                      <>
                        <Image src={previewImage3} alt="Action" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-2">
                        <Camera className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                        <p className="text-[8px] font-black text-slate-400 uppercase">Action Photo</p>
                      </div>
                    )}
                  </div>
                  <textarea
                    placeholder="Detail actions taken..."
                    value={actionDescription}
                    onChange={(e) => setActionDescription(e.target.value)}
                    className="flex-1 h-24 bg-slate-50/80 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-[13px] font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Hidden File Inputs */}
              <input id="ticketImage2" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelection(e, setTicketImage2, setPreviewImage2)} />
              <input id="ticketImage3" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelection(e, setTicketImage3, setPreviewImage3)} />
            </div>
          </form>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 shrink-0">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="flex-1 font-black text-[11px] uppercase tracking-[0.1em] text-gray-400 hover:text-red-500 transition-colors h-14 rounded-2xl"
          >
            DISCARD
          </Button>
          <Button
            form="update-form"
            type="submit"
            disabled={loading}
            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] uppercase tracking-[0.1em] shadow-xl shadow-blue-500/30 active:scale-[0.98] transition-all h-14 rounded-2xl"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">Update Schedule <CheckCircle2 className="w-4 h-4" /></span>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketMaintenanceUpdateSheet;