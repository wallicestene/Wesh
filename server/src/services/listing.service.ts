import type { Prisma } from "../../generated/prisma/client.js"
import { prisma } from "../lib/prisma.js";

// listing filters interface
export interface ListingFilters {
  neighborhoods?: string[] | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  bedrooms?: number[] | null;
  mustBeVerified?: boolean;
  includeHidden?: boolean; // only /admin passes true
}

export type ListingSort = "featured" | "price_asc" | "price_desc" | "newest";

//  turn plain filters into prisma where clause used by thr listings APi, the chatbot tool and the the alert matcher

export const buildWhereClause = (filters: ListingFilters = {}) => {
  const where: any = {};

  if (!filters.includeHidden) where.isHidden = false; // default to only show non-hidden listings

  // price range
  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {};
    if (filters.minPrice != null) where.price.gte = filters.minPrice;
    if (filters.maxPrice != null) where.price.lte = filters.maxPrice;
  }

  // bedrooms studio or 1,2,3...
  if (filters.bedrooms && filters.bedrooms.length > 0) {
    where.bedrooms = {
      in: filters.bedrooms,
    };
  }
  // neighborhoods
  if (filters.neighborhoods && filters.neighborhoods.length > 0) {
    where.neighborhood = {
      in: filters.neighborhoods,
      mode: "insensitive",
    };
  }
  // verified listings only

  if (filters.mustBeVerified) where.isVerified = true;

  return where;
};

// Order By clause for listings based on sort option

export const orderByClause = (sort: ListingSort = "featured"): Prisma.ListingOrderByWithRelationInput[] => {
  switch (sort) {
    case "price_asc":
      return [{ price: "asc" }, { id: "desc" }];
    case "price_desc":
      return [{ price: "desc" }, { id: "desc" }];
    case "newest":
      return [{ scrapedAt: "desc" }, { id: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { scrapedAt: "desc" }, { id: "desc" }];
  }
};

// find single page of listing matching filters and sort, with pagination

export const findListings = async (
  filters: ListingFilters = {},
  options: { page?: number; pageSize?: number; sort?: ListingSort } = {},
) => {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(Math.max(1, options.pageSize ?? 24), 100);
  const where = buildWhereClause(filters);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: orderByClause(options.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

// find one listing by id
export const findListingById = async (id: string) => {
  return prisma.listing.findUnique({
    where: { id },
  });
};
