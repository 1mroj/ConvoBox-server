/*
  Warnings:

  - You are about to drop the column `header` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `header_format` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `header_handle` on the `templates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "header",
DROP COLUMN "header_format",
DROP COLUMN "header_handle",
ADD COLUMN     "headerFormat" TEXT,
ADD COLUMN     "headerHandle" TEXT,
ADD COLUMN     "headerText" TEXT;
