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
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import LokasiRakForm from "./lokasi-rak-form";
import RakForm from "./rak-form";



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
    // console.log('Default Value:', form.control._formValues);

    const onSubmit = (values: z.infer<typeof ProductSchema>) => {
        // console.log('Form Value:', values);
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
            <div className="w-full rounded-lg border p-4 shadow-lg mt-4 dark:bg-gray-950">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 p-4 mb-12 ">
                    <div className="mt-1 grid grid-cols-1 gap-4 gap-y-4 sm:grid-cols-3 items-center justify-center space-between ">
                        <div className="w-full space-y-6 items-center justify-center">
                            <FormField
                                control={form.control}
                                name="part_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Part Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Part Number Product"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full space-y-6">
                            <FormField
                                control={form.control}
                                name="part_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Part Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Part Name Product"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full space-y-6">
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
                                                placeholder="Nick Name Product"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="text-start text-xs mt-2">
                        <span className="italic font-normal text-xs text-blue-600 mt-8 w-full">Perhatikan conversi satuan jika ada perbedaan satuan unit</span>
                        <div className="flex-initial grid-flow-col sm:flex col-span-3 border rounded p-4">
                            <div className="flex col-span-1 p-2 w-full">
                                <div className="flex gap-x-2">
                                    <div className="flex-none w-3/4 gap-x-2">
                                        <FormField
                                            control={form.control}
                                            name="satuan_pemasukan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Entry Unit</FormLabel>
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
                                    </div>
                                    <div className="flex-none w-1/4">
                                        <FormField
                                            control={form.control}
                                            name="conversi_pemasukan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Conversi</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            type="number"
                                                            min="1"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex col-span-1 w-full p-2">
                                <div className="flex gap-x-2">
                                    <div className="flex-none w-3/4">
                                        <FormField
                                            control={form.control}
                                            name="satuan_penyimpanan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Stock Unit</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        disabled={isPending}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a Stock Unit" />
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
                                    </div>
                                    <div className="flex-none w-1/4">
                                        <FormField
                                            control={form.control}
                                            name="conversi_penyimpanan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Conversi</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            type="number"
                                                            min="1"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex col-span-1 w-full p-2">
                                <div className="flex gap-x-2">
                                    <div className="flex-initial md:flex-initial w-3/4">
                                        <FormField
                                            control={form.control}
                                            name="satuan_pengeluaran"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Out Unit</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a Out Unit" />
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
                                    </div>
                                    <div className="flex-initial md:flex-none w-1/4">
                                        <FormField
                                            control={form.control}
                                            name="conversi_pengeluaran"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Conversi</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            type="number"
                                                            min="1"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-initial md:flex-none mt-6">
                                        <UnitForm unitFind={unitFind} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-start text-xs mt-2">
                        <span className="italic font-normal text-blue-600">Batas maksimal dan minimal product di data stock</span>
                        <div className="flex-initial grid grid-cols-1 mt-0 md:grid-cols-2 gap-4 border rounded-md shadow-sm p-4">
                            <div className="flex-initial grid grid-cols-1 mt-0 md:grid-cols-1 gap-4 border rounded-md shadow-sm p-4">
                                <div className="flex col-span-1">
                                    <div className="flex w-full gap-x-5 p-2">
                                        <div className="flex-initial w-full">
                                            <FormField
                                                control={form.control}
                                                name="minStock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Minimum Stock</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                type="number"
                                                                min="0"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex-initial w-full">
                                            <FormField
                                                control={form.control}
                                                name="maxStock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Maximum Stock</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                type="number"
                                                                min="0"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-none col-span-1 md:col-span-2">
                                <div className="flex-initial w-full">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Spesification</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write specifications about the product you will input"
                                                        className="resize-none"
                                                        {...field}
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="text-start text-xs mb-0">
                        <span className="italic font-normal text-blue-600">Pemilahan product berdasarkan type, kategory, group dan brand.</span>

                        <div className="flex-initial grid grid-cols-1 mt-0 sm:grid-cols-4 gap-4 border rounded-md shadow-sm p-4">
                            <div className="flex w-full gap-x-2">
                                <div className="flex-initial w-full">
                                    <FormField
                                        control={form.control}
                                        name="jenisId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type Product</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type product" />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex-initial mt-6 ">
                                    <TypeForm typeFind={typeFind} />
                                </div>
                            </div>
                            <div className="flex w-full gap-x-2">
                                <div className="flex-initial w-full">
                                    <FormField
                                        control={form.control}
                                        name="kategoriId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category Product</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category product" />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex-initial mt-6 ">
                                    <CategoryForm categoryFind={categoryFind} />
                                </div>
                            </div>
                            <div className="flex w-full gap-x-2">
                                <div className="flex-initial w-full">
                                    <FormField
                                        control={form.control}
                                        name="groupId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Group Product</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select group product" />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex-initial mt-6 ">
                                    <GroupForm groupFind={groupFind} />
                                </div>
                            </div>
                            <div className="flex w-full gap-x-2">
                                <div className="flex-initial w-full">
                                    <FormField
                                        control={form.control}
                                        name="brandId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand Product</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select brand product" />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex-initial mt-6 ">
                                    <BrandForm brandFind={brandFind} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-start text-xs mb-0">
                        <span className="italic font-normal text-blue-600">Lokasi penempatan product tentukan disini</span>

                        <div className="flex-initial grid grid-cols-1 mt-0 sm:grid-cols-3 gap-4 border rounded-md shadow-sm p-4">
                            <div className="flex w-full gap-x-2">
                                <div className="flex-initial w-full">
                                    <FormField
                                        control={form.control}
                                        name="gudangId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gudang Product</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select gudang product" />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex-initial mt-6 ">
                                    <GudangForm gudangFind={gudangFind} />
                                </div>
                            </div>
                            <div className="flex w-full gap-x-2">
                                <div className="flex-initial w-full">
                                    <FormField
                                        control={form.control}
                                        name="lokasiRakId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lokasi Rak Product</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select lokasi rak product" />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex-initial mt-6 ">
                                    <LokasiRakForm lokasiRakFind={lokasiRakFind} />
                                </div>
                            </div>
                            <div className="flex w-full gap-x-2">
                                <div className="flex-initial w-full">
                                    <FormField
                                        control={form.control}
                                        name="rakId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rak Product</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select rak product" />
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex-initial mt-6 ">
                                    <RakForm rakFind={rakFind} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative ">
                        <Button className={`w-24 h-9 rounded-lg absolute right-0 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-2 px-4 rounded-lg`} type="submit">{loading ? 'Load Save...' : 'Save'}</Button>
                    </div>
                </form>
                <div className="flex items-center justify-end border p-2 pr-3 rounded-md shadow-sm">
                    <Link
                        href="/dashboard/master/products"
                        className="flex h-9 w-24 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <span>Exit</span>{' '}
                        <ArrowLeftStartOnRectangleIcon className="h-5 md:ml-4" />
                    </Link>
                </div>
            </div>
        </Form>
    )

}

export default CreateProductForm;