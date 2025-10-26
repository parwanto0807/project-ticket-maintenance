-- CreateEnum
CREATE TYPE "ConnectionType" AS ENUM ('ETHERNET', 'WIFI', 'BLUETOOTH', 'SERIAL', 'USB', 'VPN', 'CLOUD', 'OTHER');

-- CreateTable
CREATE TABLE "Software" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vendor" TEXT,
    "category" TEXT,
    "licenseType" TEXT,
    "defaultExpiry" INTEGER,
    "website" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftwareInstallation" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "installDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "licenseKey" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "version" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SoftwareInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetCredential" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordEnc" TEXT NOT NULL,
    "role" TEXT,
    "accountType" TEXT,
    "note" TEXT,
    "ipAddress" TEXT,
    "macAddress" TEXT,
    "connectionType" "ConnectionType",
    "hostname" TEXT,
    "portNumber" INTEGER,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetCredential_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SoftwareInstallation" ADD CONSTRAINT "SoftwareInstallation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareInstallation" ADD CONSTRAINT "SoftwareInstallation_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCredential" ADD CONSTRAINT "AssetCredential_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
