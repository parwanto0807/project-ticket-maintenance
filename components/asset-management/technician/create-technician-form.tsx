"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { TechnicianSchema } from "@/schemas";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTechnician } from "@/action/maintenance/technician";

const CreateTechnicianForm = () => {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Inisialisasi form dengan useForm
  const form = useForm<z.infer<typeof TechnicianSchema>>({
    resolver: zodResolver(TechnicianSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      specialization: "",
      status: "ACTIVE",
    },
  });
  console.log('Default Value:', form.control._formValues);

  // Fungsi onSubmit untuk menangani pengiriman data
  const onSubmit = (values: z.infer<typeof TechnicianSchema>) => {
    setLoading(true);

    // Membuat FormData untuk mengirim data
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone ?? "");
    formData.append("email", values.email ?? "");
    formData.append("specialization", values.specialization);
    formData.append("status", values.status);

    // Mengirim data ke server
    startTransition(() => {
        createTechnician(formData)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          }
          if (data?.success) {
            toast.success(data.success);
            router.push("/dashboard/technician/list");
          }
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">
          Create Technician
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Technician Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>👤 Technician Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter technician name" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>📞 Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter phone number" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>📧 Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter email address" disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Specialization */}
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>🔧 Specialization</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter specialization (e.g. Hardware, Networking)" disabled={isPending} />
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
              <FormItem className="col-span-2">
                <FormLabel>📌 Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button type="submit" className="w-full md:w-auto px-6 py-2 text-lg" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateTechnicianForm;
