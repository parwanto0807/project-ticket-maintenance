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

type Employee = {
    id: string;
    name: string;
    email: string;
    address: string;
    userDept: string;
    picture: string | null;
};

type ErrorResponse = {
    message: string;
    error: unknown;
};

type EmployeeFindResponse = Employee | ErrorResponse | null;

// Fungsi untuk memeriksa apakah data adalah error response
function isErrorResponse(data: EmployeeFindResponse): data is ErrorResponse {
    return (data as ErrorResponse).error !== undefined;
}

const UpdateEmployee = async ({ params }: { params: { id: string } }) => {
    const { id ="" } = await params || {id: ""}

    const deptFind = await getDeptFindAll() || [];
    const validDeptFind = Array.isArray(deptFind) ? deptFind : [];

    const employeeFind: EmployeeFindResponse = await getEmployeesFindWithId(id);

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

            {/* Cek apakah response adalah error atau data employee */}
            {employeeFind && !isErrorResponse(employeeFind) ? (
                <EditForm deptFind={validDeptFind} employee={employeeFind} />
            ) : (
                <div>Error: Employee not found or invalid</div>
            )}
        </ContentLayout>
    );
};

export default UpdateEmployee;
