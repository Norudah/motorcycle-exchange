/*
  Warnings:

  - Added the required column `status` to the `CommunicationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunicationRequest" ADD COLUMN     "status" BOOLEAN NOT NULL;
