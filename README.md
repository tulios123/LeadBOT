# AI Lead Bot

A WhatsApp lead-handling bot that uses Claude AI to reply to incoming customer messages, saves every conversation to Airtable, and sends replies back via Twilio WhatsApp.

## How it works

1. A customer sends a WhatsApp message to your Twilio sandbox number.
2. Twilio forwards the message to the webhook (`POST /webhook/lead`).
3. The bot fetches the customer's full conversation history from Airtable.
4. Claude (Haiku) generates a warm, concise sales reply based on the history.
5. Both the customer message and the AI reply are saved to Airtable.
6. The reply is sent back to the customer via Twilio WhatsApp.

## Stack

- **Node.js** (ES Modules)
- **Express** — webhook server on port 3000
- **Anthropic Claude** (`claude-haiku-4-5`) — AI reply generation
- **Airtable** — conversation history & lead storage
- **Twilio** — WhatsApp messaging

## Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/lead-bot.git
cd lead-bot
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
AIRTABLE_TOKEN=your_airtable_personal_access_token
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 3. Airtable table schema

Create a table with these fields:

| Field name   | Type          |
|--------------|---------------|
| Name         | Single line   |
| Phone        | Single line   |
| Message      | Long text     |
| AI Response  | Long text     |
| Date         | Single line   |
| Role         | Single line   |

Update `AIRTABLE_URL` in `airtable-handler.js` with your Base ID and Table ID.

### 4. Start the server

```bash
npm start
```

The server runs on `http://localhost:3000`.

### 5. Test it

```bash
curl -X POST http://localhost:3000/webhook/lead \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi, how much does it cost?", "name": "Test User", "phone": "+1234567890"}'
```

## Project structure

```
claude-handler.js        # Calls Claude API, manages conversation history
airtable-handler.js      # Saves leads and fetches conversation history
twilio-handler.js        # Sends WhatsApp messages via Twilio
n8n-webhook-server.js    # Express webhook server (entry point)
.env.example             # Template for required environment variables
```
