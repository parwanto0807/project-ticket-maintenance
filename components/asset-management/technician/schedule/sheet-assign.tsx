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
      <SheetContent className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl flex flex-col h-full bg-white dark:bg-slate-900">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shrink-0">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 mb-3">
            Execution Update
          </Badge>
          <SheetTitle className="text-2xl font-black tracking-tight text-white mb-1">
            {ticket?.ticketNumber || "Ticket Update"}
          </SheetTitle>
          <SheetDescription className="text-blue-100/80 text-xs font-medium">
            Update maintenance analysis and actions taken for this ticket.
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="update-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Header Info Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Schedule Date</p>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {ticket?.scheduledDate ? new Date(ticket.scheduledDate).toLocaleDateString('en-GB') : "Not Scheduled"}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Technician</p>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 text-blue-500" />
                  {ticket?.technician?.name || "Unassigned"}
                </div>
              </div>
            </div>

            {/* Reported Issue Section */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 px-1">
                <AlertCircle className="w-3.5 h-3.5" /> Reported Issue
              </h4>
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200 italic leading-relaxed">
                  "{ticket?.troubleUser || "No issue description provided"}"
                </p>
                {previewImage1 && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-sm shrink-0">
                      <Image src={previewImage1} alt="Reported" width={64} height={64} className="object-cover h-full w-full" />
                    </div>
                    <div className="text-[10px] font-bold text-amber-700/60 uppercase">
                      User Attachment
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Execution Input Section */}
            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 px-1">
                <Activity className="w-3.5 h-3.5" /> Maintenance Progress
              </h4>

              <div className="grid gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block px-1">Actual Check Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={actualCheckDate}
                      onChange={(e) => setActualCheckDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image 2 - Analysis */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block px-1">Analysis Attachment</label>
                    <div
                      onClick={() => triggerFileInput("ticketImage2")}
                      className="aspect-video rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all overflow-hidden relative group"
                    >
                      {previewImage2 ? (
                        <>
                          <Image src={previewImage2} alt="Analysis" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Input Image</p>
                        </div>
                      )}
                    </div>
                    <input id="ticketImage2" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelection(e, setTicketImage2, setPreviewImage2)} />
                    <textarea
                      placeholder="Analysis description..."
                      value={analisaDescription}
                      onChange={(e) => setAnalisaDescription(e.target.value)}
                      className="w-full h-32 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Image 3 - Action */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block px-1">Action Attachment</label>
                    <div
                      onClick={() => triggerFileInput("ticketImage3")}
                      className="aspect-video rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all overflow-hidden relative group"
                    >
                      {previewImage3 ? (
                        <>
                          <Image src={previewImage3} alt="Action" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Input Image</p>
                        </div>
                      )}
                    </div>
                    <input id="ticketImage3" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelection(e, setTicketImage3, setPreviewImage3)} />
                    <textarea
                      placeholder="Action description..."
                      value={actionDescription}
                      onChange={(e) => setActionDescription(e.target.value)}
                      className="w-full h-32 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex gap-3 shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 font-bold text-xs uppercase tracking-widest border-slate-200 dark:border-slate-700 h-11">
            Cancel
          </Button>
          <Button form="update-form" type="submit" disabled={loading} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 h-11">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">Update Ticket <CheckCircle2 className="w-4 h-4" /></span>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketMaintenanceUpdateSheet;