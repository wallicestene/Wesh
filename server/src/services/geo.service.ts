import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load SF neighborhood polygons in memory once at startup 
const sfNeighborhoods = JSON.parse(
  readFileSync(
    join(__dirname, "../../src/data/sf-neighborhoods.geojson"),
    "utf-8",
  ),
);

// Get canonical names for LLM prompts
export const SF_CANONICAL_NEIGHBORHOODS: string[] = sfNeighborhoods.features
  .map((f: any) => f.properties?.name)
  .filter(Boolean)
  .sort();

// return SF neighborhood name for given lat/lng
export const getNeighborhoodFromCoords = (
  lat: number,
  lng: number,
): string | null => {
  const pt = point([lng, lat]);

  for (const feature of sfNeighborhoods.features) {
    if (!feature.geometry) continue;
    try {
      if (booleanPointInPolygon(pt, feature)) {
        return feature.properties.name as string;
      }
    } catch {
      // Skip malformed geometries
      continue;
    }
  }

  return null;
};
