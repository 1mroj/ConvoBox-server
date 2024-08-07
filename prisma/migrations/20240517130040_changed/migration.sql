/*
  Warnings:

  - You are about to drop the `templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "templates";

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "wabaid" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
