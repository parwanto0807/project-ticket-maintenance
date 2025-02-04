import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { fetchAssetType } from "@/data/asset/asset";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import CreateAssetForm from "@/components/asset-management/asset/create-asset-form";

const RegisterAsset = async () => {
    const assetType = await fetchAssetType() || [];
    const validAssetType = Array.isArray(assetType) ? assetType : [];  // Menangani

    return (
        <ContentLayout title="Register Asset">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Asset</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/asset/asset-list">Asset List</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CreateAssetForm
                assetTypeFind={validAssetType}
            />
        </ContentLayout>
    );
};

export default RegisterAsset;