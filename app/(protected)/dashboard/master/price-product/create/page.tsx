import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { fetchProductsByName } from "@/data/master/products";
import { fetchProductBynamePages } from "@/data/master/products";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import CreatePriceForm from "@/components/dashboard/master/product-price/create-price-form";
import { fetchMtUang } from "@/data/master/price";

const CreatePrice = async ({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    }
  }) => { // Menangani kasus error
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    // const currentPage= 1
    const totalPages = await fetchProductBynamePages(query);

    const productFind = await fetchProductsByName(query, currentPage) || [];
    const validProductFind = Array.isArray(productFind) ? productFind : [];
    const mtUangFind = await fetchMtUang() || [];
    const validMtUangFind = Array.isArray(mtUangFind) ? mtUangFind : [];


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
                            <Link href="/dashboard/master/price-product">Product Price</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CreatePriceForm 
            totalPages={totalPages}
            mtUangFind={validMtUangFind}
            productFind={validProductFind}/>
        </ContentLayout>
    );
};

export default CreatePrice;