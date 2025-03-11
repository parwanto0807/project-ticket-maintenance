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
            <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto rounded-lg shadow-lg">
                <DialogHeader>
                    {loading ? (
                        <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700" />
                    ) : (
                        <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
                            {product.part_name}
                        </DialogTitle>
                    )}
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
                        Detail lengkap produk
                    </DialogDescription>
                </DialogHeader>
                <Card className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
                    <CardContent className="grid gap-3 text-sm">
                        {loading ? (
                            <>
                                <Skeleton className="h-5 w-full bg-gray-300 dark:bg-gray-700" />
                                <Skeleton className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700" />
                                <Skeleton className="h-5 w-2/3 bg-gray-300 dark:bg-gray-700" />
                            </>
                        ) : (
                            <>
                                <p>
                                    <strong className="text-gray-700 dark:text-gray-300">
                                        Nick Name:
                                    </strong> {product.nick_name}
                                </p>
                                <p>
                                    <strong className="text-gray-700 dark:text-gray-300">
                                        Part Number:
                                    </strong> {product.part_number}
                                </p>
                                <p>
                                    <strong className="text-gray-700 dark:text-gray-300">
                                        Deskripsi:
                                    </strong> {product.description}
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                            Tutup
                        </Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
