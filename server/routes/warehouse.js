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
    const { sku, product, category, qty_tonnes, capacity, location, expiry, storage_requirements, shelf_life, packaging_details, supplier_information, status } = req.body;
    const [result] = await db.query(
      `INSERT INTO inventory_items 
       (sku, product, category, qty_tonnes, capacity, location, expiry, storage_requirements, shelf_life, packaging_details, supplier_information, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sku, product, category, qty_tonnes, capacity, location, expiry || null, storage_requirements, shelf_life, packaging_details, supplier_information, status || 'In Stock']
    );
    res.json({ id: result.insertId, sku, product, category, qty_tonnes, capacity, location, expiry, storage_requirements, shelf_life, packaging_details, supplier_information, status: status || 'In Stock' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, product, category, qty_tonnes, capacity, location, expiry, storage_requirements, shelf_life, packaging_details, supplier_information, status } = req.body;
    await db.query(
      `UPDATE inventory_items SET sku=?, product=?, category=?, qty_tonnes=?, capacity=?, location=?, expiry=?, storage_requirements=?, shelf_life=?, packaging_details=?, supplier_information=?, status=? WHERE id=?`,
      [sku, product, category, qty_tonnes, capacity, location, expiry || null, storage_requirements, shelf_life, packaging_details, supplier_information, status, id]
    );
    res.json({ message: 'Inventory item updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/inventory/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM inventory_items WHERE id=?', [req.params.id]);
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
