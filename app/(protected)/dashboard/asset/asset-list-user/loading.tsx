import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CardSkeleton, PageHeaderSkeleton, SearchSkeleton } from "@/components/skeleton/common-skeleton";

export default function AssetListLoading() {
    return (
        <ContentLayout title="Asset List">
            <div className="px-0.5 md:px-8">
                <PageHeaderSkeleton />
                <div className="space-y-4">
                    <SearchSkeleton />
                    <div className="grid grid-cols-1 gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
}
