import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get sowing records
router.get('/sowing', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sowing_records ORDER BY sowing_date DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add sowing record
router.post('/sowing', async (req, res) => {
  try {
    const { plot, crop_type, sowing_date, seed_qty, variety, fertiliser, notes } = req.body;
    const [result] = await db.query(
      'INSERT INTO sowing_records (plot, crop_type, sowing_date, seed_qty, variety, fertiliser, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [plot, crop_type, sowing_date, seed_qty, variety, fertiliser, notes]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get harvest records
router.get('/harvest', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM harvest_records ORDER BY harvest_date DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add harvest record
router.post('/harvest', async (req, res) => {
  try {
    const { plot, harvest_date, quantity_tonnes, grade, destination } = req.body;
    const batch_id = `BATCH-#2025-${plot}-${Date.now().toString().slice(-4)}`;
    const [result] = await db.query(
      'INSERT INTO harvest_records (batch_id, plot, harvest_date, quantity_tonnes, grade, destination) VALUES (?, ?, ?, ?, ?, ?)',
      [batch_id, plot, harvest_date, quantity_tonnes, grade, destination]
    );
    res.json({ id: result.insertId, batch_id, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
