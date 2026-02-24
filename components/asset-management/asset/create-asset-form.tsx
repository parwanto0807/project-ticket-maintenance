"use client"

import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetSchema } from "@/schemas";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { AssetType } from "@prisma/client";
import { QRCodeCanvas } from "qrcode.react";
import { resizeImage } from "@/lib/resizeImage";

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

import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeftIcon, PlusCircleIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { createAsset } from "@/action/asset/asset";
import { AssetStatus } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, ScanLine, Building, MapPin, Calendar, DollarSign, Calculator, User, Package } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import TypeAssetForm from "./type-asset-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";

type ProductNameOnly = {
    id: string;
    part_name: string;
    part_number: string;
};

const CreateAssetForm = ({
    assetTypeFind,
    productDataFind,
    totalPages,
    employeeDataFind,
}: {
    assetTypeFind: AssetType[];
    totalPages: number,
    productDataFind: ProductNameOnly[];
    employeeDataFind: Employee[];
}) => {

    const [isPending, startTransition] = useTransition();
    const [date, setDate] = useState<Date | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [searchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductNameOnly | null>(null);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<{ id: string } | null>(null);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState<{ dept_name: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [lifeUnit, setLifeUnit] = useState<'years' | 'months'>('years');
    const [displayLife, setDisplayLife] = useState<number>(0);

    const form = useForm<z.infer<typeof AssetSchema>>({
        resolver: zodResolver(AssetSchema),
        defaultValues: {
            assetNumber: "",
            status: "AVAILABLE",
            location: "",
            purchaseDate: new Date(),
            purchaseCost: 0,
            residualValue: 0,
            usefulLife: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            assetTypeId: "",
            productId: "",
            employeeId: "",
            departmentId: "",
            assetImage1: undefined,
        }
    });

    const { setValue } = form;

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

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.size > 0) {
            const imageUrl = URL.createObjectURL(file);
            const resizedFile = await resizeImage(file, 800, 800);
            setPreviewImage(imageUrl);
            setValue("assetImage1", resizedFile);
        } else {
            setPreviewImage(null);
        }
    };

    const filteredProducts = productDataFind.filter((product) =>
        product.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.part_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectProduct = (product: ProductNameOnly) => {
        setSelectedProduct(product);
        form.setValue("productId", product.id);
        setOpen(false);
    };

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
                if (data.assetNumber && typeof data.assetNumber === "object" && data.assetNumber.assetNumber) {
                    setValue("assetNumber", data.assetNumber.assetNumber);
                } else {
                    console.error("Asset number is not in the expected format.");
                }
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
        formData.append('purchaseDate', values.purchaseDate?.toISOString()?.split('T')[0] || '');
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
            createAsset(formData)
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
            <div className="max-w-7xl mx-auto rounded-xl border bg-white dark:bg-gray-950 shadow-sm mt-6">
                {/* Header */}
                <div className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-sm md:text-2xl font-bold">Create New Asset</h1>
                                <p className="text-xs md:text-sm text-blue-100">Add a new asset to your inventory system</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/asset/asset-list"
                            className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to List
                        </Link>
                    </div>
                </div>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="px-2 py-6"
                    encType="multipart/form-data"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Basic Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Asset Type & Number Section */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ScanLine className="h-5 w-5 text-blue-600" />
                                        Asset Identification
                                    </CardTitle>
                                    <CardDescription>
                                        Basic information for asset identification and tracking
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="assetTypeId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-muted-foreground" />
                                                        Asset Type *
                                                    </FormLabel>
                                                    <div className="flex gap-2">
                                                        <Select onValueChange={handleSelectAssetType} defaultValue={field.value} disabled={isPending}>
                                                            <FormControl>
                                                                <SelectTrigger className="flex-1">
                                                                    <SelectValue placeholder="Select asset type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {assetTypeFind?.map(assetTypeFind => (
                                                                    <SelectItem key={assetTypeFind.id} value={assetTypeFind.id}>
                                                                        <div className="flex items-center gap-2">
                                                                            <span>{assetTypeFind.name}</span>
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                {assetTypeFind.kode}
                                                                            </Badge>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <TypeAssetForm assetTypeFind={assetTypeFind} />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="assetNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <QrCodeIcon className="h-4 w-4 text-muted-foreground" />
                                                        Asset Number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="font-mono font-bold text-blue-700 text-lg uppercase bg-blue-50 border-blue-200"
                                                            disabled={isPending}
                                                            placeholder="Auto-generated"
                                                            readOnly
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* QR Code Display */}
                                    {form.watch("assetNumber") && (
                                        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                                            <p className="text-sm font-medium text-blue-900 mb-3">Asset QR Code</p>
                                            <div className="p-4 bg-white rounded-xl shadow-sm border-2 border-blue-200">
                                                <QRCodeCanvas
                                                    value={form.watch("assetNumber")}
                                                    size={140}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <p className="text-xs text-blue-600 mt-2 font-mono">
                                                {form.watch("assetNumber")}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Product Selection */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Package className="h-5 w-5 text-green-600" />
                                        Product Information
                                    </CardTitle>
                                    <CardDescription>
                                        Select the product associated with this asset
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="productId"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Asset Product *</FormLabel>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={open}
                                                            className="w-full justify-between h-11"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {selectedProduct ? (
                                                                    <>
                                                                        <Package className="h-4 w-4 text-green-600" />
                                                                        <span className="font-medium">{selectedProduct.part_name}</span>
                                                                        <Badge variant="outline" className="ml-2">
                                                                            {selectedProduct.part_number}
                                                                        </Badge>
                                                                    </>
                                                                ) : (
                                                                    "Select product..."
                                                                )}
                                                            </div>
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0 max-w-2xl" align="start">
                                                        <Command>
                                                            <div className="p-2 border-b">
                                                                <Search placeholder="Search by part name or number..." />
                                                            </div>
                                                            <CommandList className="max-h-64">
                                                                <CommandEmpty>No product found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {filteredProducts.map((product) => (
                                                                        <CommandItem
                                                                            key={product.id}
                                                                            onSelect={() => handleSelectProduct(product)}
                                                                            disabled={isPending}
                                                                            className="py-3"
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-3 h-4 w-4",
                                                                                    selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <div className="flex flex-col flex-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="font-medium">{product.part_name}</span>
                                                                                    <Badge variant="secondary" className="text-xs">
                                                                                        {product.part_number}
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                            <div className="border-t p-2">
                                                                <Pagination totalPages={totalPages} />
                                                            </div>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Assignment & Location */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5 text-purple-600" />
                                        Assignment & Location
                                    </CardTitle>
                                    <CardDescription>
                                        Assign asset to user and specify location
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="employeeId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        Assigned User
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={handleSelectEmployee}
                                                        defaultValue={field.value ?? ""}
                                                        disabled={isPending}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Select user" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {employeeDataFind?.map(data => (
                                                                <SelectItem key={data.id} value={data.id}>
                                                                    <div className="flex items-center gap-2">
                                                                        <span>{data.name}</span>
                                                                        {data.department && (
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {data.department.dept_name}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-3">
                                            <FormField
                                                control={form.control}
                                                name="departmentId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} value={selectedDepartmentId?.id ?? ""} disabled type="hidden" />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Building className="h-4 w-4 text-muted-foreground" />
                                                    Department
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={selectedDepartmentName?.dept_name ?? "Not assigned"}
                                                        readOnly
                                                        className="bg-muted/50 h-11"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        Location
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            disabled={isPending}
                                                            placeholder="Enter asset location"
                                                            className="h-11"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Additional Information */}
                        <div className="space-y-6">
                            {/* Status & Financial Information */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Calculator className="h-5 w-5 text-orange-600" />
                                        Status & Financials
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Asset Status</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    disabled={isPending}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-11">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(AssetStatus).map((status: AssetStatus) => (
                                                            <SelectItem key={status} value={status}>
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`h-2 w-2 rounded-full ${status === 'AVAILABLE' ? 'bg-green-500' :
                                                                        status === 'IN_USE' ? 'bg-blue-500' :
                                                                            status === 'UNDER_MAINTENANCE' ? 'bg-yellow-500' :
                                                                                'bg-red-500'
                                                                        }`} />
                                                                    {status}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="purchaseDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    Purchase Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="date"
                                                        value={inputValue}
                                                        onChange={handleInputChange}
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="purchaseCost"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    Purchase Cost
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                        className="h-11"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="residualValue"
                                        render={({ field }) => {
                                            const purchaseCost = form.watch("purchaseCost") || 0;
                                            const isLowResidual = purchaseCost > 0 && (field.value ?? 0) > 0 && (field.value ?? 0) < (purchaseCost * 0.05);

                                            return (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>Residual Value</FormLabel>
                                                        {isLowResidual && (
                                                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-200 animate-pulse">
                                                                Low Value {"(< 5%)"}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            className={cn(
                                                                "h-11",
                                                                isLowResidual && "border-amber-300 focus-visible:ring-amber-500"
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            );
                                        }}
                                    />

                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Useful Life
                                            </label>
                                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (lifeUnit === 'months') {
                                                            setLifeUnit('years');
                                                            setDisplayLife(prev => Math.floor(prev / 12));
                                                        }
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                                                        lifeUnit === 'years'
                                                            ? "bg-white dark:bg-slate-950 shadow-sm text-blue-600"
                                                            : "text-slate-500 hover:text-slate-700"
                                                    )}
                                                >
                                                    YEARS
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (lifeUnit === 'years') {
                                                            setLifeUnit('months');
                                                            setDisplayLife(prev => prev * 12);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                                                        lifeUnit === 'months'
                                                            ? "bg-white dark:bg-slate-950 shadow-sm text-blue-600"
                                                            : "text-slate-500 hover:text-slate-700"
                                                    )}
                                                >
                                                    MONTHS
                                                </button>
                                            </div>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="usefulLife"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                value={displayLife}
                                                                disabled={isPending}
                                                                type="number"
                                                                min="1"
                                                                onChange={(e) => {
                                                                    const val = Number(e.target.value);
                                                                    setDisplayLife(val);
                                                                    // Auto convert to months for internal state
                                                                    const months = lifeUnit === 'years' ? val * 12 : val;
                                                                    field.onChange(months);
                                                                }}
                                                                className="h-11 pr-16"
                                                            />
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
                                                                {lifeUnit}
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {lifeUnit === 'years'
                                                            ? `Equals to ${displayLife * 12} months for depreciation accuracy.`
                                                            : `Stored directly as ${displayLife} months.`}
                                                    </p>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Image Upload */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ImageIcon className="h-5 w-5 text-purple-600" />
                                        Asset Image
                                    </CardTitle>
                                    <CardDescription>
                                        Upload an image of the asset
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <Input
                                            type="file"
                                            name="assetImage1"
                                            className="file:h-6 file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700 file:cursor-pointer border border-gray-300 rounded-lg cursor-pointer"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {previewImage && (
                                            <div className="mt-4">
                                                <div className="relative rounded-lg overflow-hidden border-2 border-blue-200">
                                                    <Image
                                                        src={previewImage}
                                                        alt="Asset preview"
                                                        width={400}
                                                        height={300}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-8 mt-8 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading || isPending}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-2.5 dark:text-white"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Creating Asset...
                                </>
                            ) : (
                                <>
                                    <PlusCircleIcon className="h-5 w-5" />
                                    Create Asset
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    )
}

// Tambahkan icon untuk image
function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    )
}

export default CreateAssetForm;