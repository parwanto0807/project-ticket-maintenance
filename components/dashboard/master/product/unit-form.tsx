"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitSchema } from "@/schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createUnit, deleteUnit } from "@/action/master/product";
import { Input } from "@/components/ui/input";
import { Unit } from "@prisma/client";
import { PlusIcon } from '@heroicons/react/24/outline';

interface UnitFormProps {
  unitFind: Unit[];
}

const UnitForm: React.FC<UnitFormProps> = ({ unitFind }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [showMessageDelete, setShowMessageDelete] = useState<{ message: string, visible: boolean }>({ message: "", visible: false });

  const form = useForm<z.infer<typeof UnitSchema>>({
    resolver: zodResolver(UnitSchema),
    defaultValues: {
      name: "",
      note: ""
    }
  });

  const onSubmit = (values: z.infer<typeof UnitSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      createUnit(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
            setTimeout(() => {
              setError('');
            }, 2000);
          } else if (data?.success) {
            setSuccess(data.success);
            setTimeout(() => {
              setSuccess('');
            }, 2000);
          }
          form.reset();
        });
    });
  };

  const handleRowClick = (id: string, name: string, note: string) => {
    setSelectedRow(id);
    form.setValue("name", name);
    form.setValue("note", note);
  };

  const handleDelete = async (id: string) => {
    const errorMessage = await deleteUnit(id);
    if (errorMessage) {
      setShowMessageDelete({ message: errorMessage.message, visible: true });
      setTimeout(() => {
        setShowMessageDelete(prevState => ({ ...prevState, visible: false }));
      }, 3000);
    } else {
      // Show success message on successful deletion
      setShowMessageDelete({ message: "Unit deleted successfully!", visible: true });
      setTimeout(() => {
        setShowMessageDelete(prevState => ({ ...prevState, visible: false }));
      }, 3000);
    }
  };

  const handleSaveUnit = () => {
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
          <DialogTitle className="mb-6 text-center">Add new unit product</DialogTitle>
          <Form {...form}>
            <div className="w-full rounded-md mt-4 border items-center justify-center">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-4 mb-10"
              >
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

                {error && <FormError message={error} />}
                {success && <FormSuccess message={success} />}

                {/* Tampilkan pesan kesalahan penghapusan jika ada */}
                {showMessageDelete.visible && (
                  <div className="text-red-500 mt-4">{showMessageDelete.message}</div>
                )}

                <ScrollArea className="[&>div>div[style]]:!block border">
                  <div className="max-h-[270px] mt-2">
                    <table className="min-w-full mt-0">
                      <thead className="rounded-lg text-left text-xs font-normal sticky top-0 bg-background">
                        <tr>
                          <th scope="col" className="px-3 py-5 font-medium items-center"></th>
                          <th scope="col" className="px-3 py-5 font-medium items-center">Unit Name</th>
                          <th scope="col" className="px-3 py-5 font-medium items-center">Note</th>
                          <th scope="col" className="px-3 py-5 font-medium items-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="border">
                        {unitFind.map((unit) => (
                          <tr
                            key={unit.id}
                            style={{
                              backgroundColor: selectedRow === unit.id ? 'rgba(11, 98, 157, 0.8)' : 'transparent',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleRowClick(unit.id, unit.name, unit.note)}
                            className="mt-2 w-full border py-3 text-xs first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg"
                          >
                            <td className="whitespace-nowrap px-3 py-2">{unitFind.indexOf(unit) + 1}</td>
                            <td className="whitespace-nowrap px-3 py-2">{unit.name}</td>
                            <td className="whitespace-nowrap px-3 py-2">{unit.note}</td>
                            <td className="whitespace-nowrap px-3 py-2">
                              <TrashIcon
                                onClick={(e) => {
                                  e.stopPropagation();  // Mencegah pemilihan baris saat menghapus
                                  handleDelete(unit.id);
                                }}
                                className="text-red-500 w-8 rounded-md border p-2 hover:bg-gray-800"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>

                <div className="relative">
                  <Button className="absolute right-0" type="button" onClick={handleSaveUnit}>Save</Button>
                </div>
              </form>
            </div>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UnitForm;
