# Duty Schedule Calendar Web App

## Context

Build a lightweight monthly calendar web app showing who (Yann or Bruno) is on duty for morning and evening slots, every day. View mode is public; edit mode requires a simple shared password. Targets a constrained Ubuntu 24.04 VM (1GB RAM) with nginx already running.

## Tech Stack

- **Backend:** Node.js + Express (single dependency)
- **Frontend:** Vanilla HTML/CSS/JS (no build step, no framework)
- **Storage:** JSON files on disk (one file per month)
- **Deployment:** systemd service + nginx reverse proxy

## Project Structure

```
bf_planning/
├── package.json
├── server.js                 # Express backend (~80 lines)
├── .env                      # APP_PASSWORD, PORT
├── .gitignore
├── data/                     # JSON schedule files (git-ignored)
│   └── .gitkeep
├── public/
│   ├── index.html            # Page shell
│   ├── style.css             # Calendar grid styles
│   └── app.js                # Frontend logic
└── deploy/
    ├── bf_planning.service   # systemd unit
    └── nginx-bf_planning.conf
```

## Implementation Details

### Backend (`server.js`)

**API endpoints:**
- `GET /api/schedule/:year/:month` — returns month data (or empty if no file)
- `POST /api/schedule/:year/:month` — saves month data (requires `x-password` header)
- `POST /api/auth` — validates password, returns `{ ok: true/false }`
- Static files served from `public/`

**Data format** (`data/2026-04.json`):
```json
{
  "1": { "morning": "Yann", "evening": "Bruno" },
  "2": { "morning": "Bruno", "evening": null },
  ...
}
```

**Validation:** year (4-digit 2020-2100), month (1-12), day keys (1-31), slot values must be `"Yann"`, `"Bruno"`, or `null`.

**Storage:** `fs.writeFileSync` — tiny files, 2 users, no locking needed.

### Frontend (`public/`)

**`index.html`:** Header with month title + nav arrows, calendar grid container, edit mode toggle button, password dialog.

**`style.css`:** CSS Grid (7 columns for Mon–Sun), cells with morning/evening sub-rows, color-coded (blue=Yann, orange=Bruno, gray=empty). Responsive for mobile.

**`app.js`:**
- State: `currentYear`, `currentMonth`, `schedule`, `editMode`, `password` (sessionStorage)
- `fetchSchedule()` — GET API, populate state
- `renderCalendar()` — build DOM grid for current month
- `handleCellClick(day, slot)` — cycle: empty → Yann → Bruno → empty, then save
- `saveSchedule()` — POST full month with password header
- `toggleEditMode()` — prompt password once, store in sessionStorage
- `navigateMonth(delta)` — change month, re-fetch, re-render

### Deployment files

**`deploy/bf_planning.service`:** systemd unit running as www-data, `EnvironmentFile=/opt/bf_planning/.env`, auto-restart on failure.

**`deploy/nginx-bf_planning.conf`:** Reverse proxy `location /` → `http://127.0.0.1:3000`.

## Deployment Steps (on server)

1. `sudo apt install nodejs npm`
2. Copy project to `/opt/bf_planning/`
3. `cd /opt/bf_planning && npm install --production`
4. Create `.env` with `APP_PASSWORD=<chosen-password>` and `PORT=3000`
5. `sudo mkdir -p /opt/bf_planning/data && sudo chown www-data:www-data /opt/bf_planning/data`
6. Install systemd service, enable and start
7. Install nginx config, reload nginx

## README.md

Update `README.md` with:

- **Purpose:** What the app does (duty scheduling calendar for 2 people, morning/evening slots)
- **Prerequisites:** Node.js, npm, nginx (for production)
- **Install:** Clone, `npm install`, create `.env`
- **Configuration:** Environment variables (`APP_PASSWORD`, `PORT`), nginx setup
- **How it works:** View mode (public monthly calendar), edit mode (password-protected, click to assign)
- **Running locally:** `APP_PASSWORD=xxx node server.js` → open `http://localhost:3000`
- **Deployment:** Steps to deploy on Ubuntu 24.04 (systemd + nginx reverse proxy)
- **Project structure:** Brief file/folder overview

## Verification

1. **Local:** `APP_PASSWORD=test123 node server.js` → open `http://localhost:3000`
2. Test view mode: see empty monthly calendar, navigate months
3. Test edit mode: click toggle, enter password, click cells to cycle names
4. Verify persistence: refresh page, assignments remain
5. Test wrong password: should get 401 rejection
6. Test month navigation: data is independent per month
