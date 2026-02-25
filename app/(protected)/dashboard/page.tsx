"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import PlaceholderContent from "@/components/demo/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Navbar } from "@/components/admin-panel/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DashboardOverviewPage from "@/components/demo/overview-enduser";
import DashboardTechnicianPage from "@/components/technician-panel/overview-technician";
import { useTranslation } from "@/hooks/use-translation";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRole = async () => {
      const session = await getSession();
      const userRole = session?.user?.role ?? "USER";
      setRole(userRole);
    };

    fetchRole();
  }, []);

  // Technician gets its own full-page layout without the ContentLayout inner padding
  if (role === "TECHNICIAN") {
    return (
      <div className="overflow-x-hidden w-full">
        <Navbar title={t("dashboard")} />
        <DashboardTechnicianPage />
      </div>
    );
  }

  return (
    <ContentLayout title={t("dashboard")}>
      {role === "ADMIN" ? (
        <Breadcrumb className="hidden sm:block ml-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{t("dashboard")}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      {role === "ADMIN" ? (
        <PlaceholderContent />
      ) : role === "USER" ? (
        <DashboardOverviewPage />
      ) : null}
    </ContentLayout>
  );
}
