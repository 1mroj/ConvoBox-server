/*
  Warnings:

  - The primary key for the `templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `templates` table. All the data in the column will be lost.
  - Added the required column `template_id` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templates" DROP CONSTRAINT "templates_pkey",
DROP COLUMN "id",
ADD COLUMN     "template_id" TEXT NOT NULL,
ADD CONSTRAINT "templates_pkey" PRIMARY KEY ("template_id");
