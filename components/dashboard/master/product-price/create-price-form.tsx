"use client";

import * as z from "zod";
import * as React from "react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { PriceSchema } from "@/schemas";
import { createPrice } from "@/action/master/price";
import { Check, ChevronsUpDown } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Switch } from "@/components/ui/switch";
import Search from "@/components/ui/search";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { MataUang } from "@prisma/client";
import MtUangForm from "./mtUang-form";


type ProductNameOnly = {
    id: string;
    part_name: string;
    part_number: string;
};

const CreatePriceForm = ({
    productFind,
    totalPages,
    mtUangFind
}: {
    productFind: ProductNameOnly[],
    totalPages: number,
    mtUangFind: MataUang[],
}) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [searchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductNameOnly | null>(null);
    const router = useRouter();


    // Find the object with note "IDR"
    const defaultCurrencyObject = mtUangFind.find(item => item.note === 'IDR');
    const defaultCurrency = defaultCurrencyObject ? defaultCurrencyObject.id : '';

    const form = useForm<z.infer<typeof PriceSchema>>({
        resolver: zodResolver(PriceSchema),
        defaultValues: {
            idProduct: "",
            idMtUang: defaultCurrency,
            hargaHpp: 0,
            default: false,
            hargaJual: 0,
        },
    });

    const onSubmit = (values: z.infer<typeof PriceSchema>) => {
        setLoading(true);
        setError("");
        setSuccess("");

        startTransition(() => {
            createPrice(values)
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
        })

    };

    // const handleSearchChange = (search: string) => {
    //     setSearchQuery(search);
    // };

    const filteredProducts = productFind.filter((product) =>
        product.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.part_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectProduct = (product: ProductNameOnly) => {
        setSelectedProduct(product);
        form.setValue("idProduct", product.id); // Set the product ID in the form
        setOpen(false);
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
                        <div className="mt-1 grid grid-cols-2 gap-4 gap-y-4 sm:grid-cols-8 items-center justify-center space-between mb-4">
                            <div className="w-full col-span-2 space-y-6 items-center justify-center">
                                <FormField
                                    control={form.control}
                                    name="idMtUang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Currency</FormLabel>
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
                        <div className="text-xs">Part Name</div>
                        <div className='w-full space-y-6 items-center justify-center'>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full md:w-1/2 justify-between"
                                    >
                                        {selectedProduct
                                            ? selectedProduct.part_name
                                            : "Select part name ..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0 max-w-xl">
                                    <Command>
                                        <div className="flex flex-col w-full">
                                            {/* Ensure the Search component takes full width */}
                                            <div className="flex space-y-1 p-2">
                                                <Search placeholder="Search product price..." />
                                            </div>
                                            <CommandList className="flex-1">
                                                {filteredProducts.length === 0 ? (
                                                    <CommandEmpty>No part name found.</CommandEmpty>
                                                ) : (
                                                    <CommandGroup>
                                                        {filteredProducts.map((product) => (
                                                            <CommandItem
                                                                key={product.id}
                                                                onSelect={() => handleSelectProduct(product)}
                                                                disabled={isPending}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span>{product.part_name}</span>
                                                                    <span className="text-xs text-gray-500">{product.part_number}</span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                )}
                                            </CommandList>

                                            <div className="flex justify-center mt-4">
                                                <Pagination totalPages={totalPages} />
                                            </div>
                                        </div>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className='w-full md:w-1/4 space-y-6 items-center justify-center'>
                            <FormField
                                control={form.control}
                                name='hargaHpp'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Harga HPP</FormLabel>
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
                                        <FormLabel>Harga Jual</FormLabel>
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
                        Save
                    </Button>
                </form>
            </div>
            {/* <ImportPrices/> */}
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

export default CreatePriceForm;
