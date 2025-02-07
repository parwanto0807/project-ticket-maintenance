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
import { fetchProductBynamePages, fetchProductsByName } from "@/data/master/products";
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
    const validAssetType = Array.isArray(assetType) ? assetType : [];  // Menangani

    const productFind = await fetchProductsByName(query, currentPage) || [];
    const validProduct = Array.isArray(productFind) ? productFind : [];

    const employeeFind = await getEmployeesFindData() || [];
    const validEmployeeFind = Array.isArray(employeeFind) ? employeeFind : [];

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
            />
        </ContentLayout>
    );
};

export default RegisterAsset;