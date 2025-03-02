"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTicketMaintenanceSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { updateTicket } from "@/action/maintenance/ticket"; // pastikan action updateTicket ada
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { AssetStatus, AssetType, Department, Product } from "@prisma/client";
import { useCurrentUser } from "@/hooks/use-current-user";

// Tipe data ticket (bisa disesuaikan dengan model Prisma)
interface Ticket {
  id: string;
  troubleUser: string;
  analisaDescription?: string | null;
  actionDescription?: string | null;
  priorityStatus: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "In_Progress" | "Completed";
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  employeeId: string;
  assetId: string;
  ticketNumber: string;
  countNumber: number;
  ticketImage1?: string | null;
}

interface UpdateTicketFormProps {
  ticket: Ticket;
  assetFind: any[]; // Sesuaikan tipe Asset sesuai kebutuhan
  employeeDataFind: any[]; // Sesuaikan tipe Employee sesuai kebutuhan
}

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

const UpdateTicketForm: React.FC<UpdateTicketFormProps> = ({ ticket, assetFind, employeeDataFind }) => {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();
  const userTicket = user?.email;

  // Inisialisasi form dengan nilai default dari ticket
  const form = useForm<z.infer<typeof CreateTicketMaintenanceSchema>>({
    resolver: zodResolver(CreateTicketMaintenanceSchema),
    defaultValues: {
      troubleUser: ticket.troubleUser,
      analisaDescription: ticket.analisaDescription || "",
      actionDescription: ticket.actionDescription || "",
      priorityStatus: ticket.priorityStatus,
      status: ticket.status,
      createdAt: new Date(ticket.createdAt),
      updatedAt: new Date(ticket.updatedAt),
      scheduledDate: ticket.scheduledDate ? new Date(ticket.scheduledDate) : new Date(),
      completedDate: ticket.completedDate ? new Date(ticket.completedDate) : new Date(),
      employeeId: ticket.employeeId,
      assetId: ticket.assetId,
      ticketNumber: ticket.ticketNumber,
      countNumber: ticket.countNumber,
    },
  });

  // State untuk file gambar (hanya ticketImage1 diupdate di sini)
  const [ticketImage1, setTicketImage1] = useState<File | null>(null);
  const [previewImage1, setPreviewImage1] = useState<string>(ticket.ticketImage1 || "");

  // Deteksi perangkat mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // Fungsi onSubmit untuk mengirim data update
  const onSubmit = (values: z.infer<typeof CreateTicketMaintenanceSchema>) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("troubleUser", values.troubleUser);
    if (values.analisaDescription) formData.append("analisaDescription", values.analisaDescription);
    if (values.actionDescription) formData.append("actionDescription", values.actionDescription);
    formData.append("priorityStatus", values.priorityStatus);
    formData.append("status", values.status);
    formData.append("ticketNumber", values.ticketNumber);
    formData.append("countNumber", values.countNumber.toString());
    formData.append("employeeId", values.employeeId);
    formData.append("assetId", values.assetId);

    if (values.scheduledDate) {
      formData.append("scheduledDate", values.scheduledDate.toISOString());
    }
    if (values.completedDate) {
      formData.append("completedDate", values.completedDate.toISOString());
    }

    // Tambahkan timestamp
    formData.append("createdAt", new Date().toISOString());
    formData.append("updatedAt", new Date().toISOString());

    // Jika ada file gambar baru untuk ticketImage1, tambahkan ke FormData
    if (ticketImage1) {
      formData.append("ticketImage1", ticketImage1);
    }

    startTransition(() => {
      // Misalnya updateTicket merupakan fungsi untuk mengupdate ticket
      updateTicket(ticket.id, formData)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          }
          if (data?.success) {
            toast.success(data.success);
            router.push("/dashboard/maintenance/ticket");
          }
        })
        .finally(() => setLoading(false));
    });
  };

  // Fungsi untuk handle select asset dan employee (mirip dengan CreateTicketForm)
  const handleSelectAsset = (id: string) => {
    form.setValue("assetId", id);
    const selectedAsset = assetFind.find((ass) => ass.id === id);
    if (selectedAsset) {
      form.setValue("assetId", selectedAsset.id);
    }
  };

  const handleSelectEmployee = (employeeId: string) => {
    form.setValue("employeeId", employeeId);
    const selectedEmployee = employeeDataFind.find((emp) => emp.id === employeeId);
    // Jika diperlukan, Anda dapat melakukan update department di sini
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">Update Ticket</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ticket Number */}
          <FormField
            control={form.control}
            name="ticketNumber"
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>🎫 Ticket Number</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="font-mono font-extrabold tracking-widest text-green-800" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* User Asset */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>👨‍💻 User Asset</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSelectEmployee(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user asset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employeeDataFind.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Asset Name */}
          <FormField
            control={form.control}
            name="assetId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>🏢 Asset Name</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSelectAsset(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assetFind.map((ass) => (
                      <SelectItem key={ass.id} value={ass.id}>
                        {ass.product?.part_name} - {ass.employee?.name} - {ass.department?.dept_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Trouble User */}
          <FormField
            control={form.control}
            name="troubleUser"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>🔧 Trouble User</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter trouble user" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Priority Status */}
          <FormField
            control={form.control}
            name="priorityStatus"
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>⚠️ Priority Status</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>📌 Status</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Hidden Analisa & Action Description */}
          <FormField
            control={form.control}
            name="analisaDescription"
            render={({ field }) => (
              <FormItem className="col-span-2 hidden">
                <FormLabel className="hidden">📋 Analisa Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter analisa description" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actionDescription"
            render={({ field }) => (
              <FormItem className="col-span-2 hidden">
                <FormLabel className="hidden">🔍 Action Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter action description" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Count Number (hidden) */}
          <FormField
            control={form.control}
            name="countNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">🔢 Count Number</FormLabel>
                <FormControl>
                  <Input {...field} type="number" value={ticket.countNumber} className="hidden" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Input File untuk Ticket Image 1 */}
          <div>
            <label htmlFor="ticketImage1" className="block text-sm font-medium text-gray-700">
              Ticket Image 1
            </label>
            <input
              id="ticketImage1"
              type="file"
              accept="image/*"
              {...(isMobile ? { capture: "environment" } : {})}
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  let finalFile = file;
                  if (file.size > 1048576) {
                    finalFile = await resizeImage(file, 800, 800);
                  }
                  setTicketImage1(finalFile);
                  setPreviewImage1(URL.createObjectURL(finalFile));
                }
              }}
              className="mt-1 block w-full"
            />
            {previewImage1 && previewImage1.trim() !== "" ? (
              <div className="mt-2">
                <Image
                  src={previewImage1}
                  alt="Preview Ticket Image 1"
                  width={96}
                  height={96}
                  className="object-cover rounded"
                />
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No image available</p>
            )}
          </div>
        </div>
        <div className="flex items-end justify-end gap-4">
          <Button type="submit" className="w-full md:w-auto px-6 py-2 text-lg" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button variant="destructive" type="button" onClick={() => router.push("/dashboard/maintenance/ticket")}>
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateTicketForm;
