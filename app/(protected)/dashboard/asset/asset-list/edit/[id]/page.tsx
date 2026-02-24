import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { getEmployeesFindData } from "@/data/master/employee";
import { fetchAssetById, fetchAssetType } from "@/data/asset/asset";
import EditAssetForm from "@/components/asset-management/asset/edit-asset-form";
import { $Enums, Employee } from "@prisma/client";


const UpdateAsset = async ({
    params,
    searchParams
}: {
    params: { id: string },
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const { id = "" } = params;

    const assetFind = await fetchAssetById(id);
    const assetType = await fetchAssetType() ?? [];
    const employeeFind = await getEmployeesFindData() ?? [];

    if (!assetFind || Array.isArray(assetFind)) {
        return <div>Asset not found</div>;
    }

    return (
        <ContentLayout title="Update Asset">
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
                        <BreadcrumbPage>Update</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Form untuk update asset */}
            <EditAssetForm
                returnParams={searchParams}
                employeeDataFind={employeeFind}
                assetTypeFind={Array.isArray(assetType) ? assetType : []}
                assetFind={assetFind as {
                    id: string;
                    assetNumber: string;
                    status: $Enums.AssetStatus;
                    location: string | null;
                    purchaseDate: Date | null;
                    purchaseCost: number | null;
                    residualValue: number | null;
                    usefulLife: number | null;
                    createdAt: Date;
                    updatedAt: Date;
                    assetTypeId: string;
                    departmentId: string;
                    assetImage1: string | null;
                    productId: string;
                    employeeId: string | null;
                    assetType: { id: string; name: string; createdAt: Date; updatedAt: Date; description: string | null; kode: string; };
                    department: {
                        id: string;
                        dept_name: string;
                        note: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                    product: { id: string, part_name: string };
                    employee?: Employee | null;
                }}
            />
        </ContentLayout>
    );
};

export default UpdateAsset;
