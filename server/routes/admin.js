import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, role, region } = req.body;
    const [result] = await db.query(
      'INSERT INTO users (name, role, region, status, last_login) VALUES (?, ?, ?, ?, NOW())',
      [name, role, region, 'Active']
    );
    res.json({ id: result.insertId, ...req.body, status: 'Active' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM system_alerts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    res.json({
      totalFarmers: 127,
      totalWarehouses: 6,
      iotSensors: 284,
      monthlyVolume: 1240
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
