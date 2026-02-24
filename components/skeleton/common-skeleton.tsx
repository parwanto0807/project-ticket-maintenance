import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageHeaderSkeleton() {
    return (
        <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-7 w-48 md:h-9" />
        </div>
    );
}

export function SearchSkeleton() {
    return (
        <div className="flex items-center justify-between gap-3 mb-6">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 space-y-4 bg-white/50 dark:bg-slate-900/50">
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex gap-3">
                <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2 w-1/2" />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="h-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800" />
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex p-4 border-b border-slate-50 dark:border-slate-900 gap-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}

export function DashboardStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-2 w-20" />
                </div>
            ))}
        </div>
    );
}
