import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { fetchAssetListForData } from "@/data/asset/asset";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { getEmployeesFindData } from "@/data/master/employee";
import CreateTicketForm from "@/components/asset-management/maintenance/create-ticket-form";
import { AssetStatus, AssetType, Department, Employee, Product } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface Asset {
    id: string;
    countNumber: number;
    assetNumber: string;
    status: AssetStatus;
    location: string | null;
    purchaseDate: Date | null;
    purchaseCost: number | null;
    residualValue: number | null;
    usefulLife: number | null;
    createdAt: Date;
    updatedAt: Date;
    assetTypeId: string;
    assetType: AssetType;
    departmentId: string;
    assetImage1: string | null;
    productId: string;
    employeeId: string | null;

    product: Product | null;
    employee: Employee | null;
    department: Department | null;
}

const RegisterTicket = async () => {

    const assetFind = await fetchAssetListForData() || [];
    const validAssetFind = Array.isArray(assetFind) ? assetFind : [];

    const employeeFind = await getEmployeesFindData() || [];
    const validEmployeeFind = Array.isArray(employeeFind) ? employeeFind : [];

    return (
        <ContentLayout title="Register Asset">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Badge className="items-center justify-center text-center" variant="outline">
                                <Link href="/dashboard">Dashboard</Link>
                            </Badge>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Badge className="items-center justify-center text-center" variant="outline">
                                <Link href="/dashboard">Maintenance</Link>
                            </Badge>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Badge className="items-center justify-center text-center" variant="outline">
                                <Link href="/dashboard/maintenance/ticket">Ticket List</Link>
                            </Badge>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Badge className="items-center justify-center text-center" variant="outline">
                            <BreadcrumbPage>Create</BreadcrumbPage>
                        </Badge>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CreateTicketForm
                assetFind={validAssetFind as Asset[]}
                employeeDataFind={validEmployeeFind}
            />
        </ContentLayout>
    );
};

export default RegisterTicket;