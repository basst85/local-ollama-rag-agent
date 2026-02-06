import { db, DIMENSIONS } from "./config";
import { getEmbedding } from "./embedding";

/**
 * Creates the documents table and initializes the vector column 
 */
export function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      embedding BLOB
    )
  `);

  db.query(`
    SELECT vector_init(
      'documents', 
      'embedding', 
      'type=FLOAT32,dimension=${DIMENSIONS},distance=COSINE'
    );
  `).get();
}

/**
 * Adds a document to the database with its embedding.
 */
export async function addDocument(text: string) {
  const embedding = await getEmbedding(text);
  const insertStmt = db.prepare(`
    INSERT INTO documents (content, embedding) 
    VALUES ($content, vector_as_f32($embedding))
  `);

  insertStmt.run({
    $content: text,
    $embedding: JSON.stringify(embedding),
  });
  console.log(`Saved: "${text.substring(0, 30)}..."`);
}

/**
 * Returns the number of documents in the database
 */
export function getDocumentCount(): number {
  const { count } = db.query("SELECT COUNT(*) as count FROM documents").get() as { count: number };
  return count;
}

/**
 * Optimizes the vector index for search
 */
export function optimizeIndex() {
  db.query("SELECT vector_quantize('documents', 'embedding')").get();
}
