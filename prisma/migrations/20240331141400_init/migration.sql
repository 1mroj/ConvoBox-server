/*
  Warnings:

  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `wa_id` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Message` table. All the data in the column will be lost.
  - Added the required column `contactId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_to_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_pkey",
DROP COLUMN "wa_id",
ADD COLUMN     "contactId" TEXT NOT NULL,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("contactId");

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "to",
ADD COLUMN     "contactId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("contactId") ON DELETE RESTRICT ON UPDATE CASCADE;
