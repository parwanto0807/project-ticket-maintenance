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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteEmployee } from "@/action/master/employees";
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from "sonner";


export default function DeleteAlert({ id, className }: { id: string; className?: string }) {
  const handleDelete = async () => {

    try {
      const data = await deleteEmployee(id);
      if (data.success) {
        toast.success(data.success)
      };

      if (data.error) {
        toast.error(data.error)
      };
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={`inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50/50 p-2 text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white ${className}`}
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Anda yakin akan menghapus data ini?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400">
            Tindakan ini tidak bisa dibatalkan. Tindakan ini akan menghapus data Anda secara permanen dari server kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-lg border-zinc-200 dark:border-zinc-800">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
