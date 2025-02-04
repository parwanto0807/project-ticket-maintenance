import Link from "next/link"
import CreateProductForm from "@/components/dashboard/master/product/create-product-form";
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

const RegisterAsset = async () => {
    const assetType = await fetchAssetType() || [];
    const validAssetType = Array.isArray(assetType) ? assetType : [];  // Menangani

    return (
        <ContentLayout title="Create Product">
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
            <CreateProductForm
                typeFind={validAssetType}
            />
        </ContentLayout>
    );
};

export default RegisterAsset;