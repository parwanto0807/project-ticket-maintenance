/*
  Warnings:

  - The primary key for the `Asset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Asset` table. All the data in the column will be lost.
  - The primary key for the `AssetType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AssetType` table. All the data in the column will be lost.
  - The primary key for the `Depreciation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Depreciation` table. All the data in the column will be lost.
  - The primary key for the `DepreciationType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DepreciationType` table. All the data in the column will be lost.
  - The required column `_id` was added to the `Asset` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `_id` was added to the `AssetType` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `_id` was added to the `Depreciation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `_id` was added to the `DepreciationType` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_assetTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Depreciation" DROP CONSTRAINT "Depreciation_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Depreciation" DROP CONSTRAINT "Depreciation_depreciationTypeId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_pkey",
DROP COLUMN "id",
ADD COLUMN     "_id" TEXT NOT NULL,
ALTER COLUMN "assetTypeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Asset_pkey" PRIMARY KEY ("_id");

-- AlterTable
ALTER TABLE "AssetType" DROP CONSTRAINT "AssetType_pkey",
DROP COLUMN "id",
ADD COLUMN     "_id" TEXT NOT NULL,
ADD CONSTRAINT "AssetType_pkey" PRIMARY KEY ("_id");

-- AlterTable
ALTER TABLE "Depreciation" DROP CONSTRAINT "Depreciation_pkey",
DROP COLUMN "id",
ADD COLUMN     "_id" TEXT NOT NULL,
ALTER COLUMN "assetId" SET DATA TYPE TEXT,
ALTER COLUMN "depreciationTypeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Depreciation_pkey" PRIMARY KEY ("_id");

-- AlterTable
ALTER TABLE "DepreciationType" DROP CONSTRAINT "DepreciationType_pkey",
DROP COLUMN "id",
ADD COLUMN     "_id" TEXT NOT NULL,
ADD CONSTRAINT "DepreciationType_pkey" PRIMARY KEY ("_id");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "AssetType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depreciation" ADD CONSTRAINT "Depreciation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depreciation" ADD CONSTRAINT "Depreciation_depreciationTypeId_fkey" FOREIGN KEY ("depreciationTypeId") REFERENCES "DepreciationType"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
