import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SoftwareForm from "@/components/dashboard/master/software/create-software-form";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const CreateSoftwarePage = () => {
    return (
        <ContentLayout title="Create Software">
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
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="h-full w-full">
                <div className="flex-1 space-y-4 p-0 pt-6 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        <SoftwareForm />
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default CreateSoftwarePage;