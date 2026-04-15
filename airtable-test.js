import { saveLead } from "./airtable-handler.js";

try {
  const recordId = await saveLead({
    Name: "Test Customer",
    Message: "How much does it cost?",
    Reply: "Great question! Let me help you.",
    Phone: "+972501234567",
    Date: new Date().toISOString(),
  });

  console.log("Success! Created record ID:", recordId);
} catch (error) {
  console.error("Error:", error.message);
}
