/*
  Warnings:

  - You are about to drop the `created_at` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "created_at";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
