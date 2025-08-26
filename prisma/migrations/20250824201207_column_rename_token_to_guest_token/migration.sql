/*
  Warnings:

  - You are about to drop the column `token` on the `Cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[guestToken]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Cart_token_key";

-- AlterTable
ALTER TABLE "public"."Cart" DROP COLUMN "token",
ADD COLUMN     "guestToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_guestToken_key" ON "public"."Cart"("guestToken");
