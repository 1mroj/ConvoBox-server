/*
  Warnings:

  - You are about to drop the column `contactId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_contactId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "contactId",
DROP COLUMN "from",
DROP COLUMN "type",
ADD COLUMN     "senderId" TEXT NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Contact"("contactId") ON DELETE RESTRICT ON UPDATE CASCADE;
