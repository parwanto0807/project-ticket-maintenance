"use client";

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PencilIcon,
  PlusIcon,
  ComputerDesktopIcon,
  PrinterIcon,
  TrashIcon,
  EyeIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function CreateAssetButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/dashboard/asset/asset-list/create" passHref>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <PlusIcon className="h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Register Asset</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tambah asset baru ke sistem</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function UpdateAssetLink({ id, searchParams, className }: { id: string; searchParams?: any; className?: string }) {
  const router = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const queryString = params.toString();
    router.push(`/dashboard/asset/asset-list/edit/${id}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            variant="outline"
            size="sm"
            className={cn(
              "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-600 dark:hover:text-white transition-all duration-200 group",
              className
            )}
          >
            <PencilIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit asset</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ViewDetailsButton({ id }: { id: string }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/asset/asset-list/${id}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            variant="outline"
            size="sm"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-200 group"
          >
            <EyeIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Lihat detail asset</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function DeleteAssetButton({ id, onDelete }: { id: string; onDelete: (id: string) => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => onDelete(id)}
            variant="outline"
            size="sm"
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-600 dark:hover:text-white transition-all duration-200 group"
          >
            <TrashIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hapus asset</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PrintAssetButton({ id }: { id: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/dashboard/asset/generate-pdf/${id}`} passHref>
            <Button
              variant="outline"
              size="sm"
              className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-200 group"
            >
              <PrinterIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cetak PDF asset</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AssignSoftwareButton({ assetId }: { assetId: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/dashboard/software/assign/${assetId}`} passHref>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-600 dark:hover:text-white transition-all duration-200 group"
            >
              <ComputerDesktopIcon className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
              Assign
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Assign software ke asset</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ViewSoftwareButton({ assetId, count = 0 }: { assetId: string; count?: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/dashboard/software/asset/${assetId}`} passHref>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 group relative"
            >
              <ComputerDesktopIcon className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
              Software
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {count}
                </span>
              )}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Lihat software terinstall ({count} software)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function CreateSoftwareButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/dashboard/software/add" passHref>
            <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <DocumentPlusIcon className="h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Add Software</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tambah software baru ke sistem</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Button group untuk actions dalam table
export function AssetActionButtons({
  assetId,
  softwareCount = 0,
  onDelete
}: {
  assetId: string;
  softwareCount?: number;
  onDelete: (id: string) => void;
}) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center space-x-1">
        <ViewDetailsButton id={assetId} />
        <UpdateAssetLink id={assetId} />
        <ViewSoftwareButton assetId={assetId} count={softwareCount} />
        <AssignSoftwareButton assetId={assetId} />
        <PrintAssetButton id={assetId} />
        <DeleteAssetButton id={assetId} onDelete={onDelete} />
      </div>
    </TooltipProvider>
  );
}

// Secondary action buttons dengan tooltip
export function SecondaryActionButton({
  children,
  onClick,
  variant = "outline",
  className = "",
  tooltip = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  tooltip?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            onClick={onClick}
            className={`bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-600 transition-all duration-200 group ${className}`}
          >
            {children}
          </Button>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

// Export TooltipProvider untuk digunakan di root jika needed
export { TooltipProvider };