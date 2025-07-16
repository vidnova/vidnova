/*
  Warnings:

  - You are about to drop the `CommentReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentReply" DROP CONSTRAINT "CommentReply_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentReply" DROP CONSTRAINT "CommentReply_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parent_id" TEXT;

-- DropTable
DROP TABLE "CommentReply";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
