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
import { AssetStatus, AssetType, Department, Employee, Product } from "@prisma/client";
import CreateTicketOnAssignForm from "@/components/asset-management/technician/assign/create-ticket-form";
import { getTechniciansForData } from "@/data/asset/technician";

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

const RegisterTicketAssign = async () => {

    const assetFind = await fetchAssetListForData() || [];
    const validAssetFind = Array.isArray(assetFind) ? assetFind : []; 

    const employeeFind = await getEmployeesFindData() || [];
    const validEmployeeFind = Array.isArray(employeeFind) ? employeeFind : [];

    const technicianFind = await getTechniciansForData() || [];
    const validTechnicianFind = Array.isArray(technicianFind) ? technicianFind : []; 


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
                            <Link href="/dashboard">Technician</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/technician/assign">Assign Technician</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CreateTicketOnAssignForm
                assetFind={validAssetFind as Asset[]}
                employeeDataFind={validEmployeeFind }
                technicianFind = { validTechnicianFind}
            />
        </ContentLayout>
    );
};

export default RegisterTicketAssign;