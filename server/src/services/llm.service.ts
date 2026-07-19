import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { SF_CANONICAL_NEIGHBORHOODS } from "./geo.service.js";

// expected structure for the LLM to return after parsing user input.
const SearchCriteriaSchema = z.object({
  max_price: z
    .number()
    .nullable()
    .describe(
      "The maximum monthly rent the user is willing to pay. Return null if no price is mentioned.",
    ),
  bedrooms: z
    .array(z.number())
    .nullable()
    .describe(
      "Array of desired bedroom counts. Convert 'Studio' to 0. E.g., '1 or 2 beds' -> [1, 2]. 'Studio or 1BR' -> [0, 1]. Return null if anywhere/any size.",
    ),
  neighborhoods: z
    .array(z.string())
    .nullable()
    .describe(
      "Canonical SF neighborhood names the user is looking for. Must be from the provided list only. Map colloquial names (e.g. 'SoMa', 'the Mission', 'the Castro') to the closest match. Return null if no neighborhood is mentioned.",
    ),
  must_be_verified: z
    .boolean()
    .default(false)
    .describe(
      "Set to true ONLY if the user explicitly asks for verified, safe, or scam-free listings.",
    ),
});

export type SearchCriteria = z.infer<typeof SearchCriteriaSchema>;

// the parsing function
const parseUserQuery = async (userInput: string): Promise<SearchCriteria> => {
  try {
    const { object } = await generateObject({
      model: google("gemini-3.1-flash-lite-preview"),
      schema: SearchCriteriaSchema,
      system: `You are a strict data-extraction assistant for a San Francisco real estate application.
      Your only job is to read the user's natural language request and extract the parameters into the provided JSON schema.
      Do not make assumptions. If a user does not specify a budget, neighborhood, or bedroom count, leave those fields as null.
      
      The ONLY valid neighborhood values you may return are from this exact list:
      ${SF_CANONICAL_NEIGHBORHOODS.join(", ")}
      
      Map colloquial names to the closest match in that list:
      - "SoMa" or "South of Market" → "South of Market"
      - "the Mission" or "Mission" → "Mission"
      - "the Castro" → "Castro"
      - "Haight" or "Haight-Ashbury" → "Haight Ashbury"
      - "FiDi" or "Financial District" → "Financial District"
      - "Civic Center" → "Civic Center"
      - "Tenderloin" or "TL" → "Tenderloin"
      - "Hayes" → "Hayes Valley"
      - "Noe" → "Noe Valley"
      - "Dogpatch" → "Dogpatch"
      - "Potrero" → "Potrero Hill"
      - "Bernal" → "Bernal Heights"
      - "Richmond" → "Inner Richmond"
      - "Sunset" → "Inner Sunset"
      Do not return any value not in the list above.`,
      prompt: userInput,
    });
    return object;
  } catch (error) {
    console.error("Failed to parse user query with Gemini:", error);
    throw new Error("Could not understand the search request.");
  }
};

export { parseUserQuery };