"use server";

import Link from "next/link"
import { Decimal } from "decimal.js";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { fetchPriceById } from "@/data/master/price";
import { fetchMtUang } from "@/data/master/price";
import { fetchProductBynamePages, fetchProductsByName, fetchProductsByNameNoLimit } from "@/data/master/products";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import UpdatePriceForm from "@/components/dashboard/master/product-price/update-price-form";
// import { PriceSchema } from "@/schemas/index";

const UpdatePrice = async ({
    searchParams, params
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
    params: { id: string };
}) => {
    // const id = params.id
    const { id ="" } = await params || {id: ""}
    const { query = "", page } = await searchParams || { query: "", page: "1" };
    const currentPage = Number(page) || 1;
    const totalPages = await fetchProductBynamePages(query || "");

    const productFindById = await fetchProductsByNameNoLimit(query) || [];
    const validProductFindById = Array.isArray(productFindById) ? productFindById : [];

    const productFind = await fetchProductsByName(query, currentPage) || [];
    const validProductFind = Array.isArray(productFind) ? productFind : [];
    const priceFindById = await fetchPriceById(id);
    const validPriceFind = Array.isArray(priceFindById) && priceFindById.length > 0 ? priceFindById[0] : { 
        id: "", 
        default: false, 
        createdAt: new Date(), 
        updatedAt: new Date(), 
        idProduct: "", 
        idMtUang: "", 
        hargaHpp: Decimal.toString(), 
        hargaJual: Decimal.toString() 
    };
    const mtUangFind = await fetchMtUang() || [];
    const validMtUangFind = Array.isArray(mtUangFind) ? mtUangFind : [];

    // console.log(validProductFind)
    // console.log(validPriceFind)


    return (
        <ContentLayout title="Update Price Product">
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
                            <Link href="/dashboard/master/price-product">Price</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Update</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <UpdatePriceForm
                totalPages={totalPages}
                productFind={validProductFind}
                priceFindById={validPriceFind}
                mtUangFind={validMtUangFind}
                productFindById={validProductFindById}
            />
        </ContentLayout>
    );
};

export default UpdatePrice;