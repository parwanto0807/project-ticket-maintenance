/*
  Warnings:

  - Added the required column `assetNumber` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kode` to the `AssetType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "assetNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AssetType" ADD COLUMN     "kode" TEXT NOT NULL;
