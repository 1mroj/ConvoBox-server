/*
  Warnings:

  - The `buttons` column on the `templates` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "bodyVariable" TEXT,
ADD COLUMN     "headerVariable" TEXT,
DROP COLUMN "buttons",
ADD COLUMN     "buttons" JSONB;
