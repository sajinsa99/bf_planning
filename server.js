'use strict';

require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express(); // nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
const PORT = process.env.PORT || 3000;
const APP_PASSWORD = process.env.APP_PASSWORD;

if (!APP_PASSWORD) {
  console.error('APP_PASSWORD environment variable is required');
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, 'data');

const VALID_NAMES = new Set(['Yann', 'Bruno', 'Yann+cat', 'Bruno+cat']);
const YANN_VALUES = new Set(['Yann', 'Yann+cat']);
const VALID_REQUEST_STATUSES = new Set(['pending', 'approved', 'refused']);

function dataFile(year, month) {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  return path.join(DATA_DIR, `${y}-${String(m).padStart(2, '0')}.json`);
}

function validateParams(year, month) {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  return y >= 2020 && y <= 2100 && m >= 1 && m <= 12;
}

function isPastDay(year, month, day) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month - 1, day) < today;
}

function validateSchedule(data) {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return false;
  for (const [day, slots] of Object.entries(data)) {
    const d = parseInt(day, 10);
    if (isNaN(d) || d < 1 || d > 31) return false;
    if (typeof slots !== 'object' || slots === null) return false;
    for (const slot of ['morning', 'evening']) {
      if (!(slot in slots)) return false;
      const v = slots[slot];
      if (v !== null && !VALID_NAMES.has(v)) return false;
    }
    if ('requests' in slots) {
      const r = slots.requests;
      if (typeof r !== 'object' || r === null || Array.isArray(r)) return false;
      for (const k of Object.keys(r)) {
        if (k !== 'morning' && k !== 'evening') return false;
        if (!VALID_REQUEST_STATUSES.has(r[k])) return false;
      }
    }
  }
  return true;
}

function scrubRequests(data) {
  for (const slots of Object.values(data)) {
    if (!slots.requests) continue;
    for (const slot of ['morning', 'evening']) {
      if (slots.requests[slot] && !YANN_VALUES.has(slots[slot])) {
        delete slots.requests[slot];
      }
    }
    if (Object.keys(slots.requests).length === 0) delete slots.requests;
  }
}

function readMonth(year, month) {
  const file = dataFile(year, month);
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeMonth(year, month, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(dataFile(year, month), JSON.stringify(data, null, 2), 'utf8');
}

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => res.setHeader('Cache-Control', 'no-cache')
}));
app.use(express.json());

app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  res.json({ ok: password === APP_PASSWORD });
});

app.get('/api/schedule/:year/:month', (req, res) => {
  const { year, month } = req.params;
  if (!validateParams(year, month)) return res.status(400).json({ error: 'Invalid year or month' });

  try {
    res.json(readMonth(year, month));
  } catch {
    res.status(500).json({ error: 'Failed to read schedule' });
  }
});

app.post('/api/schedule/:year/:month', (req, res) => {
  if (req.headers['x-password'] !== APP_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { year, month } = req.params;
  if (!validateParams(year, month)) return res.status(400).json({ error: 'Invalid year or month' });

  const data = req.body;
  if (!validateSchedule(data)) return res.status(400).json({ error: 'Invalid schedule data' });

  scrubRequests(data);

  try {
    writeMonth(year, month, data);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to save schedule' });
  }
});

app.post('/api/request/:year/:month', (req, res) => {
  const { year, month } = req.params;
  if (!validateParams(year, month)) return res.status(400).json({ error: 'Invalid year or month' });

  const { day, slot, status } = req.body || {};
  const d = parseInt(day, 10);
  if (isNaN(d) || d < 1 || d > 31) return res.status(400).json({ error: 'Invalid day' });
  if (slot !== 'morning' && slot !== 'evening') return res.status(400).json({ error: 'Invalid slot' });
  if (status !== 'pending' && status !== null) return res.status(400).json({ error: 'Invalid status' });

  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  if (isPastDay(y, m, d)) return res.status(400).json({ error: 'Past day' });

  let data;
  try {
    data = readMonth(year, month);
  } catch {
    return res.status(500).json({ error: 'Failed to read schedule' });
  }

  const dayKey = String(d);
  const slots = data[dayKey];
  if (!slots || !YANN_VALUES.has(slots[slot])) {
    return res.status(400).json({ error: 'Slot is not assigned to Yann' });
  }

  if (status === null) {
    if (slots.requests) {
      delete slots.requests[slot];
      if (Object.keys(slots.requests).length === 0) delete slots.requests;
    }
  } else {
    if (!slots.requests) slots.requests = {};
    slots.requests[slot] = 'pending';
  }

  try {
    writeMonth(year, month, data);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to save request' });
  }
});

app.listen(PORT, () => {
  console.log(`bf_planning running on port ${PORT}`);
});
