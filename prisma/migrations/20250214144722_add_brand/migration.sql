-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brands" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isStaffPick" BOOLEAN NOT NULL DEFAULT false;
