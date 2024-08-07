/*
  Warnings:

  - A unique constraint covering the columns `[businessWebsite]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_businessWebsite_key" ON "Users"("businessWebsite");
