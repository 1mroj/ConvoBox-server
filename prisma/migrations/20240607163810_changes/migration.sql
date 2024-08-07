/*
  Warnings:

  - You are about to drop the column `headerFormat` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `headerHandle` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `headerText` on the `templates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "headerFormat",
DROP COLUMN "headerHandle",
DROP COLUMN "headerText",
ADD COLUMN     "header" TEXT,
ADD COLUMN     "header_format" TEXT,
ADD COLUMN     "header_handle" TEXT;
