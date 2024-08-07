/*
  Warnings:

  - You are about to drop the `App` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropTable
DROP TABLE "App";

-- DropTable
DROP TABLE "Contact";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "messages" (
    "messageid" TEXT NOT NULL,
    "from" TEXT,
    "to" TEXT,
    "message" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "messagetype" TEXT NOT NULL,
    "messageenvent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("messageid")
);

-- CreateTable
CREATE TABLE "whatsappBuisness" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT,
    "status" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "verifiedName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsappBuisness_pkey" PRIMARY KEY ("id")
);
