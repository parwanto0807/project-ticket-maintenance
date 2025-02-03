"use client";

import * as z from "zod";
import * as React from "react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { PriceSchema } from "@/schemas";
import { updatePrice } from "@/action/master/price";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { MataUang } from "@prisma/client";
import MtUangForm from "./mtUang-form";
import { formatCurrencyInvoice } from "@/lib/utils";

type PriceWithPartNumber = {
    id: string;
    idProduct: string;
    idMtUang: string;
    hargaHpp: number;
    hargaJual: number;
    default: boolean;
    createdAt: Date;
    updatedAt: Date;
    part_number?: {
        part_name: string;
    };
};

const UpdatePriceForm = ({
    priceFindById,
    mtUangFind
}: {
    priceFindById: PriceWithPartNumber,
    mtUangFind: MataUang[],
}) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const mtUangFindName = mtUangFind.find((mtUangFind) => mtUangFind.id === priceFindById.idMtUang);
    console.log(mtUangFindName)

    const form = useForm<z.infer<typeof PriceSchema>>({
        resolver: zodResolver(PriceSchema),
        defaultValues: {
            idProduct: priceFindById.idProduct || '',
            idMtUang: priceFindById.idMtUang || 'Rp',
            hargaHpp: priceFindById.hargaHpp,
            default: priceFindById.default || false,
            hargaJual: priceFindById.hargaJual,
        },
    });

    const onSubmit = (values: z.infer<typeof PriceSchema>) => {
        setLoading(true);
        setError("");
        setSuccess("");

        startTransition(() => {
            updatePrice(priceFindById.id, values)
                .then((data) => {
                    setLoading(false);
                    if (data?.error) {
                        toast.error(data.error);
                    } else if (data?.success) {
                        toast.success(data.success);
                        form.reset();
                        router.push('/dashboard/master/price-product');
                    }
                });
        });
    };

    return (
        <Form {...form}>
            <div className='mt-6 grid grid-cols-1 sm:grid-cols-4 items-center justify-center space-between'>
                <div className="flex pt-2 pb-0 gap-4">
                    <div className="flex-initial w-96 text-xs text-blue-700 italic md:text-nowrap">
                        <span>Input data master Price Product ini dengan lengkap dan dapat di pertanggungjawabkan</span>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                    </div>
                </div>
            </div>
            <div className="w-full rounded-lg border px-4 shadow-lg mt-4">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 mb-12">
                    <div className="mt-1 grid grid-cols-1 gap-4 gap-y-1 sm:grid-cols-1 items-center justify-center space-between">
                        <div className='w-full md:w-1/3 space-y-6 items-center justify-center'>
                            <FormField
                                control={form.control}
                                name='idProduct'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase">Part Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                disabled={isPending}
                                                value={priceFindById.part_number?.part_name || ''}
                                                placeholder="Part Name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex w-full gap-x-2 mt-4 md:w-1/2 items-center justify-center space-between mb-4">
                            <div className="w-full col-span-2 space-y-6 items-center justify-center">
                                <FormField
                                    control={form.control}
                                    name="idMtUang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase">Currency</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a Currency " />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {mtUangFind?.map(mtUangFind => (
                                                        <SelectItem key={mtUangFind.id} value={mtUangFind.id}>
                                                            {mtUangFind.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full space-y-6 mt-8">
                                <MtUangForm mtUangFind={mtUangFind} />
                            </div>
                        </div>

                        <div className='w-full md:w-1/4 space-y-6 items-center justify-center'>
                            <FormField
                                control={form.control}
                                name='hargaHpp'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >COST OF PURCHASE: {mtUangFindName ? formatCurrencyInvoice(Number(field.value), mtUangFindName.note) : 'N/A'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                disabled={isPending}
                                                placeholder="Harga Hpp"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='w-full md:w-1/4 space-y-6 items-center justify-center'>
                            <FormField
                                control={form.control}
                                name='hargaJual'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SALES PRICE: {mtUangFindName ? formatCurrencyInvoice(Number(field.value), mtUangFindName.note) : 'N/A'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                disabled={isPending}
                                                placeholder="Harga Jual"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='w-full md:w-1/4 space-y-6 items-center justify-center mt-4'>
                            <FormField
                                control={form.control}
                                name="default"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Default</FormLabel>
                                            <FormDescription>
                                                This is a default price
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button
                        disabled={loading}
                        type="submit"
                        className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {loading && (
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        )}
                        Update
                    </Button>
                </form>
            </div>
            <div className='flex justify-start text-start mt-4'>
                <Button
                    type="button"
                    variant="outline"
                    className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                    onClick={() => router.push('/dashboard/master/price-product')}
                >
                    <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-white-500" />
                    Back to Price Product
                </Button>
            </div>
        </Form>
    );
};

export default UpdatePriceForm;
