import { ollama, CHAT_MODEL } from "./config";
import { searchDatabase } from "./search";

const tools = [
  {
    type: "function" as const,
    function: {
      name: "search_database",
      description: "Search the local knowledge base for information.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search term to find in the database.",
          },
        },
        required: ["query"],
      },
    },
  },
];

/**
 * Sends a question to the AI agent. The agent decides whether to use
 * the search_database tool or answer directly.
 * The system prompt is also included.
 */
export async function askAgent(userQuestion: string) {
  console.log(`\n👤 User question: "${userQuestion}"`);

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: "Give short, concrete answers with a maximum of 3 lines. Emojis are allowed, but only if relevant and at the end." },
    { role: "user", content: userQuestion },
  ];

  const response = await ollama.chat({
    model: CHAT_MODEL,
    messages,
    tools,
    think: 'low',
  });

  if (response.message.tool_calls) {
    messages.push(response.message as any);

    for (const tool of response.message.tool_calls) {
      console.log(`\n🤖 AI agent wants to use tool: ${tool.function.name}`);

      if (tool.function.name === "search_database") {
        const args = tool.function.arguments as { query: string };
        const result = await searchDatabase(args.query);

        messages.push({
          role: "tool",
          content: result,
        });
      }
    }

    // Second interaction. The AI gives an answer based on the found data 
    const finalResponse = await ollama.chat({
      model: CHAT_MODEL,
      messages,
      think: 'low',
    });

    console.log(`\n\n🤖 AI agent answer: ${finalResponse.message.content}`);
  } else {
    // No tool needed? Then direct answer 
    console.log(`\n\n🤖 AI agent answer: ${response.message.content}`);
  }
}
