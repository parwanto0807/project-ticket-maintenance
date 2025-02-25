-- CreateEnum
CREATE TYPE "TechnicianStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatusTicket" ADD VALUE 'Assigned';
ALTER TYPE "StatusTicket" ADD VALUE 'Canceled';

-- AlterTable
ALTER TABLE "TicketMaintenance" ADD COLUMN     "technicianId" TEXT;

-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "specialization" TEXT NOT NULL,
    "status" "TechnicianStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Technician_email_key" ON "Technician"("email");

-- AddForeignKey
ALTER TABLE "TicketMaintenance" ADD CONSTRAINT "TicketMaintenance_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;
