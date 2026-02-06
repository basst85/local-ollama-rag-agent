import { db } from "./config";
import { getEmbedding } from "./embedding";

/**
 * The search function that the AI agent can use as a tool
 * Returns the top 3 most relevant documents for a given query
 */
export async function searchDatabase(query: string): Promise<string> {
  console.log(`\nTool called: Searching for "${query}"...`);

  const queryVector = await getEmbedding(query);

  // Search for the top 3 most relevant documents
  const results = db
    .prepare(
      `
    SELECT d.content, v.distance
    FROM documents d
    JOIN vector_quantize_scan(
      'documents', 'embedding', vector_as_f32(?), 3
    ) v ON d.id = v.rowid
    ORDER BY v.distance ASC
  `
    )
    .all(JSON.stringify(queryVector)) as Array<{ content: string; distance: number }>;

  // Display results in console
  console.log(`\nSearch results (${results.length} found). Highest relevance:`);
  if (results.length > 0) {
    console.log(`1. "${results[0].content}" (distance: ${results[0].distance.toFixed(4)})`);
  } else {
    console.log("No relevant documents found.");
  }

  return JSON.stringify(results);
}
