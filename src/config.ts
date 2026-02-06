import { Database } from "bun:sqlite";
import { Ollama } from "ollama";

export const EMBEDDING_MODEL = Bun.env.EMBEDDING_MODEL ?? "embeddinggemma";
export const CHAT_MODEL = Bun.env.CHAT_MODEL ?? "qwen3-next:80b-cloud";
export const DIMENSIONS = Number(Bun.env.DIMENSIONS ?? 256);

export const db = new Database("database/vectors.db");
export const ollama = new Ollama();

// Load the sqlite-vector extension
// Use .so on Linux/Windows or .dylib on macOS
db.loadExtension("extensions/vector.so");
