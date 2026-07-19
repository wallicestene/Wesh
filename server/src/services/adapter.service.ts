import { getNeighborhoodFromCoords } from "./geo.service.js";


interface AdaptedHotpadsData {
  url: string;
  name: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  address: string | null;
  city: string | null;
  neighborhood: string | null;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
  description?: string | null;
  source: string;
  isVerified: boolean;
}

// HotPads pre-screens its listings, so everything from this source is
// trusted on arrival. The Craigslist adapter will set this to false.
const SOURCE_IS_TRUSTED = true;


// Adapt and normalize raw Hotpads data
const adaptHotpadsData = (rawData: any[]): AdaptedHotpadsData[] => {
  return rawData
    .filter(
      (item) =>
        item.price != null && item.url && item.latitude && item.longitude,
    )
    .map((item) => ({
      url: item.url,
      price: Math.round(Number(item.price)),
      bedrooms: parseFloat((item.bedrooms ?? item.beds ?? 0).toString()),
      bathrooms: parseFloat((item.bathrooms ?? item.baths ?? 1).toString()),
      latitude: item.latitude,
      longitude: item.longitude,
      address: item.street_address || item.address || null,
      city: item.city || null,
      // Turf.js polygon lookup is primary — source string is fallback
      neighborhood:
        getNeighborhoodFromCoords(item.latitude, item.longitude) ||
        item.neighborhood ||
        null,
      name: item.display_name || item.name || null,
      imageUrl: item.photos?.[0] || null,
      description: item.description ? item.description.substring(0, 500) : null,
      source: item.listing_source || "hotpads.com",
      isVerified: SOURCE_IS_TRUSTED,
    }));
};

export { adaptHotpadsData };
