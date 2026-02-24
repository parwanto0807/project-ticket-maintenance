"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/action/master/product";
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from "sonner";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function DeleteAlertProduct({ id }: { id: string }) {
  const handleDelete = async () => {
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        toast.success(response.success)
      } else {
        toast.error(response.error)
      }

    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred while deleting the product');
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="h-8 text-red-500 rounded-md border p-2 hover:bg-red-800 hover:text-white text-center justify-center" >
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={cn("rounded-3xl", font.className)}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black tracking-tight text-slate-900">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              This action cannot be undone. This will permanently delete the product data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl font-bold bg-red-600 hover:bg-red-700">Delete Product</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
