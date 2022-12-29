/*
  Warnings:

  - You are about to drop the column `chatRoomId` on the `CommunicationRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunicationRequest" DROP CONSTRAINT "CommunicationRequest_chatRoomId_fkey";

-- AlterTable
ALTER TABLE "CommunicationRequest" DROP COLUMN "chatRoomId",
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "status" SET DATA TYPE TEXT;
