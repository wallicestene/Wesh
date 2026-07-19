import { parseUserQuery } from "./src/services/llm.service.ts";
import "dotenv/config";

const runTest = async () => {
  const query = "Find 2 bedroom apartments in San Francisco under $3000";
  console.log(`User says: "${query}"\n`);

  const results = await parseUserQuery(query);
  console.log("Gemini Output:");
  console.log(results, { depth: null });
};

runTest();
