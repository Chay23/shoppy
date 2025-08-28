/*
  Warnings:

  - You are about to drop the column `guestEmail` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "guestEmail",
ADD COLUMN     "email" TEXT;
