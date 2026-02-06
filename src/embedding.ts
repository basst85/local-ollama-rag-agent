import { ollama, EMBEDDING_MODEL, DIMENSIONS } from "./config";

/**
 * Generates an embedding via Ollama and applies Matryoshka slicing.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await ollama.embeddings({
    model: EMBEDDING_MODEL,
    prompt: text,
  });

  // Take only the first 256 numbers for speed and efficiency. 
  // MRL (Matryoshka Recursive Layering) TRICK
  return response.embedding.slice(0, DIMENSIONS);
}
