/*
  Warnings:

  - Added the required column `countNumber` to the `TicketMaintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketNumber` to the `TicketMaintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketMaintenance" ADD COLUMN     "countNumber" INTEGER NOT NULL,
ADD COLUMN     "ticketNumber" TEXT NOT NULL;
