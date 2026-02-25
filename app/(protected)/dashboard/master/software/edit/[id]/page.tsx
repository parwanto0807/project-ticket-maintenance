import Link from "next/link"
import { notFound } from "next/navigation"
import { ContentLayout } from "@/components/admin-panel/content-layout";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import SoftwareUpdateForm from "@/components/dashboard/master/software/edit-software-form";
import { fetchSoftwareById } from "@/data/asset/software";

interface UpdateSoftwarePageProps {
    params: {
        id: string;
    };
}

const UpdateSoftwarePage = async ({ params }: UpdateSoftwarePageProps) => {
    let software;

    try {
        software = await fetchSoftwareById(params.id);
    } catch {
        notFound();
    }

    return (
        <ContentLayout title="Update Software">
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
                            <Link href="/dashboard/master">Master</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/master/software">Software</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Update {software.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="h-full w-full">
                <div className="flex-1 space-y-4 p-0 pt-6 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        <SoftwareUpdateForm
                            software={software}
                        />
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default UpdateSoftwarePage;