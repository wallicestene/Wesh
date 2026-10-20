import { type Request, type Response } from "express";
import { boolean } from "zod";
import {
  findListingById,
  findListings,
  type ListingFilters,
  type ListingSort,
} from "../services/listing.service.js";
import { SF_CANONICAL_NEIGHBORHOODS } from "../services/geo.service.js";

// query string parsing helpers

const parseNumber = (value: unknown): number | null => {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

//
const parseList = (value: unknown): string[] | null => {
  if (typeof value !== "string" || value.trim() === "") return null;
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : null;
};
// parse number List

const parseNumberList = (value: unknown): number[] | null => {
  const items = parseList(value);
  if (!items) return null;

  const numbers = items.map(Number).filter((n) => Number.isFinite(n));
  return numbers.length > 0 ? numbers : null;
};

// allow only sorted values we support
const SORT_OPTIONS: ListingSort[] = [
  "featured",
  "price_asc",
  "price_desc",
  "newest",
];

const parseSort = (value: unknown): ListingSort =>
  typeof value === "string" && SORT_OPTIONS.includes(value as ListingSort)
    ? (value as ListingSort)
    : "featured";

// controller functions

// get listings
const getListings = async (req: Request, res: Response) => {
  try {
    const filters: ListingFilters = {
      neighborhoods: parseList(req.query.neighborhoods),
      minPrice: parseNumber(req.query.minPrice),
      maxPrice: parseNumber(req.query.maxPrice),
      bedrooms: parseNumberList(req.query.bedrooms),
      mustBeVerified: req.query.verified === "true",
    };

    const results = await findListings(filters, {
      page: parseNumber(req.query.page) ?? 1,
      pageSize: parseNumber(req.query.pageSize) ?? 24,
      sort: parseSort(req.query.sort),
    });

    res.status(200).json(results);
  } catch (error) {
    console.log("Failed to fetch Listings:", error);
    res.status(500).json({ error: "Failed to fetch listings." });
  }
};

// get single listing

const getSingleListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string" || id.trim() === "") {
      res.status(400).json({ error: "Missing listing ID." });
      return;
    }
    const listing = await findListingById(id);

    if (!listing || listing.isHidden) {
      res.status(404).json({ error: "Listing not found." });
      return;
    }

    res.status(200).json(listing);
  } catch (error) {
    console.log("Failed to fetch Listing:", error);
    res.status(500).json({ error: "Failed to fetch listing." });
  }
};

// get neighborhoods

const getNeighborhoods = async (_req: Request, res: Response) => {
  res.status(200).json({ neighborhoods: SF_CANONICAL_NEIGHBORHOODS });
};

export { getListings, getSingleListing, getNeighborhoods };
