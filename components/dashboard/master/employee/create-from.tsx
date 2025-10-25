"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Department } from "@prisma/client";
import { EmployeeSchemaCreate } from "@/schemas";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import CreateDeptForm from "./create-dept-form";
import { ArrowLeftIcon, UserCircleIcon, PhotoIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

const CreateEmployeeForm = ({ deptFind }: { deptFind: Department[] }) => {
  const [isPending] = useTransition();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>("/noImage.jpg");

  const form = useForm<z.infer<typeof EmployeeSchemaCreate>>({
    resolver: zodResolver(EmployeeSchemaCreate),
    defaultValues: {
      name: "",
      email: "",
      emailCorporate: "",
      address: "",
      userDept: "",
      picture: undefined,
    },
  });

  const { setValue } = form;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > 0) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setValue("picture", file);
    } else {
      setPreviewImage("/noImage.jpg");
    }
  };

  const onSubmit = async (values: z.infer<typeof EmployeeSchemaCreate>) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("emailCorporate", values.emailCorporate || "");
    formData.append("address", values.address);
    formData.append("userDept", values.userDept);

    if (values.picture instanceof File) {
      formData.append("picture", values.picture);
    }

    try {
      const response = await fetch("/api/employee/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyimpan data");
      }

      toast.success("Employee berhasil ditambahkan!");
      form.reset();
      router.push("/dashboard/master/employees");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header dengan Gradient Profesional 2025 */}
          <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <UserCircleIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h1 className="text-xl md:text-3xl font-bold tracking-tight">
                        Tambah Employee Baru
                      </h1>
                      <p className="text-blue-100 text-xs md:text-lg mt-2 max-w-2xl">
                        Lengkapi informasi employee dengan data yang valid dan dapat dipertanggungjawabkan
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
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full -translate-x-8 translate-y-8 blur-xl" />
          </div>

          {/* Main Content Container */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Personal Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information Card */}
                <Card className="border-0 shadow-xl dark:shadow-slate-900/50 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <UserCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                          Informasi Personal
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                          Data diri dan informasi kontak employee
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
                                className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-xl"
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
                                className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-xl"
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
                                className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-xl"
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
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={isPending}>
                                <FormControl>
                                  <SelectTrigger className="h-12 flex-1 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-xl">
                                    <SelectValue placeholder="Pilih department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-600">
                                  {deptFind?.map(deptFind => (
                                    <SelectItem 
                                      key={deptFind.id} 
                                      value={deptFind.id}
                                      className="rounded-lg focus:bg-blue-50 dark:focus:bg-slate-600"
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
                              className="h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rounded-xl"
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
                          Upload foto employee yang jelas
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative w-40 h-40 rounded-2xl border-4 border-slate-200 dark:border-slate-600 overflow-hidden shadow-lg">
                        <Image
                          src={previewImage || "/noImage.jpg"}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="w-full space-y-3">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Upload Foto
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            name="picture"
                            className="block w-full text-sm text-slate-500 
                                     file:mr-4 file:py-3 file:px-4 file:rounded-xl 
                                     file:border-0 file:text-sm file:font-semibold 
                                     file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-300
                                     hover:file:bg-blue-100 dark:hover:file:bg-blue-800 
                                     transition-all duration-200 cursor-pointer
                                     bg-slate-50 dark:bg-slate-700 rounded-xl"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
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
                        className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Menyimpan Data...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <PlusCircleIcon className="h-5 w-5" />
                            <span>Simpan Employee</span>
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
};

export default CreateEmployeeForm;