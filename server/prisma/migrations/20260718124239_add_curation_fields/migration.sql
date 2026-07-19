-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "agentNote" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Listing_neighborhood_price_bedrooms_idx" ON "Listing"("neighborhood", "price", "bedrooms");

-- CreateIndex
CREATE INDEX "Listing_isHidden_isFeatured_idx" ON "Listing"("isHidden", "isFeatured");
