"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import PlaceholderContent from "@/components/demo/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DashboardOverviewPage from "@/components/demo/overview-enduser";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const session = await getSession();
      const userRole = session?.user?.role ?? "USER"; // Default ke USER jika tidak ada role
      // console.log("User role:", userRole);
      setRole(userRole);
    };

    fetchRole();
  }, []);

  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      {role === "ADMIN" ? (
        <PlaceholderContent />
      ) : role === "USER" ? (
        <DashboardOverviewPage />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
    </ContentLayout>
  );
}
