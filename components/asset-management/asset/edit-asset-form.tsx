"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { $Enums } from "@prisma/client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import TypeAssetForm from "./type-asset-form";
import Link from "next/link";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { updateAsset } from "@/action/asset/asset";

type Employee = {
    id: string;
    name: string;
    email: string;
    address: string;
    picture: string;
    signInvoice: boolean;
    userDept: string;
    createdAt: Date;
    updatedAt: Date;
    department?: {
        id: string;
        dept_name: string;
    };
};
enum AssetStatus {
    AVAILABLE = "AVAILABLE",
    IN_USE = "IN_USE",
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
    DECOMMISSIONED = "DECOMMISSIONED"
}

type Asset = {
    id: string;
    assetNumber: string;
    status: $Enums.AssetStatus;
    location: string | null;
    purchaseDate: Date | null;
    purchaseCost: number | null;
    residualValue: number | null;
    usefulLife: number | null;
    createdAt: Date;
    updatedAt: Date;
    assetTypeId: string;
    departmentId: string;
    assetImage1: string | null;
    productId: string;
    employeeId: string | null;
    assetType: { id: string; name: string; createdAt: Date; updatedAt: Date; description: string | null; kode: string; };
    department: {
        id: string;
        dept_name: string;
        note: string;
        createdAt: Date;
        updatedAt: Date;
    };
    product: { id: string, part_name: string };
    employee?: Employee | null;
};

