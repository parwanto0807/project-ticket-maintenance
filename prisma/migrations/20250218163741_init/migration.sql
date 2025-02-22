/*
  Warnings:

  - Changed the type of `priorityStatus` on the `TicketMaintenance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `TicketMaintenance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PriorityStatus" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "StatusTicket" AS ENUM ('Pending', 'In_Progress', 'Complete');

-- AlterTable
ALTER TABLE "TicketMaintenance" DROP COLUMN "priorityStatus",
ADD COLUMN     "priorityStatus" "PriorityStatus" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusTicket" NOT NULL;
