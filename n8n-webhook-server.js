import express from "express";
import { handleMessage } from "./claude-handler.js";
import { saveLead, getConversationHistory } from "./airtable-handler.js";
import { sendWhatsApp } from "./twilio-handler.js";

console.log('TWILIO SID:', process.env.TWILIO_ACCOUNT_SID?.slice(0, 10));
console.log('TWILIO TOKEN exists:', !!process.env.TWILIO_AUTH_TOKEN);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/webhook/lead", async (req, res) => {
  const { Body: message, From: phone } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Missing 'message' field" });
  }

  let history = [];
  try {
    history = await getConversationHistory(phone);
  } catch (error) {
    console.error("Airtable history error (non-fatal):", error.message);
  }

  let reply;
  try {
    reply = await handleMessage(message, history);
  } catch (error) {
    console.error("Claude error:", error.message);
    return res.status(500).json({ success: false, error: "Failed to process message" });
  }

  const date = new Date().toISOString();

  try {
    await saveLead({ Message: message, Phone: phone, Date: date, Role: "user" });
    await saveLead({ Reply: reply, Phone: phone, Date: date, Role: "assistant" });
  } catch (error) {
    console.error("Airtable error (non-fatal):", error.message);
  }

  try {
    await sendWhatsApp(phone, reply);
  } catch (error) {
    console.error("Twilio error (non-fatal):", error.message);
  }

  res.json({ success: true, reply });
});

app.listen(3000, () => {
  console.log("Webhook server running on http://localhost:3000");
});
