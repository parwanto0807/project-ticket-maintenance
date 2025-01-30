"use server";

import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PagePropsFindTera } from "@/types";
import { fetchTeraBySerialNumber } from "@/data/transactions/logistic/wh-entry";
import CreateTeraForm from "@/components/dashboard/transactions/logistic/tera/create-tera";

const TeraCreate = async ({ params }: PagePropsFindTera) => {
    const { serialNumber } = await params; // Await the params to access id
    console.log(serialNumber);

    const stockTransactionBySerialNumber = await fetchTeraBySerialNumber(serialNumber);

    if (!stockTransactionBySerialNumber || 'error' in stockTransactionBySerialNumber) {
        return (
            <ContentLayout title="Product Not Found">
                <p>Product with ID {serialNumber} was not found.</p>
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
                            <Link href="/dashboard/transactions/logistic/tera">Data Tera</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CreateTeraForm
            // stockTransactionBySerialNumber={stockTransactionBySerialNumber}
                // partNumbers={stockTransactionById.map((transaction: { id: string; Product: { part_number: string; part_name: string;} }) => ({
                //     id: transaction.id,
                //     part_number: transaction.Product.part_number,
                //     part_name: transaction.Product.part_name,
                // }))}
            />
        </ContentLayout>
    );
};

export default TeraCreate;
