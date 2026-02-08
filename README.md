# Local RAG AI Agent with Bun & Ollama

A local RAG (Retrieval-Augmented Generation) agent built with **Bun**, **Ollama**, and **SQLite vector search**. It embeds documents into a local SQLite database, then uses an AI agent with tool-calling to search the knowledge base and answer questions.

## How it works

1. **Embed** — Documents are converted to 256-dimensional vectors using Ollama's `embeddinggemma` model with Matryoshka (MRL) slicing for efficiency.
2. **Store** — Vectors are stored in SQLite via the [`sqlite-vector`](https://github.com/sqliteai/sqlite-vector) extension, using cosine distance.
3. **Search** — A vector similarity search finds the top-3 most relevant documents for a given query.
4. **Answer** — An AI chat model decides whether to call the `search_database` tool, retrieves context, and generates a grounded answer.

## Prerequisites

- [Bun](https://bun.sh/).
- [Ollama](https://ollama.com/) running locally with the required models pulled (see `.env.example` for defaults):
  - An embedding model (default: `embeddinggemma`)
  - A chat/tool-calling model (default: `qwen3-next:80b-cloud`) but you can also use local model.

## Setup

```bash
# Install dependencies
bun install

# Copy the example env file and adjust models as needed
cp .env.example .env

# Make sure Ollama is running and pull the models from your .env
ollama pull embeddinggemma
ollama pull qwen3-next:80b-cloud # You can also use a local model
```

## Usage

```bash
bun run index.ts
```

On first run, the database is seeded with sample documents (pancake recipes, a Bun fact). The agent then answers three demo questions:

1. *"How do I make pancakes?"* — uses tool to search the knowledge base
2. *"Why should I use Bun?"* — uses tool to search the knowledge base
3. *"How much is 2 + 2?"* — answers directly without tool use

## Project structure

```
index.ts              # Entrypoint — seeds database and runs demo questions
src/
  config.ts           # Shared constants & instances (db, ollama)
  db.ts               # Database setup & document insertion
  embedding.ts        # Vector embedding via Ollama + Matryoshka slicing
  search.ts           # Vector similarity search
  agent.ts            # AI agent with tool-calling logic
extensions/
  vector.so           # sqlite-vector native extension (Linux)
.env                  # Environment variables (auto-loaded by Bun)
.env.example          # Example env file for reference
database/
  vectors.db          # SQLite database with vector embeddings (auto-created)
package.json
tsconfig.json
```

## Configuration

Bun [automatically loads](https://bun.sh/docs/runtime/environment-variables) the `.env` file. Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

| Variable          | Default            | Description                              |
| ----------------- | ------------------ | ---------------------------------------- |
| `EMBEDDING_MODEL` | `embeddinggemma`   | Ollama model used for embeddings         |
| `CHAT_MODEL`      | `qwen3-next:80b-cloud`  | Ollama model used for chat / tool-calling |
| `DIMENSIONS`      | `256`              | Matryoshka slice size (out of 768)       |
