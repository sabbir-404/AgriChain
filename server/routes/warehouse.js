import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/inventory', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventory_items');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/inventory', async (req, res) => {
  try {
    const { sku, product, category, qty_tonnes, location, expiry, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO inventory_items (sku, product, category, qty_tonnes, capacity, location, expiry, status) VALUES (?, ?, ?, ?, 100, ?, ?, ?)',
      [sku, product, category, qty_tonnes, location, expiry, status]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
