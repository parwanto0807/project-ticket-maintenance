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
        <ContentLayout title="Register Ticket">
            <Breadcrumb className="mb-6 px-1">
                <BreadcrumbList className="flex-wrap gap-1 md:gap-2">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link
                                href="/dashboard"
                                className="text-[10px] md:text-xs font-semibold hover:text-orange-600 transition-colors"
                            >
                                Dashboard
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="opacity-50" />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link
                                href="/dashboard"
                                className="text-[10px] md:text-xs font-semibold hover:text-orange-600 transition-colors"
                            >
                                Maintenance
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="opacity-50" />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link
                                href="/dashboard/maintenance/ticket"
                                className="text-[10px] md:text-xs font-semibold hover:text-orange-600 transition-colors"
                            >
                                Ticket List
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="opacity-50" />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-[10px] md:text-xs font-black text-orange-600">
                            Create
                        </BreadcrumbPage>
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