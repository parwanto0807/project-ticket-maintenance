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
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from "sonner";
import { deleteTicket } from "@/action/maintenance/ticket";

interface DeleteAlertTicketProps {
  id: string;
  disabled?: boolean; // Properti disabled opsional
}

export default function DeleteAlertTicket({ id, disabled }: DeleteAlertTicketProps) {
  const handleDelete = async () => {
    try {
      const response = await deleteTicket(id);
      if (response.message) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('An error occurred while deleting the ticket');
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={disabled} // Menonaktifkan tombol jika disabled=true
            variant="outline"
            className="h-8 text-red-500 rounded-md border p-2 hover:bg-red-800 hover:text-white text-center justify-center"
          >
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
  );
}
