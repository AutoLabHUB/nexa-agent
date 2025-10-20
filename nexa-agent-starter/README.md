# Nex‑a Agent — Vercel + Airtable

This is your upload-ready project for Step 2. Upload these files to a new GitHub repo, then import the repo into Vercel.

## Quick Start
1) Create a new GitHub repo (e.g., `nexa-agent`) and upload this folder's contents.
2) In Vercel → New Project → Import your repo.
3) Add environment variables (Project → Settings → Environment Variables) from `.env.example`.
4) Deploy.

## Test
POST `https://YOUR-PROJECT.vercel.app/api/intake/enquiry`
```json
{
  "name": "Alex Doe",
  "email": "alex@acme.com",
  "company": "Acme Pty Ltd",
  "subject": "Website automation & quoting",
  "body": "Looking to automate quoting for vehicle hire",
  "source": "Email"
}
```

## Endpoints
- POST `/api/intake/enquiry` → create Enquiry + upsert Contact/Org
- POST `/api/proposals` → create/update Proposal (PENDING_SEAN by default on create)
- POST `/api/proposals/[id]/approve` → mark APPROVED
- POST `/api/discovery` → create Discovery (3h @ $150)
- POST `/api/contracts/create` → stub for Acrobat Sign creation
- POST `/api/webhooks/acrobat` → stub receiver for Acrobat events
- POST `/api/agent/run` → AI-driven Phase 3 handler (Airtable webhooks call this)
- POST `/api/tools/notify/email` → email notifier stub
- POST `/api/tools/notify/slack` → Slack notifier (uses SLACK_WEBHOOK_URL)

Make sure your Airtable table names match the env variables.
