/*
  Warnings:

  - Made the column `name` on table `templates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "templates" ALTER COLUMN "name" SET NOT NULL;
