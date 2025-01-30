import Link from "next/link"
import CreateProductForm from "@/components/dashboard/master/product/create-product-form";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    getUnitFindAll,
    getTypeFindAll,
    getCategoryFindAll,
    getGroupFindAll,
    getBrandFindAll,
    getGudangFindAll,
    getLokasiRakFindAll,
    getRakFindAll,
} from "@/data/master/products";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const CreateProduct = async () => {
    const unitFind = await getUnitFindAll() || [];
    const validUnitFind = Array.isArray(unitFind) ? unitFind : [];  // Menangani kasus error
    const typeFind = await getTypeFindAll() || [];
    const validTypeFind = Array.isArray(typeFind) ? typeFind : [];
    const categoryFind = await getCategoryFindAll() || [];
    const validCategoryFind = Array.isArray(categoryFind) ? categoryFind : [];
    const groupFind = await getGroupFindAll() || [];
    const validGroupFind = Array.isArray(groupFind) ? groupFind : [];
    const brandFind = await getBrandFindAll() || [];
    const validBrandFind = Array.isArray(brandFind) ? brandFind : [];
    const gudangFind = await getGudangFindAll() || [];
    const validGudangFind = Array.isArray(gudangFind) ? gudangFind : [];
    const lokasiRakFind = await getLokasiRakFindAll() || [];
    const validLokasiRakFind = Array.isArray(lokasiRakFind) ? lokasiRakFind : [];
    const rakFind = await getRakFindAll() || [];
    const validrakFind = Array.isArray(rakFind) ? rakFind : [];

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
                            <Link href="/dashboard">Master</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/master/products">Products</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CreateProductForm
                categoryFind={validCategoryFind}
                unitFind={validUnitFind}
                typeFind={validTypeFind}
                groupFind={validGroupFind}
                brandFind={validBrandFind}
                lokasiRakFind={validLokasiRakFind}
                rakFind={validrakFind}
                gudangFind={validGudangFind}
            />
        </ContentLayout>
    );
};

export default CreateProduct;