import Link from "next/link"
//import PageProduct from "@/components/demo/products-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import { getEmployeesPages } from "@/data/master/employee";
import Pagination from "@/components/ui/pagination";
import EmployeeTable from "@/components/dashboard/master/employee/table";
import { CreateEmployee } from "@/components/dashboard/master/employee/buttons";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const EmployeesPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const { query = "", page } = await searchParams || { query: "", page: "1" };
  const currentPage = Number(page) || 1;
  const totalPages = await getEmployeesPages(query || "");
  
  return (
    <ContentLayout title="Employee">
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
            <BreadcrumbPage>Employees</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <Search placeholder="Search Employee..." />
            <CreateEmployee />
          </div>

          <div className="w-full">
            <EmployeeTable query={query} currentPage={currentPage} />
          </div>

          <div className="flex justify-center mt-4">
            <Pagination totalPages={totalPages}/>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default EmployeesPage;