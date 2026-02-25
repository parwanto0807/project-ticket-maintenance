"use client"

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { PlusCircleIcon, Package, Layers, Tag, Box, Warehouse, MapPin, Settings } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductFormDialogProps {
    unitFind: Unit[];
    typeFind: JenisProduct[];
    categoryFind: KategoriProduct[];
    groupFind: Group[];
    brandFind: Brand[];
    gudangFind: Gudang[];
    lokasiRakFind: LokasiRak[];
    rakFind: Rak[];
    onSuccess?: (product: any) => void;
}

const ProductFormDialog = ({
    unitFind,
    typeFind,
    categoryFind,
    groupFind,
    brandFind,
    gudangFind,
    lokasiRakFind,
    rakFind,
    onSuccess
}: ProductFormDialogProps) => {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);

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
        startTransition(() => {
            createProduct(values)
                .then((data) => {
                    if (data?.error) {
                        toast.error(data.error);
                    }
                    if (data?.success) {
                        toast.success(data.success);
                        form.reset();
                        setOpen(false);
                        if (onSuccess) {
                            // Since createProduct doesn't return the product object in success
                            // we might need to handle this differently or just trigger a refresh
                            onSuccess(data);
                        }
                    }
                })
                .finally(() => setLoading(false));
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                    <PlusCircleIcon className="h-4 w-4" />
                    New Product
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 bg-slate-900 text-white">
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Quick Create Product
                    </DialogTitle>
                    <DialogDescription className="text-slate-300">
                        Add a new product to the library without leaving this page.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="p-6 max-h-[calc(90vh-120px)]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Product Identification */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="part_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Part Number *</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={loading} placeholder="PRD-001" />
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
                                                <Input {...field} disabled={loading} placeholder="Main Board" />
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
                                                <Input {...field} disabled={loading} placeholder="MB-01" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Classification */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="jenisId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {typeFind.map(t => (
                                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categoryFind.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Brand & Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select brand" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {brandFind.map(b => (
                                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="groupId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Group</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select group" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {groupFind.map(g => (
                                                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Units (Simplified for Dialog) */}
                            <div className="p-4 bg-slate-50 rounded-lg border space-y-4">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <Box className="h-4 w-4" /> Units Configuration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="satuan_pemasukan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Entry Unit</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {unitFind.map(u => (
                                                            <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="satuan_penyimpanan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Storage Unit</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {unitFind.map(u => (
                                                            <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="satuan_pengeluaran"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Output Unit</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {unitFind.map(u => (
                                                            <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Storage Location */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="gudangId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Warehouse</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Warehouse" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {gudangFind.map(w => (
                                                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Location" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {lokasiRakFind.map(l => (
                                                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Rack" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {rakFind.map(r => (
                                                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                                    {loading ? "Creating..." : "Create Product"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ProductFormDialog;
