import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM purchase_orders ORDER BY required_by ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { supplier, item, quantity, unit, required_by, delivery_address } = req.body;
    const po_number = `PO-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const [result] = await db.query(
      'INSERT INTO purchase_orders (po_number, supplier, item, quantity, unit, required_by, delivery_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [po_number, supplier, item, quantity, unit, required_by, delivery_address, 'Pending']
    );
    res.json({ id: result.insertId, po_number, ...req.body, status: 'Pending' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier, item, quantity, unit, required_by, delivery_address, status } = req.body;
    await db.query(
      'UPDATE purchase_orders SET supplier=?, item=?, quantity=?, unit=?, required_by=?, delivery_address=?, status=? WHERE id=?',
      [supplier, item, quantity, unit, required_by, delivery_address, status, id]
    );
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM purchase_orders WHERE id=?', [req.params.id]);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stock', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stock_settings');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { item, input_category, current_stock, reorder_level, reorder_qty, procurement_schedules, auto_order_enabled } = req.body;
    await db.query(
      'UPDATE stock_settings SET item=?, input_category=?, current_stock=?, reorder_level=?, reorder_qty=?, auto_order_enabled=?, procurement_schedules=? WHERE id=?',
      [item, input_category, current_stock, reorder_level, reorder_qty, auto_order_enabled, procurement_schedules, id]
    );
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/stock', async (req, res) => {
  try {
    const { item, input_category, current_stock, reorder_level, reorder_qty, procurement_schedules, auto_order_enabled } = req.body;
    const [result] = await db.query(
      'INSERT INTO stock_settings (item, input_category, current_stock, reorder_level, reorder_qty, procurement_schedules, auto_order_enabled) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [item, input_category, current_stock, reorder_level, reorder_qty, procurement_schedules, auto_order_enabled ?? true]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/stock/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM stock_settings WHERE id=?', [req.params.id]);
    res.json({ message: 'Stock setting deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
