import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendWhatsApp(to, message) {
  const result = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: to.startsWith("whatsapp:") ? to : "whatsapp:" + to,
    body: message,
  });

  return result.sid;
}
