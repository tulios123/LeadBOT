import dotenv from "dotenv";

dotenv.config();

const AIRTABLE_URL = "https://api.airtable.com/v0/appnBjLdTxnF7dIZp/tbl0IgVvB9Qq3Fdn7";

export async function saveLead(data) {
  const { Name, Message, Reply, Phone, Date, Role } = data;

  const response = await fetch(AIRTABLE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [{ fields: { Name, Message, "AI Response": Reply, Phone, Date, Role } }],
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Airtable error: ${JSON.stringify(result.error)}`);
  }

  return result.records[0].id;
}

export async function getConversationHistory(phone) {
  const formula = encodeURIComponent(`{Phone} = "${phone}"`);
  const url = `${AIRTABLE_URL}?filterByFormula=${formula}&sort[0][field]=Date&sort[0][direction]=asc`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Airtable error: ${JSON.stringify(result.error)}`);
  }

  return result.records.map((record) => {
    const { Role, Message, "AI Response": aiResponse } = record.fields;
    return {
      role: Role,
      content: Role === "user" ? Message : aiResponse,
    };
  });
}
