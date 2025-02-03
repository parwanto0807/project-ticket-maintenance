"use server";

import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { fetchPriceById } from "@/data/master/price";
import { fetchMtUang } from "@/data/master/price";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import UpdatePriceForm from "@/components/dashboard/master/product-price/update-price-form";

const UpdatePrice = async ({
    params
}: {
    params: { id: string };
}) => {
    // const id = params.id
    const { id ="" } = await params || {id: ""}
    const priceFindByIdRaw = await fetchPriceById(id);
    const priceFindById = {
        ...priceFindByIdRaw,
        hargaHpp: priceFindByIdRaw.hargaHpp,
        hargaJual: priceFindByIdRaw.hargaJual
    };
    const mtUangFind = await fetchMtUang() || [];
    const validMtUangFind = Array.isArray(mtUangFind) ? mtUangFind : [];

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
                priceFindById={priceFindById}
                mtUangFind={validMtUangFind}
            />
        </ContentLayout>
    );
};

export default UpdatePrice;