-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleID" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
