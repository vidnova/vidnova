/*
  Warnings:

  - A unique constraint covering the columns `[messageId,userId]` on the table `MessageReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CleanupEventQuestionType" AS ENUM ('TEXT', 'NUMBER', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'BOOLEAN', 'DATE', 'RANGE');

-- DropIndex
DROP INDEX "MessageReaction_messageId_userId_emoji_key";

-- CreateTable
CREATE TABLE "CleanupEventQuestion" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" "CleanupEventQuestionType" NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT[],
    "order" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL,

    CONSTRAINT "CleanupEventQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CleanupEventQuestionAnswear" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answear" TEXT NOT NULL,

    CONSTRAINT "CleanupEventQuestionAnswear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TakePartRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "TakePartRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CleanupEventQuestionAnswear_requestId_questionId_key" ON "CleanupEventQuestionAnswear"("requestId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "TakePartRequest_userId_eventId_key" ON "TakePartRequest"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_userId_key" ON "MessageReaction"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "CleanupEventQuestion" ADD CONSTRAINT "CleanupEventQuestion_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "CleanupEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleanupEventQuestionAnswear" ADD CONSTRAINT "CleanupEventQuestionAnswear_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "TakePartRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleanupEventQuestionAnswear" ADD CONSTRAINT "CleanupEventQuestionAnswear_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CleanupEventQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TakePartRequest" ADD CONSTRAINT "TakePartRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TakePartRequest" ADD CONSTRAINT "TakePartRequest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "CleanupEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
