-- CreateEnum
CREATE TYPE "BookinType" AS ENUM ('ROAD', 'OFFROAD', 'SPORTIVE', 'REVIEW');

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "BookinType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
