/*
  Warnings:

  - The values [Complete] on the enum `StatusTicket` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusTicket_new" AS ENUM ('Pending', 'In_Progress', 'Completed');
ALTER TABLE "TicketMaintenance" ALTER COLUMN "status" TYPE "StatusTicket_new" USING ("status"::text::"StatusTicket_new");
ALTER TYPE "StatusTicket" RENAME TO "StatusTicket_old";
ALTER TYPE "StatusTicket_new" RENAME TO "StatusTicket";
DROP TYPE "StatusTicket_old";
COMMIT;
