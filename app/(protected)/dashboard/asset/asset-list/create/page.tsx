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
import {
    fetchProductBynamePages,
    fetchProductsByName,
    getUnitFindAll,
    getTypeFindAll,
    getCategoryFindAll,
    getGroupFindAll,
    getBrandFindAll,
    getGudangFindAll,
    getLokasiRakFindAll,
    getRakFindAll,
} from "@/data/master/products";
import { getEmployeesFindData } from "@/data/master/employee";

const RegisterAsset = async ({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    }
}) => {

    const { query = "", page } = await searchParams || { query: "", page: "1" };

    const currentPage = Number(page) || 1;
    const totalPages = await fetchProductBynamePages(query || "");

    const assetType = await fetchAssetType() || [];
    const validAssetType = Array.isArray(assetType) ? assetType : [];

    const productFind = await fetchProductsByName(query, currentPage) || [];
    const validProduct = Array.isArray(productFind) ? productFind : [];
    const employeeFind = await getEmployeesFindData() || [];
    const validEmployeeFind = Array.isArray(employeeFind) ? employeeFind : [];

    // Fetch Master Data for Product Creation
    const unitFind = await getUnitFindAll();
    const validUnitFind = Array.isArray(unitFind) ? unitFind : [];

    const typeFind = await getTypeFindAll();
    const validTypeFind = Array.isArray(typeFind) ? typeFind : [];

    const categoryFind = await getCategoryFindAll();
    const validCategoryFind = Array.isArray(categoryFind) ? categoryFind : [];

    const groupFind = await getGroupFindAll();
    const validGroupFind = Array.isArray(groupFind) ? groupFind : [];

    const brandFind = await getBrandFindAll();
    const validBrandFind = Array.isArray(brandFind) ? brandFind : [];

    const gudangFind = await getGudangFindAll();
    const validGudangFind = Array.isArray(gudangFind) ? gudangFind : [];

    const lokasiRakFind = await getLokasiRakFindAll();
    const validLokasiRakFind = Array.isArray(lokasiRakFind) ? lokasiRakFind : [];

    const rakFind = await getRakFindAll();
    const validRakFind = Array.isArray(rakFind) ? rakFind : [];

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
                productDataFind={validProduct}
                employeeDataFind={validEmployeeFind}
                totalPages={totalPages}
                unitFind={validUnitFind}
                typeFind={validTypeFind}
                categoryFind={validCategoryFind}
                groupFind={validGroupFind}
                brandFind={validBrandFind}
                gudangFind={validGudangFind}
                lokasiRakFind={validLokasiRakFind}
                rakFind={validRakFind}
            />
        </ContentLayout>
    );
};

export default RegisterAsset;