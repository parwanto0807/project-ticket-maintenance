/*
  Warnings:

  - You are about to drop the column `description` on the `TicketMaintenance` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `TicketMaintenance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TicketMaintenance" DROP CONSTRAINT "TicketMaintenance_productId_fkey";

-- AlterTable
ALTER TABLE "TicketMaintenance" DROP COLUMN "description",
DROP COLUMN "productId";
