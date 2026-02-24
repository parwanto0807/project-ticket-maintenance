import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { fetchTicketListPages, fetchTicketCalendarData } from "@/data/asset/ticket";
import AssignTable from "@/components/asset-management/technician/assign/tabel";
import { CreateTicketButtonAssign } from "@/components/asset-management/technician/assign/buttons";
import DashboardStats from "@/components/asset-management/technician/assign/stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Table as TableIcon } from "lucide-react";
import AssignCalendarView from "@/components/asset-management/technician/assign/calendar-view";

const TicketPage = async ({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) => {
  const { query = "", page } = await searchParams || { query: "", page: "1" };
  const currentPage = Number(page) || 1;

  const [totalPages, calendarData] = await Promise.all([
    fetchTicketListPages(query || ""),
    fetchTicketCalendarData(query || "")
  ]);

  return (
    <ContentLayout title="Assign Technician">
      <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
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
              <BreadcrumbPage>Assign Technician</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DashboardStats />

        <div className="flex flex-col gap-4">
          <Tabs defaultValue="table" className="w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Search placeholder="Search Ticket Assign..." />
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm px-4 py-2 flex items-center gap-2">
                    <TableIcon className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Table</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm px-4 py-2 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-wider">Calendar</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <CreateTicketButtonAssign />
            </div>

            <TabsContent value="table" className="mt-0">
              <div className="w-full">
                <AssignTable query={query} currentPage={currentPage} />
              </div>
              <div className="flex justify-center mt-6 py-4 border-t border-slate-100 dark:border-slate-800">
                <Pagination totalPages={totalPages} />
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <AssignCalendarView initialTickets={calendarData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ContentLayout>
  );
};

export default TicketPage;