/*
  Warnings:

  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Template";

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "wabaid" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);
