"use server";

import Link from "next/link";
import EditWhEntry from "@/components/dashboard/transactions/logistic/whEntry/edit-whentry";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PagePropsEditTransactionStock } from "@/types";
import { fetchTransactionById } from "@/data/transactions/logistic/stock-master";

const UpdateWhEntry = async ({ params }: PagePropsEditTransactionStock) => {
    const { id } = await params; // Await the params to access id
    console.log(id);

    const stockTransactionById = await fetchTransactionById(id);

    if (!stockTransactionById || 'error' in stockTransactionById) {
        return (
            <ContentLayout title="Product Not Found">
                <p>Product with ID {id} was not found.</p>
            </ContentLayout>
        );
    }
    return (
        <ContentLayout title="Update WhEntry">
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
                            <Link href="/dashboard">Logistic</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/transactions/logistic/whEntry">WhEntry</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Update</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <EditWhEntry
                stockTransactionById={stockTransactionById}
                partNumbers={stockTransactionById.map((transaction: { id: string; Product: { part_number: string; part_name: string;} }) => ({
                    id: transaction.id,
                    part_number: transaction.Product.part_number,
                    part_name: transaction.Product.part_name,
                }))}
            />
        </ContentLayout>
    );
};

export default UpdateWhEntry;
