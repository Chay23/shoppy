/*
  Warnings:

  - You are about to alter the column `fullName` on the `BillingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `address` on the `BillingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `city` on the `BillingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `country` on the `BillingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `zipCode` on the `BillingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `fullName` on the `ShippingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `address` on the `ShippingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `city` on the `ShippingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `country` on the `ShippingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `zipCode` on the `ShippingInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "public"."BillingInfo" ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "zipCode" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."ShippingInfo" ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "zipCode" SET DATA TYPE VARCHAR(255);
