import dotenv from "dotenv";
dotenv.config();

// fetch dataset items from Apify API
const fetchApifyDataset = async (datasetId: string) => {
  const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${process.env.APIFY_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Apify fetch failed : ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching dataset ${datasetId}: ${error}`);
    throw error;
  }
};

export { fetchApifyDataset };
