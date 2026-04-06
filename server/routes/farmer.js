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
    const { plot, crop_type, seed_type, sowing_date, expected_harvest_date, seed_qty, variety, fertiliser, pesticides, usage_rates, notes, status } = req.body;
    const [result] = await db.query(
      `INSERT INTO sowing_records 
       (plot, crop_type, seed_type, sowing_date, expected_harvest_date, seed_qty, variety, fertiliser, pesticides, usage_rates, notes, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plot, crop_type, seed_type, sowing_date, expected_harvest_date, seed_qty, variety, fertiliser, pesticides, usage_rates, notes, status || 'Growing']
    );
    res.json({ id: result.insertId, plot, crop_type, seed_type, sowing_date, expected_harvest_date, seed_qty, variety, fertiliser, pesticides, usage_rates, notes, status: status || 'Growing' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update sowing record
router.put('/sowing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { plot, crop_type, seed_type, sowing_date, expected_harvest_date, seed_qty, variety, fertiliser, pesticides, usage_rates, notes, status } = req.body;
    await db.query(
      `UPDATE sowing_records SET plot=?, crop_type=?, seed_type=?, sowing_date=?, expected_harvest_date=?, seed_qty=?, variety=?, fertiliser=?, pesticides=?, usage_rates=?, notes=?, status=? WHERE id=?`,
      [plot, crop_type, seed_type, sowing_date, expected_harvest_date, seed_qty, variety, fertiliser, pesticides, usage_rates, notes, status, id]
    );
    res.json({ message: 'Sowing record updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete sowing record
router.delete('/sowing/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM sowing_records WHERE id=?', [req.params.id]);
    res.json({ message: 'Sowing record deleted' });
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
    const { batch_id, plot, harvest_date, quantity_tonnes, grade, storage_conditions, movement_tracking, destination, status } = req.body;
    const [result] = await db.query(
      `INSERT INTO harvest_records 
       (batch_id, plot, harvest_date, quantity_tonnes, grade, storage_conditions, movement_tracking, destination, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [batch_id, plot, harvest_date, quantity_tonnes, grade, storage_conditions, movement_tracking, destination, status || 'Delivered']
    );
    res.json({ id: result.insertId, batch_id, plot, harvest_date, quantity_tonnes, grade, storage_conditions, movement_tracking, destination, status: status || 'Delivered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update harvest record
router.put('/harvest/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { batch_id, plot, harvest_date, quantity_tonnes, grade, storage_conditions, movement_tracking, destination, status } = req.body;
    await db.query(
      `UPDATE harvest_records SET batch_id=?, plot=?, harvest_date=?, quantity_tonnes=?, grade=?, storage_conditions=?, movement_tracking=?, destination=?, status=? WHERE id=?`,
      [batch_id, plot, harvest_date, quantity_tonnes, grade, storage_conditions, movement_tracking, destination, status, id]
    );
    res.json({ message: 'Harvest record updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete harvest record
router.delete('/harvest/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM harvest_records WHERE id=?', [req.params.id]);
    res.json({ message: 'Harvest record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
