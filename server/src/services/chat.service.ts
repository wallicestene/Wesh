import { google } from "@ai-sdk/google";
import { tool, stepCountIs, streamText } from "ai";
import { z } from "zod";
import { SF_CANONICAL_NEIGHBORHOODS } from "./geo.service.js";
import { findListings } from "./listing.service.js";
import { prisma } from "../lib/prisma.js"; // Import your Prisma instance

// Our custom, crash-proof message formatter
const formatSafeMessages = (messages: any[]): any[] => {
  return messages.map((msg) => {
    if (msg.parts && Array.isArray(msg.parts)) {
      const textContent = msg.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("\n");
      return { role: msg.role, content: textContent };
    }
    return { role: msg.role, content: msg.content || "" };
  });
};

export const runChatAgent = async (messages: any[]): Promise<any> => {
  const safeMessages = formatSafeMessages(messages);

  const result = streamText({
    model: google("gemini-flash-lite-latest"),
    system: `Your name is Wesh. You are a friendly, highly capable real estate assistant specializing in San Francisco apartments.
    
    You have access to a real-time database of SF rental listings via the searchListings tool.
    You also have the ability to save automatic email search alerts via the createAlert tool.
    
    CRITICAL DIRECTIONS FOR SEARCH RESULTS: 
    Do NOT list individual apartments, addresses, prices, or URLs in your text response when searching. The user interface automatically renders beautiful, clickable UI cards from your tool data. Your job is to provide a brief, friendly 1 to 2 sentence summary.
    
    CRITICAL DIRECTIONS FOR ALERTS:
    When a user wants to set up an alert, track updates, watch for new matches, or save preferences:
    1. Make sure you have their target criteria (max price, bedroom sizes, neighborhoods). If something is missing, clarify it conversationally.
    2. Politely ask for their email address if they haven't explicitly provided it yet (e.g., "What email address should I send the alerts to?"). 
    3. Once you have both the criteria and the email, execute the createAlert tool. Do not invent an email address.
    4. Inform the user in text once the tool successfully confirms the alert is active.
    
    Speak naturally and conversationally. If the user greets you, introduce yourself as Wesh.
    
    Valid SF neighborhoods: ${SF_CANONICAL_NEIGHBORHOODS.join(", ")}`,

    messages: safeMessages,

    tools: {
      // Tool 1: Real-time search engine
      searchListings: tool({
        description:
          "Search SF rental database based on exact extracted criteria.",
        inputSchema: z.object({
          max_price: z
            .number()
            .nullable()
            .describe("The maximum monthly rent. Null if not specified."),
          bedrooms: z
            .array(z.number())
            .nullable()
            .describe(
              "Array of bedroom counts. Studio = 0. E.g., [0, 1]. Null if not specified.",
            ),
          neighborhoods: z
            .array(z.string())
            .nullable()
            .describe(
              "Standardized SF neighborhoods mentioned. Null if anywhere.",
            ),
          must_be_verified: z
            .boolean()
            .default(false)
            .describe(
              "True ONLY if the user explicitly asks for verified or safe listings.",
            ),
        }),
        execute: async ({
          max_price,
          bedrooms,
          neighborhoods,
          must_be_verified,
        }) => {
          const { listings, total } = await findListings(
            {
              maxPrice: max_price,
              bedrooms,
              neighborhoods,
              mustBeVerified: must_be_verified,
            },
            { pageSize: 5, sort: "price_asc" },
          );

          return {
            extracted_criteria: { max_price, bedrooms, neighborhoods },
            matchCount: total,
            listings,
          };
        },
      }),

      // Tool 2: Persistent email alerts collector
      createAlert: tool({
        description:
          "Create an email alert subscription for the user based on their specific apartment criteria. Call this when the user wants to watch for new matches, track new listings, or save their search preferences.",
        inputSchema: z.object({
          userEmail: z
            .string()
            .email()
            .describe(
              "The validated email address of the user who wants to receive the notifications.",
            ),
          maxPrice: z
            .number()
            .nullable()
            .optional()
            .describe("Maximum monthly rent budget. Null if not specified."),
          bedrooms: z
            .array(z.number())
            .describe(
              "Array of desired bedroom counts. Use 0 for Studio, 1 for 1-bedroom, etc.",
            ),
          neighborhoods: z
            .array(z.string())
            .describe("Array of target San Francisco neighborhoods."),
        }),
        execute: async ({ userEmail, maxPrice, bedrooms, neighborhoods }) => {
          try {
            const newAlert = await prisma.alert.create({
              data: {
                userEmail,
                maxPrice: maxPrice || null,
                bedrooms,
                neighborhoods,
                isActive: true,
              },
            });

            return {
              success: true,
              alertId: newAlert.id,
              message: "Alert successfully created",
            };
          } catch (error) {
            console.error("Failed to create alert in tool execution:", error);
            return {
              success: false,
              message: "Database insertion failed",
            };
          }
        },
      }),
    },
    stopWhen: stepCountIs(2),
  });

  return result;
};
