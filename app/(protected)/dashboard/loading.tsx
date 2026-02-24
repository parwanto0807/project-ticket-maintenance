import { ContentLayout } from "@/components/admin-panel/content-layout";
import { DashboardStatsSkeleton, PageHeaderSkeleton } from "@/components/skeleton/common-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <ContentLayout title="Dashboard">
            <div className="px-6">
                <PageHeaderSkeleton />
                <div className="space-y-6">
                    <DashboardStatsSkeleton />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-[300px] w-full rounded-2xl" />
                        <Skeleton className="h-[300px] w-full rounded-2xl" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
}
