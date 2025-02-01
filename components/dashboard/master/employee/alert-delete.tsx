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


export default function DeleteAlert({id}: {id: string}) {
    const handleDelete = async () => {
        
        try {
          const data= await deleteEmployee(id);
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
        <div>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500 rounded-md border p-2 hover:bg-gray-800" >
                    <span className="sr-only">Delete</span>
                    <TrashIcon className="w-5" />
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
  