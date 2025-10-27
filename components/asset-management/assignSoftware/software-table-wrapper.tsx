// components/asset-management/software-table-wrapper.tsx
'use client'

import { AssetSoftwareTable } from "./software-table"
import { AssetSoftwareInstallation } from "@/types/software"

interface SoftwareTableWrapperProps {
    softwareInstallations: AssetSoftwareInstallation[]
    assetNumber: string
}

export function SoftwareTableWrapper({ softwareInstallations, assetNumber }: SoftwareTableWrapperProps) {
    const handleEditSoftware = (softwareInstallation: AssetSoftwareInstallation) => {
        console.log('Edit software:', softwareInstallation)
        // TODO: Implement edit modal or form
    }

    const handleDeleteSoftware = (installationId: string) => {
        console.log('Delete software installation:', installationId)
        // TODO: Implement delete confirmation and API call
        if (confirm('Are you sure you want to remove this software from the asset?')) {
            // API call to delete software installation
        }
    }

    return (
        <AssetSoftwareTable 
            softwareInstallations={softwareInstallations}
            assetNumber={assetNumber}
            onEdit={handleEditSoftware}
            onDelete={handleDeleteSoftware}
        />
    )
}