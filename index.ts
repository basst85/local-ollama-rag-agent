import { initDatabase, addDocument, getDocumentCount, optimizeIndex } from "./src/db";
import { askAgent } from "./src/agent";

// --- Initialize ---
initDatabase();

// --- Seed database if empty ---
if (getDocumentCount() === 0) {
  console.log("Database is empty. Adding documents...");

  await addDocument("Ingredients for pancakes: Use 250g flour, 2 eggs and 500ml milk.");
  await addDocument("Pancake recipe: Mix flour, eggs and milk into a smooth batter. Fry in a hot pan until golden brown.");
  await addDocument("Fun fact about pancakes: In the Netherlands, we often eat pancakes with syrup and powdered sugar, while in the US they often serve them with maple syrup and butter.");
  await addDocument("Bun is a fast JavaScript runtime with native SQLite support. The website is https://bun.sh/.");

  optimizeIndex();
}

// --- Ask questions to the Agent ---
await askAgent("How do I make pancakes?");
await askAgent("Why should I use Bun?");
await askAgent("How much is 2 + 2?");