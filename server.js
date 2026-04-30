'use strict';

require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_PASSWORD = process.env.APP_PASSWORD;

if (!APP_PASSWORD) {
  console.error('APP_PASSWORD environment variable is required');
  process.exit(1);
}

const DATA_DIR = path.join(__dirname, 'data');

const VALID_NAMES = new Set(['Yann', 'Bruno']);

function dataFile(year, month) {
  return path.join(DATA_DIR, `${year}-${String(month).padStart(2, '0')}.json`);
}

function validateParams(year, month) {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  return y >= 2020 && y <= 2100 && m >= 1 && m <= 12;
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
  }
  return true;
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

  const file = dataFile(year, month);
  if (!fs.existsSync(file)) return res.json({});

  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(data);
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

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(dataFile(year, month), JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to save schedule' });
  }
});

app.listen(PORT, () => {
  console.log(`bf_planning running on port ${PORT}`);
});
