#!/bin/bash

curl -s -X POST http://localhost:5678/webhook-test/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ישראל ישראלי",
    "phone": "050-1234567",
    "message": "שלום, אני מעוניין לשמוע פרטים נוספים"
  }' | python3 -m json.tool
