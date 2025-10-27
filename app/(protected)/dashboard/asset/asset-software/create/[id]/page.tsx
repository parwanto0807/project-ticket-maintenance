// app/dashboard/asset/asset-list/[id]/software/page.tsx
import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { AssignSoftwareButton } from "@/components/asset-management/assignSoftware/assign-software-button"
import { SoftwareTableWrapper } from "@/components/asset-management/assignSoftware/software-table-wrapper"
import { fetchAssetById } from "@/data/asset/asset"
import { AssetSoftwareInstallation } from "@/types/software"

interface AssetSoftwarePageProps {
    params: {
        id: string
    }
}

const AssetSoftwarePage = async ({ params }: AssetSoftwarePageProps) => {
    const result = await fetchAssetById(params.id)

    // Handle null case
    if (!result) {
        return (
            <ContentLayout title="Asset Not Found">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Asset Not Found</h2>
                    <p className="text-gray-600 mb-4">The asset youre looking for doesnt exist.</p>
                    <Link href="/dashboard/asset/asset-list" className="text-blue-600 hover:underline">
                        Back to Asset List
                    </Link>
                </div>
            </ContentLayout>
        )
    }

    // Handle error case
    if ('error' in result) {
        return (
            <ContentLayout title="Error">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{result.error}</p>
                    <Link href="/dashboard/asset/asset-list" className="text-blue-600 hover:underline">
                        Back to Asset List
                    </Link>
                </div>
            </ContentLayout>
        )
    }

    // Type assertion dengan type yang sesuai
    const softwareInstallations = (result.softwareInstallations || []) as AssetSoftwareInstallation[]

    return (
        <ContentLayout title={`Software - ${result.assetNumber}`}>
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
                            <Link href="/dashboard/asset/asset-list">Asset List</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Software</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-6 p-6">
                {/* Asset Info */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-xl font-bold">{result.assetNumber}</h1>
                            <p className="text-gray-600">
                                {result.product?.part_name} • {result.assetType?.name}
                            </p>
                            {result.employee && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Assigned to: {result.employee.name}
                                </p>
                            )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${result.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                            result.status === 'IN_USE' ? 'bg-blue-100 text-blue-800' :
                                result.status === 'UNDER_MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {result.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* Software Management Section */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold">Software Management</h2>
                            <p className="text-gray-600 text-sm">
                                {softwareInstallations.length > 0
                                    ? `${softwareInstallations.length} software assigned to this asset`
                                    : "Assign and manage software for this asset"
                                }
                            </p>
                        </div>
                        <AssignSoftwareButton assetId={result.id} />
                    </div>

                    {/* Software Table - Client Component */}
                    <SoftwareTableWrapper
                        softwareInstallations={softwareInstallations}
                        assetNumber={result.assetNumber}
                    />
                </div>
            </div>
        </ContentLayout>
    )
}

export default AssetSoftwarePage