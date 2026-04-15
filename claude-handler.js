import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const systemPrompt = `You are a friendly sales assistant for a small business.
Your job is to respond to incoming customer inquiries via WhatsApp.
Be warm, professional, and concise (max 3 sentences).
Always end by asking one qualifying question to understand the customer's needs.`;

export async function handleMessage(customerMessage, history = []) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages = [...history, { role: "user", content: customerMessage }];

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: systemPrompt,
    messages,
  });

  return response.content[0].text;
}
