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
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { updateEmployee } from '@/action/master/employees';
import type { Department } from '@prisma/client';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import CreateDeptForm from './create-dept-form';
import { EmployeeSchemaCreate } from "@/schemas";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

type Employee = {
  id: string;
  name: string;
  email: string;
  address: string;
  userDept: string;
  picture: string | null; // Picture bisa null
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
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };
  const [fileName, setFileName] = useState<string>('');

  const form = useForm<z.infer<typeof EmployeeSchemaCreate>>({
    resolver: zodResolver(EmployeeSchemaCreate),
    defaultValues: {
      name: employee?.name || '',
      email: employee?.email || "",
      address: employee?.address || "",
      userDept: employee?.userDept || "",
      picture: undefined,
    }
  });

  const { setValue } = form;

  useEffect(() => {
    if (employee?.picture) {
      setPreviewImage(employee?.picture);
      setFileName(employee?.picture || "");
    }
  }, [employee?.picture]);

  useEffect(() => {
    if (employee?.picture) {
      urlToFile(employee?.picture, "image.jpg").then((file) => {
        form.setValue("picture", file);
      });
    }
  }, [employee?.picture, form]);


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
    formData.append("address", values.address);
    formData.append("userDept", values.userDept);

    if (values.picture instanceof File) {
      formData.append("picture", values.picture);
    }

    try {
      const data = await updateEmployee(employee?.id ?? '', formData); // Kirim FormData ke backend

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
        form.reset();
        router.push("/dashboard/master/employees");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-4 items-center justify-center space-between '>
        <div className="flex pt-2 pb-0 gap-4">
          <div className="flex-initial w-96 text-xs text-blue-700 italic md:text-nowrap">
            <span>Input data master Employee ini dengan lengkap dan dapat di pertanggungjawabkan</span>
          </div>
        </div>
      </div>
      <div className="w-full rounded-lg border px-4 shadow-lg mt-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-4 mb-12 "
        >
          <div className="mt-1 grid grid-cols-1 gap-4 gap-y-1 sm:grid-cols-2 items-center justify-center space-between">
            <div className='w-full space-y-6 items-center justify-center'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Employee name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='w-full space-y-6 items-center justify-center'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Employee email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='w-full space-y-6 items-center justify-center'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Employee Address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-initial grid grid-cols-1 mt-0 sm:grid-cols-1">
              <div className="flex w-full gap-x-2">
                <div className="flex-initial w-full">
                  <FormField
                    control={form.control}
                    name="userDept"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Unit</FormLabel>
                        <Select
                          value={field.value} // Gunakan value, bukan defaultValue
                          onValueChange={field.onChange}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Department " />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {deptFind?.map(deptFind => (
                              <SelectItem key={deptFind.id} value={deptFind.id}>
                                {deptFind.dept_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-initial mt-7 ">
                  <CreateDeptForm deptFind={deptFind} />
                </div>
              </div>
            </div>
          </div>


          <div className='mt-8'>
            <div className="w-full md:w-1/4 items-center justify-center">
              <Card className="w-full py-2 px-2 border-2 mt-4 rounded-sm items-center justify-center">
                <h3 className="w-full font-bold items-center justify-center text-center">Upload Images</h3>
                <div className="mb-2 pt-2">
                  <input
                    type="file"
                    name="picture"
                    className="file:h-full file:mr-4 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-gray-300 file:cursor-pointer border border-gray-400 w-full"
                    accept="image/*"
                    onChange={handleImageChange || "/noImage.jpg"}
                  />
                  {fileName && <p className="mt-2 text-gray-600" hidden>File: {fileName}</p>}
                  {previewImage && (
                    <div className="mt-4">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={400}
                        height={200}
                        className="rounded-lg shadow-sm items-center justify-center object-center"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <div className="relative">
            <Button
              className={`w-24 h-9 rounded-lg absolute right-0 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-2 px-4 rounded-lg`}
              type="submit"
            >
              {loading ? 'Load Update...' : 'Update'}
            </Button>
          </div>
        </form>

        <div className="flex items-center justify-end border p-2 pr-3 rounded-md shadow-sm mb-4">
          <Link
            href="/dashboard/master/employees"
            className="flex h-9 w-24 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span>Exit</span>{' '}
            <ArrowLeftStartOnRectangleIcon className="h-5 md:ml-4" />
          </Link>
        </div>
      </div>
    </Form>
  );
}

export default EditForm;
