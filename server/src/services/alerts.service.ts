import { prisma } from "../lib/prisma.js";
import { sendEmailAlert } from "./email.service.js";

const processNewListingsForAlerts = async (newListings: any[]) => {
  if (!newListings || newListings.length === 0) return;

  try {
    const activeAlerts = await prisma.alert.findMany({
      where: { isActive: true },
    });

    if (activeAlerts.length === 0) return;

    for (const alert of activeAlerts) {
      // 1. Normalize alert criteria types to prevent string vs number mismatches
      const alertBeds = alert.bedrooms.map((b: any) => parseInt(b, 10));
      const alertHoods = alert.neighborhoods.map((n: string) =>
        n.toLowerCase().trim(),
      );

      const matches = newListings.filter((listing) => {
        // Check Price
        const matchesPrice = alert.maxPrice
          ? listing.price <= alert.maxPrice
          : true;

        // 2. Normalize listing bedroom to integer and check inclusion
        const listingBed = parseInt(listing.bedrooms, 10);
        const matchesBeds =
          alertBeds.length > 0 ? alertBeds.includes(listingBed) : true;

        // 3. Normalize neighborhood comparison (handles "Mission" matching "Mission District" or "mission")
        const listingHood = (listing.neighborhood || "").toLowerCase().trim();
        const matchesHood =
          alertHoods.length > 0
            ? alertHoods.some(
                (hood: string) =>
                  listingHood.includes(hood) || hood.includes(listingHood),
              )
            : true;

        return matchesPrice && matchesBeds && matchesHood;
      });

      if (matches.length > 0) {
        await sendEmailAlert(alert.userEmail, matches);
        console.log(
          `Sent alert to ${alert.userEmail} for ${matches.length} matches.`,
        );
      }
    }
  } catch (error) {
    console.error("Error processing alerts:", error);
  }
};

export { processNewListingsForAlerts };
