/*
  Warnings:

  - You are about to drop the column `latitude` on the `ContaminatedPoint` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `ContaminatedPoint` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `ContaminatedPoint` table. All the data in the column will be lost.
  - You are about to drop the column `settlementId` on the `ContaminatedPoint` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContaminatedPoint" DROP CONSTRAINT "ContaminatedPoint_regionId_fkey";

-- DropForeignKey
ALTER TABLE "ContaminatedPoint" DROP CONSTRAINT "ContaminatedPoint_settlementId_fkey";

-- AlterTable
ALTER TABLE "ContaminatedPoint" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "regionId",
DROP COLUMN "settlementId";

-- CreateTable
CREATE TABLE "ContaminatedPointLocation" (
    "id" TEXT NOT NULL,
    "contaminatedPointId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "settlementId" TEXT,
    "regionId" TEXT NOT NULL,

    CONSTRAINT "ContaminatedPointLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContaminatedPointLocation_contaminatedPointId_key" ON "ContaminatedPointLocation"("contaminatedPointId");

-- AddForeignKey
ALTER TABLE "ContaminatedPointLocation" ADD CONSTRAINT "ContaminatedPointLocation_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaminatedPointLocation" ADD CONSTRAINT "ContaminatedPointLocation_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaminatedPointLocation" ADD CONSTRAINT "ContaminatedPointLocation_contaminatedPointId_fkey" FOREIGN KEY ("contaminatedPointId") REFERENCES "ContaminatedPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
