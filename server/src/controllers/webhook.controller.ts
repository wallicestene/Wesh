import { type Request, type Response } from "express";
import { fetchApifyDataset } from "../services/apify.service.js";
import { adaptHotpadsData } from "../services/adapter.service.js";
import { prisma } from "../lib/prisma.js";
import { processNewListingsForAlerts } from "../services/alerts.service.js";

const handleApifyWebhook = async (req: Request, res: Response) => {
  try {
    // Get relevant data from the webhook
    const { actId, defaultDatasetId } = req.body.resource;
    const eventType: string = req.body.eventType ?? "";
    const isFullRun = eventType === "ACTOR.RUN.SUCCEEDED";
    const actorId = actId;

    // Acknowledge receipt of the webhook
    res.status(200).send("Webhook received successfully");

    // fetch the data
    console.log(`[${eventType}] Fetching dataset: ${defaultDatasetId}`);
    const rawData = await fetchApifyDataset(defaultDatasetId);

    // adapt the data
    let formattedListings: any[] = [];

    // hotpads scraper
    if (actorId === "WaDioSa4JMFdAbH7Q") {
      formattedListings = adaptHotpadsData(rawData as any[]);
    } else {
      console.log("Unknown Actor ID, skipping adaptation.");
      return;
    }

    // save to database — upsert so existing listings get scrapedAt refreshed
    if (formattedListings.length > 0) {
      const ingestTime = new Date();

      await Promise.all(
        formattedListings.map((listing) => {
          const { isVerified, ...updatable } = listing;

          return prisma.listing.upsert({
            where: { url: listing.url },
            update: { ...updatable, scrapedAt: ingestTime },
            create: { ...listing, scrapedAt: ingestTime },
          });
        }),
      );

      console.log(`Upserted ${formattedListings.length} listings.`);

      // Only delete stale listings on successful run
      if (isFullRun) {
        const deleted = await prisma.listing.deleteMany({
          where: {
            source: "hotpads.com",
            scrapedAt: { lt: ingestTime },
          },
        });
        console.log(`Removed ${deleted.count} stale listings.`);
      } else {
        console.log(`Partial run (${eventType}) — skipping stale cleanup.`);
      }

      processNewListingsForAlerts(formattedListings);
      console.log(
        `Triggered alert evaluation for ${formattedListings.length} listings.`,
      );
    }
  } catch (error) {
    console.error("Error handling Apify webhook:", error);
  }
};

export { handleApifyWebhook };
