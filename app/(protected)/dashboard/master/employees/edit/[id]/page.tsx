import Link from "next/link"
import EditForm from "@/components/dashboard/master/employee/edit-form";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { getDeptFindAll, getEmployeesFindWithId } from "@/data/master/employee";

const UpdateEmployee = async ({ params }: { params: { id: string } }) => {
    const id = params.id

    const deptFind = await getDeptFindAll() || [];
    const validDeptFind = Array.isArray(deptFind) ? deptFind : [];
    const employeeFind = await getEmployeesFindWithId(id);
    // const validEmployeeFind = Array.isArray(employeeFind) ? employeeFind : [];

    return (
        <ContentLayout title="Update Employee">
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
                            <Link href="/dashboard/master/employees">Employee</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Update</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <EditForm
                deptFind={validDeptFind}
                employee={employeeFind as any}
            />
        </ContentLayout>
    );
};

export default UpdateEmployee;