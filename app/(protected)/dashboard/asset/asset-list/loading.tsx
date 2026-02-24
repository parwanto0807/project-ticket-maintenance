import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AssetListSkeleton } from "@/components/asset-management/asset/skeletons";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Loading() {
    return (
        <ContentLayout title="Asset Management">
            <div className={cn("flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 md:p-8 min-h-full", font.className)}>
                <AssetListSkeleton />
            </div>
        </ContentLayout>
    );
}
