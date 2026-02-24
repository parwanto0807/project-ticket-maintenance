import Link from "next/link"
//import PageProduct from "@/components/demo/products-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import { getEmployeesPages, getEmployeeStats } from "@/data/master/employee";
import Pagination from "@/components/ui/pagination";
import EmployeeTable from "@/components/dashboard/master/employee/table";
import { CreateEmployee } from "@/components/dashboard/master/employee/buttons";
import EmployeeStats from "@/components/dashboard/master/employee/stats-cards";

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
  const stats = await getEmployeeStats();

  return (
    <ContentLayout title="Employee Management">
      <div className="flex flex-col gap-6 p-4 pt-6 md:p-8">
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

        <div className="space-y-6">
          <EmployeeStats stats={stats} />

          <div className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-72">
                <Search placeholder="Search Employee..." />
              </div>
              <CreateEmployee />
            </div>
          </div>

          <div className="w-full">
            <EmployeeTable query={query} currentPage={currentPage} />
          </div>

          <div className="flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default EmployeesPage;