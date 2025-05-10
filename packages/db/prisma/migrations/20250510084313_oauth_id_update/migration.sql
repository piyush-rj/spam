/*
  Warnings:

  - You are about to drop the column `oauthId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[oauth_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_oauthId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "oauthId",
ADD COLUMN     "oauth_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_oauth_id_key" ON "User"("oauth_id");
