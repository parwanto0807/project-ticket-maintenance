// types/software.ts
export interface Software {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    vendor: string | null;
    category: string | null;
    licenseType: string | null;
    defaultExpiry: number | null;
    website: string | null;
    version: string | null;
    licenseKey: string | null;
    expirationDate: string | null;
    status: string;
}

export interface AssetSoftwareInstallation {
    id: string;
    assetId: string;
    softwareId: string;
    installDate: Date | null;
    licenseKey: string | null;
    licenseExpiry: Date | null;
    version: string | null;
    isActive: boolean;
    software: Software;
}

export interface AssetWithSoftware {
    id: string;
    assetNumber: string;
    status: string;
    product?: {
        part_name: string;
    };
    assetType?: {
        name: string;
    };
    employee?: {
        name: string;
    } | null;
    softwareInstallations?: AssetSoftwareInstallation[];
}