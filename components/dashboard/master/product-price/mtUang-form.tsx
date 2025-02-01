"use client";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { MtUang_Schema } from "@/schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
} from "@/components/ui/form";

import { ScrollArea } from "@/components/ui/scroll-area";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createMtUang } from "@/action/master/price";
import { deleteMtuang } from "@/action/master/price";
import { Input } from "@/components/ui/input"
import { MataUang } from "@prisma/client";
import { PlusIcon } from '@heroicons/react/24/outline';


const MtUangForm = ({ mtUangFind }: { mtUangFind: MataUang[] }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [selectedRow, setSelectedRow] = useState<string>('');
  const deleteWithId = (id: string) => deleteMtuang(id);
  const [showMessageDelete, setShowMessageDelete] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [showMessage, setShowMessage] = useState(false)
  const [prevLength, setPrevLength] = useState(mtUangFind.length);
  const [inputName, setInputName] = useState('');
  const [inputNote, setInputNote] = useState('');

  const form = useForm<z.infer<typeof MtUang_Schema>>({
    resolver: zodResolver(MtUang_Schema),
    defaultValues: {
      name: "",
      note: ""
    }
  });

  const onSubmit = (values: z.infer<typeof MtUang_Schema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createMtUang(values)
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
  useEffect(() => {
    // Cek apakah ada baris yang dipilih saat komponen pertama kali dirender
    if (selectedRow !== '') {
      // Jika ada baris yang dipilih, atur nilai inputName dan inputNote
      const unit = mtUangFind.find(unitFind => unitFind.id === selectedRow);
      if (unit) {
        setInputName(unit.name);
        setInputNote(unit.note);
      }
    }
  }, [selectedRow, mtUangFind]); // Efek hanya dijalankan saat selectedRow atau unitFind berubah

  const handleDelete = async (id: string) => {
    const errorMessage = await deleteWithId(id);
    if (errorMessage) {
      // Jika ada pesan kesalahan, tangani pesan kesalahan di sini
      //console.error(errorMessage);
      // Setel pesan kesalahan ke state jika diperlukan
      // setShowMessageDelete({ message: errorMessage.error, visible: true });
      setTimeout(() => {
        setShowMessageDelete(prevState => ({ ...prevState, visible: false }));
      }, 3000);
    } else {
      // Tidak ada pesan kesalahan, penghapusan berhasil
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }
  };

  const handleSaveUnit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"  >
          <PlusIcon className="h-4 md:ml-0 text-center" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6 text-center">Add new currency</DialogTitle>
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
                        <FormLabel>Unit Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Unit Name"
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
                        <FormLabel>Unit Note</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Unit Note"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />

                <ScrollArea className="[&>div>div[style]]:!block border">
                  <div className="max-h-[270px] mt-2">
                    <table className="min-w-full mt-0">
                      {/* <thead className="border rounded-lg text-left text-xs font-normal sticky top-0"> */}
                      <thead className="rounded-lg text-left text-xs font-normal sticky top-0 bg-background">
                        <tr>
                          <th scope="col" className="px-3 py-5 font-medium items-center"></th >
                          <th scope="col" className="px-3 py-5 font-medium items-center">Currency Symbol</th >
                          <th scope="col" className="px-3 py-5 font-medium items-center">KODE ISO</th >
                          <th scope="col" className="px-3 py-5 font-medium items-center">Action</th >
                        </tr>
                      </thead>
                      <tbody className="border">
                        {mtUangFind?.map((data, index) => (
                          <tr key={data.id}
                            style={{
                              backgroundColor: selectedRow === data.id ? 'rgba(11, 98, 157, 0.8)' : 'transparent',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleRowClick(data.id, data.name, data.note)}
                            className="mt-2 w-full border py-3 text-xs first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg"
                          >
                            <td className=" whitespace-nowrap px-3 py-2">{index + 1}</td>
                            <td className=" whitespace-nowrap px-3 py-2">{data.name}</td>
                            <td className=" whitespace-nowrap px-3 py-2">{data.note}</td>
                            <td className=" whitespace-nowrap px-3 py-2"><TrashIcon onClick={() => handleDelete(data.id)} className="text-red-500 w-8 rounded-md border p-2 hover:bg-gray-800" /></td>
                          </tr >
                        ))}

                      </tbody>
                    </table>
                  </div>
                </ScrollArea>

                <div className="relative">
                  <Button className="absolute right-0" type="button" onClick={handleSaveUnit}>Simpan</Button>
                </div>
              </form>
            </div>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default MtUangForm;