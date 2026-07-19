import dotenv from "dotenv";
dotenv.config();

import { fetchApifyDataset } from "../services/apify.service.js";
import { adaptHotpadsData } from "../services/adapter.service.js";
import { prisma } from "../lib/prisma.js";

const DATASET_ID = process.argv[2];

if (!DATASET_ID) {
  console.error("Usage: npx tsx src/scripts/ingest-dataset.ts <datasetId>");
  process.exit(1);
}

console.log(`Fetching dataset: ${DATASET_ID}`);
const rawData: any = await fetchApifyDataset(DATASET_ID);
console.log(`Raw records fetched: ${rawData.length}`);

const formattedListings = adaptHotpadsData(rawData);
console.log(`Valid listings after filtering: ${formattedListings.length}`);

if (formattedListings.length === 0) {
  console.log("Nothing to save.");
  process.exit(0);
}

const ingestTime = new Date();

await Promise.all(
  formattedListings.map((listing) =>
    prisma.listing.upsert({
      where: { url: listing.url },
      update: { ...listing, scrapedAt: ingestTime },
      create: { ...listing, scrapedAt: ingestTime },
    }),
  ),
);

console.log(`Upserted ${formattedListings.length} listings.`);
await prisma.$disconnect();

// console.log(`Saved: ${result.count} new listings (duplicates skipped).`);
// await prisma.$disconnect();
