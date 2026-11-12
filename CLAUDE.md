# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`bf_planning` is a monthly duty-schedule calendar: it records who (Yann or Bruno)
is on duty in the **morning** and **evening** of each day. It has two layers:

- **`server.js`** — a small Node.js + Express backend. It serves the static UI, validates
  requests, and persists one JSON file per month under `data/`.
- **`public/`** — a vanilla HTML/CSS/JS frontend (no framework). A public **view mode**
  shows the current month; a password-protected **edit mode** cycles each slot's assignment.

All user-facing strings, comments, and commit messages are in **French**. Keep that convention
when editing.

## Commands

```bash
npm install
npm start                 # node server.js, listens on PORT (default 3000)
```

There is **no test suite** in this repo.

### Linting / checks
```bash
bash checks.sh            # runs all linters/scanners in the xmk_linters Docker image → checks-report.md
```
`checks.sh` requires Docker (pulls an internal SAP linter image) and runs markdownlint,
eslint, semgrep, trivy, gitleaks, etc.

## Architecture

### Data model
- One file per month: `data/YYYY-MM.json` (e.g. `data/2026-04.json`), gitignored.
- Shape: `{ "<day>": { "morning": <name|null>, "evening": <name|null>, "requests"?: {...} } }`
  where day is `"1"`..`"31"`.
- Valid names (`VALID_NAMES`): `Yann`, `Bruno`, `Yann+cat`, `Bruno+cat`. The `+cat` variants
  carry an extra flag the UI renders; `YANN_VALUES` groups the two Yann forms.
- `requests` is an optional per-slot object mapping `morning`/`evening` to a status
  (`pending`/`approved`/`refused`). It represents Yann asking to be relieved of a slot.

### Server (`server.js`, CommonJS)
- `APP_PASSWORD` **must** be set (via env or `.env`, loaded by dotenv) or the process exits at
  startup. Auth is a single shared password.
- Write/edit endpoints require the password in the `x-password` header; GET is public.
- `validateSchedule` strictly validates the whole posted month before writing — reject anything
  with unknown names, out-of-range days, or malformed `requests`.
- `scrubRequests` runs on every save: it drops any `requests` entry whose slot is **not** currently
  assigned to Yann (requests only make sense for Yann's slots), and removes the empty `requests` object.
- `/api/request` lets anyone (no password) set/clear a `pending` request on a Yann slot, but only
  for a slot actually assigned to Yann and only for a day that is **not in the past** (`isPastDay`).

### API

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth` | — | Returns `{ ok }` if the posted password matches |
| GET  | `/api/schedule/:year/:month` | — | Returns the month's data (`{}` if none) |
| POST | `/api/schedule/:year/:month` | `x-password` header | Validates, scrubs, and saves the whole month |
| POST | `/api/request/:year/:month` | — | Set (`pending`) or clear (`null`) a request on a Yann slot |

`validateParams` enforces year 2020–2100 and month 1–12.

### Deployment
`install.sh` (run as **root** on Ubuntu 24.04) deploys to `/opt/bf_planning`, installs the
`deploy/bf_planning.service` systemd unit (runs as `www-data`), and injects the
`deploy/nginx-bf_planning.conf` snippet into the existing nginx vhost `/etc/nginx/sites-available/bruno`
at `/planning/`. The Express app serves from `/`; nginx reverse-proxies it under `/planning/`.
`data/` is backed up to `/opt/bf_planning_data.bak` (never overwritten). The service is **not**
started until `.env` (with `APP_PASSWORD`) exists.

## Conventions
- Node is pinned to 20.20.2 / npm 10.8.2 (see `package.json` engines and `.nvmrc`).
- Dependencies are only `express` and `dotenv` — keep the footprint minimal.
- Gitignored: `node_modules/`, `data/*.json`, `.env`, `tmp/`, `.vscode/`.
- The `// nosemgrep:` comments in `server.js` suppress known false positives — keep them when
  touching those lines.
