"use client";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { AssetTypeSchema } from "@/schemas";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useForm } from "react-hook-form"
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { AssetType } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createAssetType, deleteAssetType } from "@/action/asset/asset";
import { DialogDescription } from "@radix-ui/react-dialog";


const TypeAssetForm = ({ assetTypeFind }: { assetTypeFind: AssetType[] }) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [selectedRow, setSelectedRow] = useState<string>('');
    const deleteWithId = (id: string) => deleteAssetType(id);
    const [showMessageDelete, setShowMessageDelete] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });


    // 1. Define your form.
    const form = useForm<z.infer<typeof AssetTypeSchema>>({
        resolver: zodResolver(AssetTypeSchema),
        defaultValues: {
            name: "",
            kode: "",
            description: "",
        },
    })
    const onSubmit = (values: z.infer<typeof AssetTypeSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            createAssetType(values)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error);
                        setTimeout(() => {
                            setError('');
                        }, 2000);
                        setTimeout(() => {
                            form.reset();
                        }, 2000);
                    }
                    if (data?.success) {
                        setSuccess(data.success);
                        // onSave();
                        setTimeout(() => {
                            setSuccess('');
                        }, 2000);
                        setTimeout(() => {
                            form.reset();
                        }, 2000);
                    }
                })
        })
    };

    const handleRowClick = (id: string, name: string, kode: string) => {
        setSelectedRow(id);
        form.setValue("name", name); // Mengatur nilai input "name"
        form.setValue("kode", kode); // Mengatur nilai input "note"
    };


    const handleDelete = async (id: string) => {
        const errorMessage = await deleteWithId(id);
        if (errorMessage) {
            // Jika ada pesan kesalahan, tangani pesan kesalahan di sini
            //console.error(errorMessage);
            // Setel pesan kesalahan ke state jika diperlukan
            setShowMessageDelete({ message: errorMessage.message, visible: true });
            setTimeout(() => {
                setShowMessageDelete(prevState => ({ ...prevState, visible: false }));
            }, 3000);
        } else {
            // Show success message on successful deletion
            setShowMessageDelete({ message: "Asset Type deleted successfully!", visible: true });
            setTimeout(() => {
                setShowMessageDelete(prevState => ({ ...prevState, visible: false }));
            }, 3000);
        }
    };

    const handleSaveType = () => {
        form.handleSubmit(onSubmit)();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size='sm' >
                    <PlusIcon className="h-4 md:ml-0 text-center" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center ">Add new type asset</DialogTitle>
                    <DialogDescription className="text-center text-xs italic mb-6">Data Type Asset</DialogDescription>
                    <Form {...form}>
                        <div className="w-full rounded-md mt-4 border items-center justify-center">
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6 p-4 mb-10">

                                <div className="w-full space-y-6 items-center justify-center">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name </FormLabel>
                                                <FormDescription className="text-xs italic">Data nama type Asset , Kendaraan, Electronik PC, Mesin Produksi, dll</FormDescription>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Type Name Aseet"
                                                        disabled={isPending}
                                                        {...field}
                                                        value={field.value}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full space-y-6 items-center justify-center">
                                    <FormField
                                        control={form.control}
                                        name="kode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kode for Register Asset</FormLabel>
                                                <FormDescription className="text-xs italic">Perhatikan format kode agar seragam, Kendaraan Operasioan = KO-OPR </FormDescription>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Note"
                                                        disabled={isPending}
                                                        {...field}
                                                        className="uppercase"
                                                        maxLength={5}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full space-y-6 items-center justify-center">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormDescription className="text-xs italic">Kosongkan jika data tidak diperlukan</FormDescription>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Description"
                                                        disabled={isPending}
                                                        value={field.value ?? ""}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormError message={error} />
                                <FormSuccess message={success} />

                                {/* Tampilkan pesan kesalahan penghapusan jika ada */}
                                {showMessageDelete.visible && (
                                    <div className="text-red-500 mt-4">{showMessageDelete.message}</div>
                                )}

                                <ScrollArea className="[&>div>div[style]]:!block border">
                                    <div className="max-h-[270px] mt-2">
                                        <table className="min-w-full mt-0">
                                            {/* <thead className="border rounded-lg text-left text-xs font-normal sticky top-0"> */}
                                            <thead className="rounded-lg text-left text-xs font-normal sticky top-0 bg-background">
                                                <tr>
                                                    <th scope="col" className="px-3 py-5 font-medium items-center"></th >
                                                    <th scope="col" className="px-3 py-5 font-medium items-center">Type Name</th >
                                                    <th scope="col" className="px-3 py-5 font-medium items-center">Kode </th >
                                                    <th scope="col" className="px-3 py-5 font-medium items-center">Description </th >
                                                    <th scope="col" className="px-3 py-5 font-medium items-center">Action</th >
                                                </tr>
                                            </thead>
                                            <tbody className="border">
                                                {assetTypeFind?.map((data, index) => (
                                                    <tr key={data.id}
                                                        style={{
                                                            backgroundColor: selectedRow === data.id ? 'rgba(11, 98, 157, 0.8)' : 'transparent',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => handleRowClick(data.id, data.name ?? '', data.description ?? '')}
                                                        className="mt-2 w-full border py-3 text-xs first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg"
                                                    >
                                                        <td className=" whitespace-nowrap px-3 py-2">{index + 1}</td>
                                                        <td className=" whitespace-wrap px-3 py-2">{data.name}</td>
                                                        <td className=" whitespace-wrap px-3 py-2">{data.kode}</td>
                                                        <td className=" whitespace-wrap px-3 py-2">{data.description}</td>
                                                        <td className=" whitespace-nowrap px-3 py-2"><TrashIcon onClick={() => handleDelete(data.id)} className="text-red-500 w-8 rounded-md border p-2 hover:bg-gray-800" /></td>
                                                    </tr >
                                                ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </ScrollArea>
                                <div className="relative">
                                    <Button className="absolute right-0" type="button" onClick={handleSaveType}>Simpan</Button>
                                </div>
                            </form>
                        </div>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
export default TypeAssetForm;