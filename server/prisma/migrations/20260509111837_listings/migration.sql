/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "bedrooms" DOUBLE PRECISION NOT NULL,
    "bathrooms" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "neighborhood" TEXT,
    "name" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "availableAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_url_key" ON "Listing"("url");

-- CreateIndex
CREATE INDEX "Listing_price_idx" ON "Listing"("price");

-- CreateIndex
CREATE INDEX "Listing_bedrooms_idx" ON "Listing"("bedrooms");
