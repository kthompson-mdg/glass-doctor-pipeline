const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_PATH = path.resolve(__dirname, process.env.DB_PATH || './pipeline.json');

// ─── Load / Save ──────────────────────────────────────────────

function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading database:', e.message);
  }
  return { lexington: [], houston: [] };
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Public API ───────────────────────────────────────────────

function saveDeal(deal) {
  const db = loadDb();
  const loc = deal.location || 'lexington';
  if (!db[loc]) db[loc] = [];

  const idx = db[loc].findIndex(d => d.id === deal.id);
  if (idx >= 0) {
    db[loc][idx] = { ...db[loc][idx], ...deal, updatedAt: new Date().toISOString() };
  } else {
    deal.createdAt = deal.createdAt || new Date().toISOString();
    deal.updatedAt = new Date().toISOString();
    db[loc].push(deal);
  }

  saveDb(db);
  return deal;
}

function removeDeal(id) {
  const db = loadDb();
  for (const loc of Object.keys(db)) {
    const before = db[loc].length;
    db[loc] = db[loc].filter(d => d.id !== id);
    if (db[loc].length < before) {
      saveDb(db);
      return true;
    }
  }
  return false;
}

function listDeals(location) {
  const db = loadDb();
  if (location) return db[location] || [];
  return Object.values(db).flat();
}

function bulkImport(allDeals) {
  const db = {};
  for (const loc of Object.keys(allDeals)) {
    db[loc] = allDeals[loc] || [];
  }
  saveDb(db);
}

function exportAll() {
  return loadDb();
}

module.exports = { saveDeal, removeDeal, listDeals, bulkImport, exportAll };
