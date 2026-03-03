const express = require('express');
const path = require('path');
require('dotenv').config();

const { saveDeal, removeDeal, listDeals, bulkImport, exportAll } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── REST API ────────────────────────────────────────────────

// Get all deals (optionally filter by location)
app.get('/api/deals', (req, res) => {
  try {
    const location = req.query.location || null;
    const deals = listDeals(location);
    res.json({ ok: true, deals });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Create or update a deal
app.post('/api/deals', (req, res) => {
  try {
    const deal = req.body;
    if (!deal.id || !deal.projectName) {
      return res.status(400).json({ ok: false, error: 'id and projectName are required' });
    }
    const saved = saveDeal(deal);
    res.json({ ok: true, deal: saved });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Delete a deal
app.delete('/api/deals/:id', (req, res) => {
  try {
    removeDeal(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Bulk export
app.get('/api/export', (req, res) => {
  try {
    const data = exportAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Bulk import
app.post('/api/import', (req, res) => {
  try {
    bulkImport(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Glass Doctor Pipeline running at http://localhost:${PORT}`);
});
