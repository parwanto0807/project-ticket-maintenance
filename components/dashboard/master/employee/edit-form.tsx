"use client";
import * as z from "zod";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useState, useTransition } from "react";
import { ArrowLeftIcon, UserCircleIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Department } from '@prisma/client';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import CreateDeptForm from './create-dept-form';
import { EmployeeSchemaCreate } from "@/schemas";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

type Employee = {
  id: string;
  name: string;
  email: string;
  emailCorporate: string | null;
  address: string;
  userDept: string;
  picture: string | null;
};

type EmployeeProp = Employee | null;

function EditForm({
  employee, deptFind,
}: {
  employee: EmployeeProp;
  deptFind: Department[];
}) {
  const [isPending] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof EmployeeSchemaCreate>>({
    resolver: zodResolver(EmployeeSchemaCreate),
    defaultValues: {
      name: employee?.name || '',
      email: employee?.email || "",
      emailCorporate: employee?.emailCorporate || "",
      address: employee?.address || "",
      userDept: employee?.userDept || "",
      picture: undefined,
    }
  });

  const { setValue } = form;

  // Effect untuk set preview image
  useEffect(() => {
    if (employee?.picture) {
      setPreviewImage(employee.picture);
      setCurrentImage(employee.picture);
      setFileName(employee.picture.split('/').pop() || 'profile.jpg');
    } else {
      setPreviewImage("/noImage.jpg");
      setCurrentImage(null);
    }
  }, [employee?.picture]);

  // Effect untuk set form value picture (opsional - hanya jika perlu file object)
  useEffect(() => {
    const setPictureFile = async () => {
      if (employee?.picture && !form.getValues("picture")) {
        try {
          // Hanya konversi ke File jika gambar dari external URL
          if (employee.picture.startsWith('http')) {
            const response = await fetch(employee.picture);
            const blob = await response.blob();
            const file = new File([blob], "profile-image.jpg", { type: blob.type });
            form.setValue("picture", file);
          } else {
            // Skip conversion untuk local paths
            console.log('Local path detected, skipping file conversion');
          }
        } catch (error) {
          console.warn("Gagal mengonversi gambar ke File:", error);
          // Tidak perlu set value jika gagal
        }
      }
    };

    setPictureFile();
  }, [employee?.picture, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > 0) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setValue("picture", file);
      setFileName(file.name);
    } else {
      // Jika tidak ada file baru yang dipilih, kembalikan ke gambar sebelumnya
      setPreviewImage(currentImage || "/noImage.jpg");
      setFileName(currentImage ? currentImage.split('/').pop() || '' : '');
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("/noImage.jpg");
    setValue("picture", undefined);
    setFileName('');
    setCurrentImage(null);
  };

  const onSubmit = async (values: z.infer<typeof EmployeeSchemaCreate>) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("id", employee?.id || "");
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("emailCorporate", values.emailCorporate || "");
    formData.append("address", values.address);
    formData.append("userDept", values.userDept);

    // Handle picture upload
    if (values.picture instanceof File) {
      // File baru diupload
      formData.append("picture", values.picture);
    } else if (values.picture === undefined && currentImage) {
      // Gambar dihapus
      formData.append("removePicture", "true");
    } else if (typeof values.picture === 'string' && values.picture) {
      // Gambar tidak berubah, kirim path-nya
      formData.append("currentPicture", values.picture);
    }

    try {
      const response = await fetch(`/api/employee/update/${employee?.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memperbarui data");
      }

      toast.success("Employee berhasil diperbarui!");
      router.push("/dashboard/master/employees");

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan saat memperbarui data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header dengan Gradient Profesional 2025 */}
          <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <UserCircleIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">
                        Edit Data Employee
                      </h1>
                      <p className="text-orange-100 text-lg mt-2 max-w-2xl">
                        Perbarui informasi employee dengan data terbaru yang valid
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/dashboard/master/employees"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Kembali ke List
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/20 rounded-full -translate-x-8 translate-y-8 blur-xl" />
          </div>

          {/* Main Content Container */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Personal Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information Card */}
                <Card className="border-0 shadow-xl dark:shadow-slate-900/50 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-600 px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                        <UserCircleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                          Informasi Personal
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                          Perbarui data diri dan informasi kontak employee
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Nama Lengkap
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Masukkan nama lengkap"
                                className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all rounded-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Email Akun
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="email@example.com"
                                type="email"
                                className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all rounded-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name='emailCorporate'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Email Corporate
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="corporate@company.com"
                                type="email"
                                className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all rounded-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='userDept'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Department
                            </FormLabel>
                            <div className="flex gap-3">
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isPending}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-12 flex-1 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all rounded-xl">
                                    <SelectValue placeholder="Pilih department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-600">
                                  {deptFind?.map(deptFind => (
                                    <SelectItem
                                      key={deptFind.id}
                                      value={deptFind.id}
                                      className="rounded-lg focus:bg-amber-50 dark:focus:bg-slate-600"
                                    >
                                      {deptFind.dept_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <CreateDeptForm deptFind={deptFind} />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Alamat Lengkap
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Masukkan alamat lengkap employee"
                              className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Photo Upload & Actions */}
              <div className="space-y-6">
                {/* Photo Upload Card */}
                <Card className="border-0 shadow-xl dark:shadow-slate-900/50 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <PhotoIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                          Foto Profil
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                          Update foto employee yang jelas
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative w-40 h-40 rounded-2xl border-4 border-slate-200 dark:border-slate-600 overflow-hidden shadow-lg group">
                        <Image
                          src={previewImage || "/noImage.jpg"}
                          alt="Preview"
                          fill
                          className="object-cover"
                          priority
                          onError={() => setPreviewImage("/noImage.jpg")}
                        />
                        {previewImage && previewImage !== "/noImage.jpg" && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={handleRemoveImage}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Hapus
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="w-full space-y-3">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Update Foto
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            name="picture"
                            className="block w-full text-sm text-slate-500 
                                     file:mr-4 file:py-3 file:px-4 file:rounded-xl 
                                     file:border-0 file:text-sm file:font-semibold 
                                     file:bg-amber-50 file:text-amber-700 dark:file:bg-amber-900 dark:file:text-amber-300
                                     hover:file:bg-amber-100 dark:hover:file:bg-amber-800 
                                     transition-all duration-200 cursor-pointer
                                     bg-slate-50 dark:bg-slate-700 rounded-xl"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                        {fileName && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            File: {fileName}
                          </p>
                        )}
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Format: JPG, PNG, WEBP
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Maksimal ukuran: 5MB
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons Card */}
                <Card className="border-0 shadow-xl dark:shadow-slate-900/50 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={loading}
                        className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Memperbarui Data...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            <span>Update Employee</span>
                          </div>
                        )}
                      </Button>

                      <Link
                        href="/dashboard/master/employees"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
                      >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Batalkan
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default EditForm;