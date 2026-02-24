"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@prisma/client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export function ProductDialog({ product }: { product: Product }) {
    const [loading, setLoading] = useState(true);

    // Simulasi loading dengan delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800); // Simulasi delay 800ms
        return () => clearTimeout(timer);
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-white-600 rounded-md border p-2 hover:bg-green-800 h-8 text-center hover:text-white flex justify-center items-center"
                >
                    <MagnifyingGlassIcon className="w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className={cn("max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl border-0 p-0", font.className)}>
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 opacity-50"></div>
                    <div className="relative">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight mb-1">
                                {loading ? <Skeleton className="h-8 w-48 bg-white/20" /> : product.nick_name}
                            </DialogTitle>
                            <DialogDescription className="text-blue-100/70 text-sm font-medium">
                                Technical Specifications & Inventory Details
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Part Name" value={product.part_name} loading={loading} fullWidth />
                        <DetailItem label="Part Number" value={product.part_number} loading={loading} />
                        <DetailItem label="Storage Unit" value={product.satuan_penyimpanan} loading={loading} />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specifications</h4>
                        {loading ? (
                            <Skeleton className="h-20 w-full" />
                        ) : (
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                "{product.description || 'No detailed specifications provided.'}"
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full rounded-xl font-bold h-11 border-slate-200 hover:bg-slate-50">
                            Close Details
                        </Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DetailItem({ label, value, loading, fullWidth = false }: { label: string; value: string | null; loading: boolean; fullWidth?: boolean }) {
    return (
        <div className={cn("space-y-1.5", fullWidth && "md:col-span-2")}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{label}</span>
            {loading ? (
                <Skeleton className="h-6 w-full" />
            ) : (
                <p className="text-[15px] font-black text-slate-800 dark:text-slate-200 tracking-tight">
                    {value || '-'}
                </p>
            )}
        </div>
    );
}
