import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DeptSchema } from "@/schemas";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import React, { useEffect, useTransition, useState } from "react";
import { Department } from "@prisma/client";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { createDept, deleteDept } from "@/action/master/employees";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

const CreateDeptForm = ({ deptFind }: { deptFind: Department[] }) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [selectedRow, setSelectedRow] = useState<string>("");
    const deleteWithId = (id: string) => deleteDept(id);
    const [showMessageDelete, setShowMessageDelete] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
    const [showMessage, setShowMessage] = useState(false);
    const [inputName, setInputName] = useState("");
    const [inputNote, setInputNote] = useState("");

    // 1. Define your form.
    const form = useForm<z.infer<typeof DeptSchema>>({
        resolver: zodResolver(DeptSchema),
        defaultValues: {
            dept_name: "",
            note: "",
        },
    });

    const onSubmit = (values: z.infer<typeof DeptSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            createDept(values)
                .then((data) => {
                    if (data?.error) {
                        setError(data.error);
                        setTimeout(() => {
                            setError("");
                        }, 2000);
                        setTimeout(() => {
                            form.reset();
                        }, 2000);
                    }
                    if (data?.success) {
                        setSuccess(data.success);
                        // onSave();
                        setTimeout(() => {
                            setSuccess("");
                        }, 2000);
                        setTimeout(() => {
                            form.reset();
                        }, 2000);
                    }
                });
        });
    };

    const handleRowClick = (id: string, dept_name: string, note: string) => {
        setSelectedRow(id);
        form.setValue("dept_name", dept_name); // Mengatur nilai input "name"
        form.setValue("note", note); // Mengatur nilai input "note"
    };

    useEffect(() => {
        // Cek apakah ada baris yang dipilih saat komponen pertama kali dirender
        if (selectedRow !== "") {
            // Jika ada baris yang dipilih, atur nilai inputName dan inputNote
            const unit = deptFind.find((category) => category.id === selectedRow);
            if (unit) {
                setInputName(unit.dept_name);
                setInputNote(unit.note);
            }
        }
    }, [selectedRow, deptFind]); // Efek hanya dijalankan saat selectedRow atau unitFind berubah

    const handleDelete = async (id: string) => {
        const errorMessage = await deleteWithId(id);
        if (errorMessage) {
            // Jika ada pesan kesalahan, tangani pesan kesalahan di sini
            //console.error(errorMessage);
            // Setel pesan kesalahan ke state jika diperlukan
            setShowMessageDelete({ message: errorMessage.error, visible: true });
            setTimeout(() => {
                setShowMessageDelete((prevState) => ({ ...prevState, visible: false }));
            }, 3000);
        } else {
            // Tidak ada pesan kesalahan, penghapusan berhasil
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        }
    };

    const handleSave = () => {
        form.handleSubmit(onSubmit)();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusIcon className="h-4 md:ml-0 text-center" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new department.</DialogTitle>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    {showMessage && (
                        <div className="text-green-500 mt-2">Data berhasil dihapus</div>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                            <FormField
                                control={form.control}
                                name="dept_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Departmen Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={inputName}
                                                onChange={(e) => {
                                                    setInputName(e.target.value);
                                                    form.setValue("dept_name", e.target.value); // Sync dengan react-hook-form
                                                }}
                                                disabled={isPending}
                                                placeholder="Department Name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={inputNote}
                                                onChange={(e) => {
                                                    setInputNote(e.target.value);
                                                    form.setValue("note", e.target.value); // Sync dengan react-hook-form
                                                }}
                                                disabled={isPending}
                                                placeholder="Note"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Menampilkan pesan kesalahan penghapusan jika ada */}
                            {showMessageDelete.visible && (
                                <div className="text-red-500 mt-2">{showMessageDelete.message}</div>
                            )}

                            <div className="max-h-[270px] mt-2 overflow-y-scroll">
                                <Table className="min-w-full mt-2">
                                    <TableHeader className="rounded-lg text-left text-xs font-normal sticky top-0">
                                        <TableRow>
                                            <TableHead scope="col" className="px-3 py-5 font-medium items-center"></TableHead>
                                            <TableHead scope="col" className="px-3 py-5 font-medium items-center">Category Name</TableHead>
                                            <TableHead scope="col" className="px-3 py-5 font-medium items-center">Note</TableHead>
                                            <TableHead scope="col" className="px-3 py-5 font-medium items-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {deptFind?.map((data, index) => (
                                            <TableRow
                                                key={data.id}
                                                style={{
                                                    backgroundColor: selectedRow === data.id ? "rgba(11, 98, 157, 0.8)" : "transparent",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleRowClick(data.id, data.dept_name, data.note)}
                                                className="mt-2 w-full border py-3 text-xs first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg"
                                            >
                                                <TableCell className=" whitespace-nowrap px-3 py-3">{index + 1}</TableCell>
                                                <TableCell className=" whitespace-nowrap px-3 py-3">{data.dept_name}</TableCell>
                                                <TableCell className=" whitespace-nowrap px-3 py-3">{data.note}</TableCell>
                                                <TableCell className=" whitespace-nowrap px-3 py-3">
                                                    <TrashIcon onClick={() => handleDelete(data.id)} className="text-red-500 w-8 rounded-md border p-2 hover:bg-gray-100" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="relative">
                                <Button className="absolute right-0" type="button" onClick={handleSave}>Simpan</Button>
                            </div>
                        </form>
                    </Form>
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDeptForm;
