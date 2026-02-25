"use client";

import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import { getEmployeesPages, getEmployeeStats, getEmployeesFindAll } from "@/data/master/employee";
import Pagination from "@/components/ui/pagination";
import EmployeeTable from "@/components/dashboard/master/employee/table";
import { CreateEmployee } from "@/components/dashboard/master/employee/buttons";
import EmployeeStats from "@/components/dashboard/master/employee/stats-cards";
import { MasterPageHeader } from "@/components/admin-panel/master-page-header";
import { Users } from "lucide-react";

const EmployeesPage = ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [stats, setStats] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams?.query || "";
  const page = searchParams?.page || "1";
  const currentPage = Number(page) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pages, overviewStats, employeesData] = await Promise.all([
          getEmployeesPages(query || ""),
          getEmployeeStats(),
          getEmployeesFindAll(query, currentPage)
        ]);
        setTotalPages(pages);
        setStats(overviewStats);
        setEmployees(employeesData as any[]);
      } catch (error) {
        console.error("Error fetching employees data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, currentPage]);

  return (
    <ContentLayout title="employee_management">
      <div className="flex flex-col gap-6 p-4 pt-6 md:p-8">
        <MasterPageHeader
          titleKey="karyawan"
          descKey="employee_description"
          icon={Users}
          breadcrumbKeys={[
            { labelKey: "dashboard", href: "/dashboard" },
            { labelKey: "master", href: "/dashboard" },
            { labelKey: "karyawan" }
          ]}
        />

        <div className="space-y-6">
          {stats && <EmployeeStats stats={stats} />}

          <div className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-72">
                <Search placeholder="Search Employee..." />
              </div>
              <CreateEmployee />
            </div>
          </div>

          <div className="w-full">
            <EmployeeTable employees={employees} loading={loading} currentPage={currentPage} />
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