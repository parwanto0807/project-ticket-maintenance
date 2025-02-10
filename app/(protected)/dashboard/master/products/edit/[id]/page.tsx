"use server";

import Link from "next/link";
import EditProductForm from "@/components/dashboard/master/product/edit-product-form";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    getUnitFindAll,
    getTypeFindAll,
    getCategoryFindAll,
    getGroupFindAll,
    getBrandFindAll,
    getProductById,
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
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageProps } from "@/types";

const UpdateProduct = async ({ params }: PageProps) => {
    const { id } = await params; // Await the params to access id

    const productFindById = await getProductById(id);

    if (!productFindById) {
        return (
            <ContentLayout title="Product Not Found">
                <p>Product with ID {id} was not found.</p>
            </ContentLayout>
        );
    }

    // Fetch the other data asynchronously
    const [unitFind, typeFind, categoryFind, groupFind, brandFind, gudangFind, lokasiRakFind, rakFind] = await Promise.all([
        getUnitFindAll(),
        getTypeFindAll(),
        getCategoryFindAll(),
        getGroupFindAll(),
        getBrandFindAll(),
        getGudangFindAll(),
        getLokasiRakFindAll(),
        getRakFindAll(),
    ]);

    return (
        <ContentLayout title="Update Product">
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
                        <BreadcrumbPage>Update</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <EditProductForm
                productFindById={productFindById}
                categoryFind={Array.isArray(categoryFind) ? categoryFind : []}
                unitFind={Array.isArray(unitFind) ? unitFind : []}
                typeFind={Array.isArray(typeFind) ? typeFind : []}
                groupFind={Array.isArray(groupFind) ? groupFind : []}
                brandFind={Array.isArray(brandFind) ? brandFind : []}
                lokasiRakFind={Array.isArray(lokasiRakFind) ? lokasiRakFind : []}
                rakFind={Array.isArray(rakFind) ? rakFind : []}
                gudangFind={Array.isArray(gudangFind) ? gudangFind : []}
            />
        </ContentLayout>
    );
};

export default UpdateProduct;
