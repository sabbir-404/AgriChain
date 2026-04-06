import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/batches', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM processing_batches ORDER BY start_time DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/batches', async (req, res) => {
  try {
    const { batch_id, raw_material, processing_type, input_qty, output_qty, line, start_time, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO processing_batches (batch_id, raw_material, processing_type, input_qty, output_qty, line, start_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [batch_id, raw_material, processing_type, input_qty, output_qty || null, line, start_time || null, status || 'Active']
    );
    res.json({ id: result.insertId, ...req.body, status: status || 'Active' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/batches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { batch_id, raw_material, processing_type, input_qty, output_qty, line, start_time, status } = req.body;
    await db.query(
      'UPDATE processing_batches SET batch_id=?, raw_material=?, processing_type=?, input_qty=?, output_qty=?, line=?, start_time=?, status=? WHERE id=?',
      [batch_id, raw_material, processing_type, input_qty, output_qty, line, start_time, status, id]
    );
    res.json({ message: 'Batch updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/batches/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM processing_batches WHERE id=?', [req.params.id]);
    res.json({ message: 'Batch deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/qc', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM qc_reports ORDER BY inspection_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/qc', async (req, res) => {
  try {
    const { batch_id, inspector, inspection_date, moisture_pct, foreign_matter_pct, grade, notes } = req.body;
    const [result] = await db.query(
      'INSERT INTO qc_reports (batch_id, inspector, inspection_date, moisture_pct, foreign_matter_pct, grade, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [batch_id, inspector, inspection_date, moisture_pct, foreign_matter_pct, grade, notes]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/qc/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { batch_id, inspector, inspection_date, moisture_pct, foreign_matter_pct, grade, notes } = req.body;
    await db.query(
      'UPDATE qc_reports SET batch_id=?, inspector=?, inspection_date=?, moisture_pct=?, foreign_matter_pct=?, grade=?, notes=? WHERE id=?',
      [batch_id, inspector, inspection_date, moisture_pct, foreign_matter_pct, grade, notes, id]
    );
    res.json({ message: 'QC report updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/qc/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM qc_reports WHERE id=?', [req.params.id]);
    res.json({ message: 'QC report deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
