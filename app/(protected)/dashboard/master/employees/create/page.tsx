import Link from "next/link"
import CreateEmployeeForm from "@/components/dashboard/master/employee/create-from";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { 
    getEmployeesFindAll,
    getDeptFindAll
 } from "@/data/master/employee";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const CreateProduct = async () => { // Menangani kasus error
    const deptFind = await getDeptFindAll() || [];
    const validDeptFind = Array.isArray(deptFind) ? deptFind : [];


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
                            <Link href="/dashboard/master/employees">Employees</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <CreateEmployeeForm
                deptFind={validDeptFind}
            />
        </ContentLayout>
    );
};

export default CreateProduct;