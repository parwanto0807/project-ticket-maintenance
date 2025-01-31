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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { LokasiRakSchema } from "@/schemas";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useForm } from "react-hook-form"
import { createLokasiRak } from "@/action/master/product";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { LokasiRak } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { deleteLokasiRakWithId } from "@/action/master/product";
import { ScrollArea } from "@/components/ui/scroll-area";


const LokasiRakForm = ({ lokasiRakFind }: { lokasiRakFind: LokasiRak[] }) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [selectedRow, setSelectedRow] = useState<string>('');
    const deleteWithId = (id: string) => deleteLokasiRakWithId(id);
    const [showMessageDelete, setShowMessageDelete] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

    // 1. Define your form.
    const form = useForm<z.infer<typeof LokasiRakSchema>>({
        resolver: zodResolver(LokasiRakSchema),
        defaultValues: {
            name: "",
            note: "",
        },
    })
    const onSubmit = (values: z.infer<typeof LokasiRakSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            createLokasiRak(values)
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

    const handleRowClick = (id: string, name: string, note: string) => {
        setSelectedRow(id);
        form.setValue("name", name); // Mengatur nilai input "name"
        form.setValue("note", note); // Mengatur nilai input "note"
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
            // Tidak ada pesan kesalahan, penghapusan berhasil
            setShowMessageDelete({ message: "Unit deleted successfully!", visible: true });
            setTimeout(() => {
                setShowMessageDelete(prevState => ({ ...prevState, visible: false }));
            }, 2000);
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
                    <DialogTitle className="text-center mb-6">Add new lokasi rak product</DialogTitle>
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
                                                <FormLabel>Lokasi Rak</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Category Name"
                                                        disabled={isPending}
                                                        {...field}
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
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Note</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Note"
                                                        disabled={isPending}
                                                        {...field}
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
                                                    <th scope="col" className="px-3 py-5 font-medium items-center">Category Name</th >
                                                    <th scope="col" className="px-3 py-5 font-medium items-center">Note</th >
                                                    <th scope="col" className="px-3 py-5 font-medium items-center">Action</th >
                                                </tr>
                                            </thead>
                                            <tbody className="border">
                                                {lokasiRakFind?.map((category, index) => (
                                                    <tr key={category.id}
                                                        style={{
                                                            backgroundColor: selectedRow === category.id ? 'rgba(11, 98, 157, 0.8)' : 'transparent',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => handleRowClick(category.id, category.name, category.note)}
                                                        className="mt-2 w-full border py-3 text-xs first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg"
                                                    >
                                                        <td className=" whitespace-nowrap px-3 py-2">{index + 1}</td>
                                                        <td className=" whitespace-wrap px-3 py-2">{category.name}</td>
                                                        <td className=" whitespace-wrap px-3 py-2">{category.note}</td>
                                                        <td className=" whitespace-nowrap px-3 py-2"><TrashIcon onClick={() => handleDelete(category.id)} className="text-red-500 w-8 rounded-md border p-2 hover:bg-gray-800" /></td>
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
export default LokasiRakForm;