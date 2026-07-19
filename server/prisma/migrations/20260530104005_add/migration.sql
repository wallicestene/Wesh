-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "maxPrice" INTEGER,
    "bedrooms" INTEGER[],
    "neighborhoods" TEXT[],
    "mustBeVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alert_isActive_idx" ON "Alert"("isActive");

-- CreateIndex
CREATE INDEX "Alert_userEmail_idx" ON "Alert"("userEmail");
