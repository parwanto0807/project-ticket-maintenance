"use client"

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetSchema } from "@/schemas";
// import { cn } from "@/lib/utils"
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
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"
// import { Calendar as CalendarIcon } from "lucide-react"
// import { format } from 'date-fns';
import { Button } from "@/components/ui/button"
import { AssetType } from "@prisma/client";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { createAsset } from "@/action/asset/asset";
import { AssetStatus } from "@prisma/client";
// import { Calendar } from "@/components/ui/calendar";




const CreateAssetForm = ({
    assetTypeFind
}: {
    assetTypeFind: AssetType[];
}) => {

    const [isPending] = useTransition();
    const [date, setDate] = useState<Date | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof AssetSchema>>({
        resolver: zodResolver(AssetSchema),
        defaultValues: {
            assetNumber: "",
            name: "",
            description: "",
            category: "",
            status: "AVAILABLE",
            location: "",
            purchaseDate: new Date,
            purchaseCost: 0,
            residualValue: 0,
            usefulLife: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            assetTypeId: "",
            productId: "",
            employeeId: "",
        }
    });
    // console.log('Default Value:', form.control._formValues);

    const onSubmit = (values: z.infer<typeof AssetSchema>) => {
        // console.log('Form Value:', values);
        setLoading(true)
        createAsset(values)
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
                    router.push('/dashboard/asset/asset-list');
                }
            })
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // Validasi format tanggal
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (regex.test(value)) {
            const parsedDate = new Date(value);
            if (!isNaN(parsedDate.getTime())) {
                setDate(parsedDate);
                form.setValue('purchaseDate', parsedDate);
            }
        }

        // Parse input value to date
        const parsedDate = new Date(value);
        if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
            form.setValue('purchaseDate', parsedDate); // Update form value
        }
    };
    // Handler untuk perubahan datepicker (kalender)
    
    // const handleDatePickerChange = (newDate: Date | undefined) => {
    //     if (newDate) {
    //         setDate(newDate); // Update state `date`
    //         setInputValue(format(newDate, 'yyyy-MM-dd')); // Update input manual
    //         form.setValue('purchaseDate', newDate); // Update nilai form
    //     }
    // };
console.log(date);

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
                                name="assetNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Asset Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Asset Number"
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Asset Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Asset Name"
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Asset Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
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

                    <div className="flex w-full gap-2">
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
                                                type="number"
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


                    <div className="grid grid-cols-1 mt-0 sm:grid-cols-4 gap-2">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="purchaseDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase Date</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col space-y-2">
                                                {/* Input manual */}
                                                <Input
                                                    {...field}
                                                    type="date"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    placeholder="YYYY-MM-DD"
                                                    className="w-[280px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />

                                                {/* Datepicker (kalender)
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[280px] justify-start text-left font-normal",
                                                                !date && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {date ? format(date, 'yyyy-MM-dd') : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={date ?? undefined}
                                                            onSelect={handleDatePickerChange}
                                                            initialFocus={false}
                                                        />
                                                    </PopoverContent>
                                                </Popover> */}
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
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex-initial grid grid-cols-1 mt-0 gap-4 sm:grid-cols-4">
                        <div className="flex w-full gap-x-2">
                            <div className="flex-initial w-full">
                                <FormField
                                    control={form.control}
                                    name="assetTypeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Asset Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type product" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {assetTypeFind?.map(assetTypeFind => (
                                                        <SelectItem key={assetTypeFind.id} value={assetTypeFind.id}>
                                                            {assetTypeFind.name}
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
                                {/* <TypeForm typeFind={typeFind} /> */}
                            </div>
                        </div>
                        <div className="flex w-full gap-x-2">
                            <div className="flex-initial w-full">
                                <FormField
                                    control={form.control}
                                    name="productId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Asset Name</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Asset Product" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* {categoryFind?.map(categoryFind => (
                                                            <SelectItem key={categoryFind.id} value={categoryFind.id}>
                                                                {categoryFind.name}
                                                            </SelectItem>
                                                        ))} */}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex w-full gap-x-2">
                            <div className="flex-initial w-full">
                                <FormField
                                    control={form.control}
                                    name="employeeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User Asset</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value ?? ""}
                                                disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select group product" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {/* {groupFind?.map(groupFind => (
                                                            <SelectItem key={groupFind.id} value={groupFind.id}>
                                                                {groupFind.name}
                                                            </SelectItem>
                                                        ))} */}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative ">
                        <Button className={`w-24 h-9 rounded-lg absolute right-0 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-2 px-4 rounded-lg`} type="submit">{loading ? 'Load Save...' : 'Save'}</Button>
                    </div>
                </form>
                <div className="flex items-center justify-end border p-2 pr-3 rounded-md shadow-sm">
                    <Link
                        href="/dashboard/asset/asset-list"
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

export default CreateAssetForm;