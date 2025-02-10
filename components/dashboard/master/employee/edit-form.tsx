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
import { ArrowLeftStartOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { updateEmployee } from '@/action/master/employees';
import type { Department } from '@prisma/client';
import Image from 'next/image';
import ImageEdit from './image-edit';
import { Input } from "@/components/ui/input";
import CreateDeptForm from './create-dept-form';
import { EmployeeSchemaCreate } from "@/schemas";
import { toast } from "sonner";

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

  const Def = employee?.picture ?? '';
  const [imageUrl, setImageUrlEdit] = useState<string>(Def);
  const imageUrlOrDefault = imageUrl || '';
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isImageEditVisible, setIsImageEditVisible] = useState(false);
  const [isImageUrlVisible, setisImageUrlVisible] = useState(true);

  const form = useForm<z.infer<typeof EmployeeSchemaCreate>>({
    resolver: zodResolver(EmployeeSchemaCreate),
    defaultValues: {
      name: employee?.name || '',
      email: employee?.email || "",
      address: employee?.address || "",
      userDept: employee?.userDept || "",
    }
  });

  const onSubmit = (values: z.infer<typeof EmployeeSchemaCreate>) => {
    setLoading(true);
    // Gabungkan imageUrl ke dalam form values
    const updatedValues = { ...values, picture: imageUrl };
    console.log("Form Values:", updatedValues); // Check form values before submission

    updateEmployee(employee?.id ?? "", updatedValues)
      .then((data) => {
        setLoading(false);
        if (data?.error) {
          toast.error(data.error);
          setTimeout(() => {
            form.reset();
          }, 2000);
        }
        if (data?.success) {
          toast.success(data.success);
          setTimeout(() => {
            form.reset();
          }, 2000);
          router.push('/dashboard/master/employees');
        }
      });
  };

  const handleCancelImage = () => {
    setImageUrlEdit("");
    setIsImageVisible(!isImageVisible);
    setIsButtonVisible(!isButtonVisible);
    setIsImageEditVisible(isButtonVisible);
    setisImageUrlVisible(!isImageUrlVisible);
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

          <div className='mb-4'>
            {isImageEditVisible && (
              <ImageEdit setImageUrlEdit={setImageUrlEdit} />
            )}
          </div>

          <div className='mt-8'>
            {imageUrl && (
              <div className='mt-2'>
                {isImageUrlVisible && (
                  <label htmlFor="imageUrl" className='block text-sm font-medium'>
                    Old Image :
                  </label>
                )}
                <input
                  type="text"
                  id="picture"
                  name="picture"
                  // defaultValue={imageUrlOrDefault} // Menampilkan URL gambar
                  value={imageUrlOrDefault}
                  readOnly // Membuat input hanya untuk baca saja
                  className={`text-black text-sm font-medium py-0.5 w-64 border border-gray-200`}
                  required
                  hidden
                />
              </div>
            )}

            <div className='flex items-center gap-2 mt-2'>
              {isImageVisible && (
                <Image
                  className='border p-2 backdrop-blur-sm bg-white/30'
                  src={employee?.picture ?? ''}
                  alt="Preview"
                  width={150}
                  height={150}
                />
              )}
              {isButtonVisible && (
                <Button variant="outline" size="icon" type="button" onClick={handleCancelImage}>
                  <XMarkIcon className='text-red-600 h-4 w-4' />
                </Button>
              )}

              <div id="picture-error" aria-live="polite" aria-atomic="true">
                <p className='mt-2 text-sm text-red-500'>{employee?.picture}</p>
              </div>
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
