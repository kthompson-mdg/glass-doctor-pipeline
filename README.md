# Glass Doctor — Sales Pipeline & CRM

Internal web application for tracking commercial glass opportunities across **Lexington** and **Houston** locations. Built for the Glass Doctor franchise team to manage deals from initial lead through project completion.

## Features

- **Kanban Pipeline Board** — visual board with stages: New Lead → Bid Preparation → Bid Submitted → Awarded → In Progress → Completed → Lost
- **Dashboard** — KPI cards (active pipeline value, weighted forecast, win rate, overdue items), stage breakdown chart, SOP compliance scores, upcoming deadlines, and financial tracking
- **List View** — sortable, searchable table of all deals with inline stage badges
- **Deal Management** — full-featured modal with tabs for:
  - Project details, contacts, team assignments, financials
  - SOP checklists (pre-construction, installation readiness, QC, closeout)
  - Materials tracker with procurement workflow
  - Submittals, change orders, risk & milestones
  - Communication log
- **Multi-Location** — toggle between Lexington and Houston pipelines
- **Import / Export** — JSON-based data backup and restore
- **Date Range Filtering** — 7D, 30D, 90D, YTD, or custom range on dashboard

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Vanilla HTML/CSS/JS (single file) |
| Backend   | Node.js + Express                 |
| Database  | JSON file (zero dependencies)     |
| Config    | dotenv                            |

The frontend stores data in `localStorage` for instant client-side use. The Express server provides a REST API backed by a JSON file for server-side persistence — no native compilation or database server required.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+

## Quick Start (Local Development)

```bash
# 1. Clone or copy the project folder
cd glass-doctor-pipeline

# 2. Install dependencies
npm install

# 3. Create your .env file (or use the included default)
#    Default values: PORT=3000, DB_PATH=./pipeline.json
cp .env.example .env   # or just use the existing .env

# 4. Start the server
npm start

# 5. Open in browser
open http://localhost:3000
```

The app will create `pipeline.json` automatically on first run.

## Environment Variables

| Variable  | Default            | Description                  |
|-----------|--------------------|------------------------------|
| `PORT`    | `3000`             | HTTP server port             |
| `DB_PATH` | `./pipeline.json`  | Path to JSON database file   |

## Project Structure

```
glass-doctor-pipeline/
├── server.js          # Express server + REST API routes
├── database.js        # JSON file persistence layer
├── package.json       # Dependencies and scripts
├── .env               # Environment variables (not committed)
├── .gitignore         # Ignores node_modules, .env, data files
├── README.md          # This file
└── public/
    └── index.html     # Complete frontend (HTML + CSS + JS)
```

## API Endpoints

All endpoints return JSON.

| Method   | Path              | Description                           |
|----------|-------------------|---------------------------------------|
| `GET`    | `/api/deals`      | List all deals (optional `?location=`) |
| `POST`   | `/api/deals`      | Create or update a deal               |
| `DELETE` | `/api/deals/:id`  | Delete a deal by ID                   |
| `GET`    | `/api/export`     | Export all deals as JSON              |
| `POST`   | `/api/import`     | Bulk import deals (replaces all data) |
| `GET`    | `/api/health`     | Server health check                   |

## Deployment

### Option A: Run directly on a server

```bash
# On your server (Ubuntu/macOS/Windows with Node.js installed)
cd glass-doctor-pipeline
npm install --production
PORT=3000 node server.js

# For persistent background running, use pm2:
npm install -g pm2
pm2 start server.js --name glass-doctor-pipeline
pm2 save
pm2 startup   # auto-start on reboot
```

### Option B: Run with Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Then build and run:

```bash
docker build -t glass-doctor-pipeline .
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data glass-doctor-pipeline
```

### Option C: Deploy to a cloud platform

The app works out of the box on platforms like Railway, Render, or Fly.io:

1. Push the project to a Git repository
2. Connect the repo to your cloud platform
3. Set the start command to `npm start`
4. Set environment variables (`PORT` is usually auto-assigned)
5. Deploy

### Network Access

To make the app accessible to other computers on your local network:

```bash
# Find your local IP
hostname -I              # Linux
ipconfig getifaddr en0   # macOS

# Other devices can access at:
# http://YOUR_IP:3000
```

## Data & Backups

- **Client-side**: Data is stored in the browser's `localStorage` under the key `gd_crm_v4`. Use the Export button in the app header to download a JSON backup.
- **Server-side**: The `pipeline.json` file contains all deal data. Back up this file periodically.
- **Import**: Use the Import button in the app or `POST /api/import` to restore from a JSON backup.

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Port already in use | Change `PORT` in `.env` or kill the process using that port |
| Blank page | Check that `public/index.html` exists and the server is running |
| Permission errors on data file | Ensure the server process has write access to the project directory |
| Node.js version errors | Update to Node.js 18+ (`node --version` to check) |
