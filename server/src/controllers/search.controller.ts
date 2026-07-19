import { type Request, type Response } from "express";
import { parseUserQuery } from "../services/llm.service.js";
import { prisma } from "../lib/prisma.js";

const handleSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      res.status(400).json({
        error: "Please provide a search query in the request body.",
      });
      return;
    }
    // Gemini parsing
    console.log(`User says: "${query}"\n`);
    const criteria = await parseUserQuery(query);
    console.log("AI criteria:", criteria);

    //  prisma query construction
    const whereClause: any = {};
    if (criteria.max_price !== null) {
      whereClause.price = { lte: criteria.max_price };
    }
    if (criteria.bedrooms !== null && criteria.bedrooms.length > 0) {
      whereClause.bedrooms = { in: criteria.bedrooms };
    }
    if (criteria.neighborhoods !== null && criteria.neighborhoods.length > 0) {
      whereClause.neighborhood = {
        in: criteria.neighborhoods,
        mode: "insensitive",
      };
    }
    if (criteria.must_be_verified) {
      whereClause.isVerified = true;
    }

    // database query
    const results = await prisma.listing.findMany({
      where: whereClause,
      orderBy: { price: "asc" },
      take: 20, // limit results for performance
    });

    // send the criteria and results
    res.status(200).json({
      interparatedCriteria: criteria,
      matchCount: results.length,
      results,
    });
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ error: "Failed to process search request." });
  }
};

export { handleSearch };
