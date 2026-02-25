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
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { toast } from "sonner";
import { deleteAssetById } from "@/action/asset/asset";
import { cn } from "@/lib/utils";

export default function DeleteAlertAsset({ id, className }: { id: string; className?: string }) {
  const handleDelete = async () => {
    try {
      const response = await deleteAssetById(id);
      if (response.message) {
        toast.success("✅ Asset berhasil dihapus", {
          description: response.message,
          duration: 3000,
        });
      } else {
        toast.error("❌ Gagal menghapus asset", {
          description: response.message || "Terjadi kesalahan",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error("❌ Error sistem", {
        description: "Terjadi kesalahan saat menghapus asset",
        duration: 4000,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "bg-red-50 text-red-700 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-600 dark:hover:text-white transition-all duration-200 group shadow-sm hover:shadow-md",
            className
          )}
        >
          <TrashIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-red-800 shadow-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-red-600 dark:text-red-400 text-xl">
              Konfirmasi Hapus Asset
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            Anda akan menghapus asset permanen dari sistem.
            <span className="block mt-2 font-semibold text-red-500 dark:text-red-400">
              Tindakan ini tidak dapat dibatalkan!
            </span>
            <span className="block mt-2 text-sm">
              • Data asset akan dihapus secara permanen<br />
              • Riwayat terkait asset akan hilang<br />
              • Software installations akan terhapus
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-3 justify-end mt-6">
          <AlertDialogCancel className="bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm">
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-600 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Ya, Hapus Asset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}