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
import { deletePrice } from "@/action/master/price";
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from "sonner";


export default function DeleteAlertPrice({ id }: { id: string }) {
  const handleDelete = async () => {
    try {
      const response = await deletePrice(id);
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
          <Button variant="outline" className="h-8 text-red-500 rounded-md border p-2 hover:bg-gray-800 text-center justify-center" >
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin akan menghapus data ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Tindakan ini akan menghapus data Anda secara permanen dari server kami.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