const EditAssetForm = ({
    assetTypeFind,
    assetFind,
    employeeDataFind,
}: {
    assetTypeFind: { id: string; name: string; createdAt: Date; updatedAt: Date; description: string | null; kode: string; }[];
    assetFind: Asset;
    employeeDataFind: Employee[];
}) => {
    const [isPending, startTransition] = useTransition();
    const [date, setDate] = useState<Date | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<{ id: string } | null>(null);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState<{ dept_name: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const urlToFile = async (url: string, filename: string): Promise<File> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    };
    const [fileName, setFileName] = useState<string>('');

    const form = useForm<z.infer<typeof AssetSchema>>({
        resolver: zodResolver(AssetSchema),
        defaultValues: {
            assetNumber: assetFind.assetNumber,
            status: assetFind.status,
            location: assetFind.location || "",
            purchaseDate: assetFind.purchaseDate ? new Date(assetFind.purchaseDate) : undefined,
            purchaseCost: assetFind.purchaseCost || 0,
            residualValue: assetFind.residualValue || 0,
            usefulLife: assetFind.usefulLife || 0,
            assetTypeId: assetFind.assetTypeId,
            productId: assetFind.productId,
            employeeId: assetFind.employeeId || "",
            departmentId: assetFind.departmentId || "",
            assetImage1: undefined,
        },
    });
    // console.log('Default Value:', form.control._formValues);

    const { setValue } = form;

    useEffect(() => {
        if (assetFind?.assetImage1) {
            setPreviewImage(assetFind.assetImage1);
            setFileName(assetFind.assetImage1|| "");
        }
    }, [assetFind?.assetImage1]);

    useEffect(() => {
        if (assetFind?.purchaseDate) {
            setInputValue(new Date(assetFind.purchaseDate).toISOString().split("T")[0]);
        }
    }, [assetFind?.purchaseDate]);

    // Contoh penggunaan (jika assetFind.assetImage1 ada)
    useEffect(() => {
        if (assetFind?.assetImage1) {
            urlToFile(assetFind.assetImage1, "image.jpg").then((file) => {
                form.setValue("assetImage1", file);
            });
        }
    }, [assetFind?.assetImage1, form]);


    useEffect(() => {
        if (date) {
            console.log('Selected date:', date);
        }
    }, [date]);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (regex.test(value)) {
            const parsedDate = new Date(value);
            if (!isNaN(parsedDate.getTime())) {
                setDate(parsedDate);
                form.setValue('purchaseDate', parsedDate);
            }
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size too large (max 2MB)");
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setValue("assetImage1", file);
            setFileName(file.name);
        }
    };

    // const handleSelectProduct = (product: ProductNameOnly) => {
    //     setSelectedProduct(product);
    //     form.setValue("productId", product.id);
    //     setOpen(false);
    // };

    const handleSelectEmployee = (employeeId: string) => {
        form.setValue("employeeId", employeeId);
        const selectedEmployee = employeeDataFind?.find(emp => emp.id === employeeId);
        if (selectedEmployee?.department) {
            setSelectedDepartmentId({ id: selectedEmployee.department.id });
            setSelectedDepartmentName({ dept_name: selectedEmployee.department.dept_name });
            form.setValue("departmentId", selectedEmployee.department.id);
        }
    };

    const handleSelectAssetType = async (value: string) => {
        setValue("assetTypeId", value);
        setLoading(true);
        try {
            const response = await fetch(`/api/generateAssetNumber?assetTypeId=${value}`);
            const data = await response.json();
            if (response.ok) {
                setValue("assetNumber", data.assetNumber);
            }
        } catch (error) {
            console.error("Error generating asset number:", error);
        } finally {
            setLoading(false);
        }
    };


    const onSubmit = (values: z.infer<typeof AssetSchema>) => {
        setLoading(true);

        const formData = new FormData();
        // Tambahkan field secara eksplisit
        formData.append('assetNumber', values.assetNumber);
        formData.append('status', values.status);
        formData.append('location', values.location || '');
        if (values.purchaseDate) {
            formData.append('purchaseDate', values.purchaseDate.toISOString());
        }
        formData.append('purchaseCost', (values.purchaseCost ?? 0).toString());
        formData.append('residualValue', (values.residualValue ?? 0).toString());
        formData.append('usefulLife', (values.usefulLife ?? 0).toString())
        formData.append('assetTypeId', values.assetTypeId);
        formData.append('productId', values.productId);

        if (values.employeeId) formData.append('employeeId', values.employeeId);
        if (values.departmentId) formData.append('departmentId', values.departmentId);

        if (values.assetImage1 instanceof File) {
            formData.append('assetImage1', values.assetImage1);
        }

        // Tambahkan timestamp
        formData.append('createdAt', new Date().toISOString());
        formData.append('updatedAt', new Date().toISOString());

        startTransition(() => {
            updateAsset(assetFind?.id ?? '', formData)
                .then((data) => {
                    if (data?.error) {
                        toast.error(data.error);
                    }
                    if (data?.success) {
                        toast.success(data.success);
                        router.push('/dashboard/asset/asset-list');
                    }
                })
                .finally(() => setLoading(false));
        });
    };

    return (
        <Form {...form}>
            <div className="w-full rounded-lg border p-4 shadow-lg mt-4 dark:bg-gray-950">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 p-4 mb-12"
                    encType="multipart/form-data"
                >
                    <div className="flex-initial grid grid-cols-1 gap-4 sm:grid-cols-2 sm:justify-between uppercase">
                        <div className="flex w-full gap-x-2 items-center justify-center">
                            <div className="flex-initial w-full">
                                <FormField
                                    control={form.control}
                                    name="assetTypeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Asset Type</FormLabel>
                                            <Select onValueChange={handleSelectAssetType} defaultValue={field.value} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type asset" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {assetTypeFind?.map(assetTypeFind => (
                                                        <SelectItem key={assetTypeFind.id} value={assetTypeFind.id}>
                                                            {assetTypeFind.name} {assetTypeFind.kode}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex-initial md:flex-none mt-8">
                                <TypeAssetForm assetTypeFind={assetTypeFind} />
                            </div>
                        </div>
                        <div className="flex w-full md:justify-end sm:ml-auto">
                            <FormField
                                control={form.control}
                                name="assetNumber"
                                render={({ field }) => (
                                    <FormItem className="text-blue-700 gap-x-2 text-center uppercase">
                                        <FormLabel>Asset Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="text-blue-700 font-bold text-lg text-center uppercase"
                                                disabled={isPending}
                                                placeholder="Asset Number"
                                                readOnly

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="mt-1 grid grid-cols-1 gap-4 gap-y-4 sm:grid-cols-1 items-center justify-center space-between uppercase">
                        <div className='grid grid-cols-1 w-full space-y-2 items-center justify-center'>
                            <FormField
                                control={form.control}
                                name="productId"
                                render={({ field }) => (
                                    <FormItem className="text-blue-700 gap-x-2 text-center uppercase">
                                        <FormLabel>Asset Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="text-blue-700 font-bold text-lg text-center uppercase"
                                                value={
                                                    assetFind.product.part_name
                                                }
                                                disabled={isPending}
                                                placeholder="Asset Name"
                                                readOnly

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                    </div>
                    <div className="flex w-full gap-x-2 uppercase">
                        <div className="flex-initial w-full">
                            <FormField
                                control={form.control}
                                name="employeeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Asset</FormLabel>
                                        <Select
                                            onValueChange={handleSelectEmployee}
                                            defaultValue={field.value ?? ""}
                                            disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select user asset" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {employeeDataFind?.map(data => (
                                                    <SelectItem key={data.id} value={data.id}>
                                                        {data.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="departmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={selectedDepartmentId?.id ?? ""}
                                                disabled={isPending}
                                                type="hidden"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Input value={selectedDepartmentName?.dept_name ?? assetFind?.department?.dept_name ?? ""} readOnly />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>
                    </div>

                    <div className="flex w-full gap-2 uppercase">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={isPending}
                                                type="text"
                                                min="1"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-1/2">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Asset Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Entry Unit " />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(AssetStatus).map((status: AssetStatus) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 mt-0 sm:grid-cols-4 gap-2 uppercase">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="purchaseDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="purchaseDate">Purchase Date</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col space-y-2">
                                                {/* Input manual */}
                                                <Input
                                                    {...field}
                                                    type="date"
                                                    value={inputValue}
                                                    disabled={isPending}
                                                    onChange={handleInputChange}
                                                    placeholder="YYYY-MM-DD"
                                                    className="w-[280px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="purchaseCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase Cost</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="price"
                                                min="1"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="residualValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Residual Value</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="price"
                                                min="1"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="usefulLife"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Useful Life</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="number"
                                                min="1"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 items-center justify-center">
                        <Card className="w-full py-2 px-2 border-2 mt-4 rounded-sm items-center justify-center">
                            <h3 className="w-full font-bold items-center justify-center text-center">Upload Images</h3>
                            <div className="mb-2 pt-2">
                                <input
                                    type="file"
                                    name="assetImage1"
                                    className="file:h-full file:mr-4 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-gray-300 file:cursor-pointer border border-gray-400 w-full"
                                    accept="image/*"
                                    onChange={handleImageChange}
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

                    <div className="relative ">
                        <Button
                            className={`w-24 h-9 rounded-lg absolute right-0 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-semibold py-2 px-4 rounded-lg`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Mengupdate...' : 'Update'}
                        </Button>
                    </div>
                </form>
                <div className="flex items-center justify-end border p-2 pr-3 rounded-md shadow-sm">
                    <Link
                        href="/dashboard/asset/asset-list"
                        className="flex h-9 w-24 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <span>Exit</span>
                        <ArrowLeftStartOnRectangleIcon className="h-5 md:ml-4" />
                    </Link>
                </div>
            </div>
        </Form>
    )
}

export default EditAssetForm;