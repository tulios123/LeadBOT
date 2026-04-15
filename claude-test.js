import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const customerMessage =
  "Hi, I'm interested in your services. How much does it cost and how do I get started?";

const systemPrompt = `You are a friendly sales assistant for a small business.
Your job is to respond to incoming customer inquiries via WhatsApp.
Be warm, professional, and concise (max 3 sentences).
Always end by asking one qualifying question to understand the customer's needs.`;

try {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: systemPrompt,
    messages: [{ role: "user", content: customerMessage }],
  });

  console.log("Customer:", customerMessage);
  console.log();
  console.log("Claude:", response.content[0].text);
} catch (error) {
  console.error("Error calling Anthropic API:", error.message);
  process.exit(1);
}
