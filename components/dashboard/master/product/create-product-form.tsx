"use client"

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema } from "@/schemas";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/action/master/product";
import {
    JenisProduct,
    Unit,
    KategoriProduct,
    Group,
    Brand,
    Gudang,
    LokasiRak,
    Rak
} from "@prisma/client";
import UnitForm from "./unit-form";
import TypeForm from "./type-form";
import CategoryForm from "./category-form";
import GroupForm from "./group-form";
import BrandForm from "./brand-form";
import GudangForm from "./gudang-form";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeftIcon, PlusCircleIcon, Package, Layers, Tag, Box, Warehouse, MapPin, Settings } from "lucide-react";
import LokasiRakForm from "./lokasi-rak-form";
import RakForm from "./rak-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CreateProductForm = ({
    unitFind,
    typeFind,
    categoryFind,
    groupFind,
    brandFind,
    gudangFind,
    lokasiRakFind,
    rakFind,
}: {
    unitFind: Unit[];
    typeFind: JenisProduct[];
    categoryFind: KategoriProduct[];
    groupFind: Group[];
    brandFind: Brand[];
    gudangFind: Gudang[];
    lokasiRakFind: LokasiRak[];
    rakFind: Rak[];
}) => {

    const [isPending] = useTransition();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            part_number: "",
            part_name: "",
            nick_name: "",
            satuan_pemasukan: "",
            satuan_penyimpanan: "",
            satuan_pengeluaran: "",
            conversi_pengeluaran: 1,
            conversi_pemasukan: 1,
            conversi_penyimpanan: 1,
            minStock: 0,
            maxStock: 0,
            description: "",
            groupId: "",
            jenisId: "",
            kategoriId: "",
            brandId: "",
            gudangId: "",
            rakId: "",
            lokasiRakId: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });

    const onSubmit = (values: z.infer<typeof ProductSchema>) => {
        setLoading(true)
        createProduct(values)
            .then((data) => {
                if (data?.error) {
                    setLoading(false);
                    toast.error(data.error);
                    setTimeout(() => {
                        form.reset();
                    }, 2000);
                }
                if (data?.success) {
                    setLoading(false);
                    toast.success(data.success);
                    setTimeout(() => {
                        form.reset();
                    }, 2000);
                    router.push('/dashboard/master/products');
                }
            })
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
                                <h1 className="text-lg md:text-2xl font-bold">Create New Product</h1>
                                <p className="text-blue-100 text-xs md:text-sm">Add a new product to your inventory system</p>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/master/products"
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
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Basic Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Product Identification */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Package className="h-5 w-5 text-blue-600" />
                                        Product Identification
                                    </CardTitle>
                                    <CardDescription>
                                        Basic product information for identification
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="part_number"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                                        Part Number *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="e.g., PRD-001"
                                                            className="h-11"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="part_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Part Name *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="e.g., Main Circuit Board"
                                                            className="h-11"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="nick_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nick Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="e.g., MCB-001"
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

                            {/* Unit Configuration */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Box className="h-5 w-5 text-green-600" />
                                        Unit Configuration
                                    </CardTitle>
                                    <CardDescription>
                                        Configure measurement units and conversions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Entry Unit */}
                                            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <Box className="h-4 w-4 text-blue-600" />
                                                    <FormLabel className="text-blue-700 font-medium">Entry Unit</FormLabel>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="satuan_pemasukan"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                disabled={isPending}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11">
                                                                        <SelectValue placeholder="Select unit" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {unitFind?.map(unitFind => (
                                                                        <SelectItem key={unitFind.id} value={unitFind.name}>
                                                                            {unitFind.name}
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
                                                    name="conversi_pemasukan"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Conversion Factor</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    disabled={isPending}
                                                                    type="number"
                                                                    min="1"
                                                                    className="h-9"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Storage Unit */}
                                            <div className="space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <Box className="h-4 w-4 text-green-600" />
                                                    <FormLabel className="text-green-700 font-medium">Storage Unit</FormLabel>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="satuan_penyimpanan"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                disabled={isPending}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11">
                                                                        <SelectValue placeholder="Select unit" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {unitFind?.map(unitFind => (
                                                                        <SelectItem key={unitFind.id} value={unitFind.name}>
                                                                            {unitFind.name}
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
                                                    name="conversi_penyimpanan"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Conversion Factor</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    disabled={isPending}
                                                                    type="number"
                                                                    min="1"
                                                                    className="h-9"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Output Unit */}
                                            <div className="space-y-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <Box className="h-4 w-4 text-orange-600" />
                                                    <FormLabel className="text-orange-700 font-medium">Output Unit</FormLabel>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="satuan_pengeluaran"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                disabled={isPending}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="h-11">
                                                                        <SelectValue placeholder="Select unit" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {unitFind?.map(unitFind => (
                                                                        <SelectItem key={unitFind.id} value={unitFind.name}>
                                                                            {unitFind.name}
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
                                                    name="conversi_pengeluaran"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Conversion Factor</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    disabled={isPending}
                                                                    type="number"
                                                                    min="1"
                                                                    className="h-9"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <UnitForm unitFind={unitFind} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Stock Configuration */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Layers className="h-5 w-5 text-purple-600" />
                                        Stock Configuration
                                    </CardTitle>
                                    <CardDescription>
                                        Set minimum and maximum stock levels
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="minStock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                                            Minimum Stock
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                type="number"
                                                                min="0"
                                                                className="h-11"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="maxStock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                                            Maximum Stock
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                type="number"
                                                                min="0"
                                                                className="h-11"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem className="h-full">
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                                        Specifications
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Write detailed specifications about the product..."
                                                            className="min-h-[120px] resize-none"
                                                            {...field}
                                                            disabled={isPending}
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

                        {/* Right Column - Classification & Location */}
                        <div className="space-y-6">
                            {/* Product Classification */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Tag className="h-5 w-5 text-orange-600" />
                                        Product Classification
                                    </CardTitle>
                                    <CardDescription>
                                        Categorize and classify the product
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="jenisId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Type</FormLabel>
                                                    <div className="flex gap-2">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-11 flex-1">
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {typeFind?.map(typeFind => (
                                                                    <SelectItem key={typeFind.id} value={typeFind.id}>
                                                                        {typeFind.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <TypeForm typeFind={typeFind} />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="kategoriId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <div className="flex gap-2">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-11 flex-1">
                                                                    <SelectValue placeholder="Select category" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {categoryFind?.map(categoryFind => (
                                                                    <SelectItem key={categoryFind.id} value={categoryFind.id}>
                                                                        {categoryFind.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <CategoryForm categoryFind={categoryFind} />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="groupId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Group</FormLabel>
                                                    <div className="flex gap-2">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-11 flex-1">
                                                                    <SelectValue placeholder="Select group" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {groupFind?.map(groupFind => (
                                                                    <SelectItem key={groupFind.id} value={groupFind.id}>
                                                                        {groupFind.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <GroupForm groupFind={groupFind} />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="brandId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Brand</FormLabel>
                                                    <div className="flex gap-2">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-11 flex-1">
                                                                    <SelectValue placeholder="Select brand" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {brandFind?.map(brandFind => (
                                                                    <SelectItem key={brandFind.id} value={brandFind.id}>
                                                                        {brandFind.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <BrandForm brandFind={brandFind} />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Storage Location */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                        Storage Location
                                    </CardTitle>
                                    <CardDescription>
                                        Define product storage location
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="gudangId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                                                    Warehouse
                                                </FormLabel>
                                                <div className="flex gap-2">
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 flex-1">
                                                                <SelectValue placeholder="Select warehouse" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {gudangFind?.map(gudangFind => (
                                                                <SelectItem key={gudangFind.id} value={gudangFind.id}>
                                                                    {gudangFind.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <GudangForm gudangFind={gudangFind} />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lokasiRakId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rack Location</FormLabel>
                                                <div className="flex gap-2">
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 flex-1">
                                                                <SelectValue placeholder="Select location" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {lokasiRakFind?.map(lokasiRakFind => (
                                                                <SelectItem key={lokasiRakFind.id} value={lokasiRakFind.id}>
                                                                    {lokasiRakFind.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <LokasiRakForm lokasiRakFind={lokasiRakFind} />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="rakId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rack</FormLabel>
                                                <div className="flex gap-2">
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 flex-1">
                                                                <SelectValue placeholder="Select rack" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {rakFind?.map(rakFind => (
                                                                <SelectItem key={rakFind.id} value={rakFind.id}>
                                                                    {rakFind.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <RakForm rakFind={rakFind} />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-2.5"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Creating Product...
                                </>
                            ) : (
                                <>
                                    <PlusCircleIcon className="h-5 w-5" />
                                    Create Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    )
}

export default CreateProductForm;