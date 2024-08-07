/*
  Warnings:

  - Added the required column `wamessageId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "from" TEXT,
ADD COLUMN     "to" TEXT,
ADD COLUMN     "wamessageId" TEXT NOT NULL,
ALTER COLUMN "text" DROP NOT NULL;
