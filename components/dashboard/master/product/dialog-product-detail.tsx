
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
// import { Badge } from "@/components/ui/badge";
import { Product } from "@prisma/client";
import { SearchCheckIcon } from "lucide-react";

export function ProductDialog({ product }: { product: Product }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="p-2 rounded-lg border bg-gray-100 dark:bg-gray-800 hover:bg-green-600 hover:text-white transition duration-300"
                >
                    <SearchCheckIcon className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
                        {product.part_name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
                        Detail lengkap produk
                    </DialogDescription>
                </DialogHeader>
                <Card className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
                    <CardContent className="grid gap-3 text-sm">
                        <p><strong className="text-gray-700 dark:text-gray-300">Nick Name:</strong> {product.nick_name}</p>
                        <p><strong className="text-gray-700 dark:text-gray-300">Part Number:</strong> {product.part_number}</p>
                        <p><strong className="text-gray-700 dark:text-gray-300">Deskripsi:</strong> {product.description}</p>
                    </CardContent>
                </Card>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Tutup</Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
