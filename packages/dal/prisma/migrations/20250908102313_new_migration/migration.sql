/*
  Warnings:

  - You are about to drop the column `options` on the `CleanupEventQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CleanupEventQuestion" DROP COLUMN "options";

-- CreateTable
CREATE TABLE "CleanupEventQuestionOption" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "CleanupEventQuestionOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CleanupEventQuestionOption" ADD CONSTRAINT "CleanupEventQuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CleanupEventQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
