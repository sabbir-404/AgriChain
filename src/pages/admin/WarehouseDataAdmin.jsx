import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from '../../components/SharedUI';

const BASE = 'http://localhost:3001/api/warehouse';

const emptyItem = {
  sku: 'WH-', product: '', category: 'Grain', qty_tonnes: '', capacity: 100,
  location: '', expiry: '', storage_requirements: '', shelf_life: '',
  packaging_details: '', supplier_information: '', status: 'In Stock'
};

const WarehouseDataAdmin = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyItem);

  const fetchInventory = async () => {
    setLoading(true);
    try { const r = await axios.get(`${BASE}/inventory`); setInventory(r.data); }
    catch { setInventory([]); } finally { setLoading(false); }
  };
  useEffect(() => { fetchInventory(); }, []);

  const openCreate = () => { setForm(emptyItem); setEditingId(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({ ...item, expiry: item.expiry?.split('T')[0] || item.expiry || '' });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${BASE}/inventory/${editingId}`, form);
      else await axios.post(`${BASE}/inventory`, form);
      setShowForm(false); setEditingId(null); setForm(emptyItem); fetchInventory();
    } catch (err) { alert(err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inventory item?')) return;
    try { await axios.delete(`${BASE}/inventory/${id}`); fetchInventory(); }
    catch { alert('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const filtered = inventory.filter(i =>
    i.product?.toLowerCase().includes(search.toLowerCase()) ||
    i.sku?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-body active">
      <div className="page-header">
        <h2>📦 Warehouse Data Management</h2>
        <p>Admin view — Full CRUD over inventory items</p>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid var(--primary)' }}>
          <div className="section-header">
            <h3>{editingId ? '✏️ Edit Inventory Item' : '➕ Add Inventory Item'}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="three-col">
              <div className="form-group"><label>SKU</label><input className="form-control" value={form.sku} onChange={f('sku')} required /></div>
              <div className="form-group"><label>Product Name</label><input className="form-control" value={form.product} onChange={f('product')} required /></div>
              <div className="form-group"><label>Category</label><input className="form-control" value={form.category} onChange={f('category')} required /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Quantity (tonnes)</label><input type="number" step="0.01" className="form-control" value={form.qty_tonnes} onChange={f('qty_tonnes')} /></div>
              <div className="form-group"><label>Capacity (tonnes)</label><input type="number" step="0.01" className="form-control" value={form.capacity} onChange={f('capacity')} /></div>
              <div className="form-group"><label>Location</label><input className="form-control" value={form.location} onChange={f('location')} /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Expiry Date</label><input type="date" className="form-control" value={form.expiry} onChange={f('expiry')} /></div>
              <div className="form-group"><label>Shelf Life</label><input className="form-control" value={form.shelf_life} onChange={f('shelf_life')} /></div>
              <div className="form-group"><label>Status</label>
                <select className="form-control" value={form.status} onChange={f('status')}>
                  <option>In Stock</option><option>Low</option><option>Critical</option><option>Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Storage Requirements</label><input className="form-control" value={form.storage_requirements} onChange={f('storage_requirements')} /></div>
              <div className="form-group"><label>Packaging Details</label><input className="form-control" value={form.packaging_details} onChange={f('packaging_details')} /></div>
              <div className="form-group"><label>Supplier Information</label><input className="form-control" value={form.supplier_information} onChange={f('supplier_information')} /></div>
            </div>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Save Changes' : '✅ Add Item'}</button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <h3>📋 Full Inventory Register</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="form-control" placeholder="Search product, SKU, category…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} />
            {!showForm && <button className="btn btn-primary" onClick={openCreate}>+ Add Item</button>}
          </div>
        </div>
        <table>
          <thead>
            <tr><th>SKU</th><th>Product</th><th>Category</th><th>Qty (t)</th><th>Capacity</th><th>Location</th><th>Expiry</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="9" style={{ textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan="9" style={{ textAlign: 'center' }}>No items found.</td></tr>}
            {filtered.map(item => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td><strong>{item.product}</strong></td>
                <td>{item.category}</td>
                <td>{item.qty_tonnes ?? '—'}</td>
                <td>{item.capacity ?? '—'}</td>
                <td>{item.location || '—'}</td>
                <td>{item.expiry ? new Date(item.expiry).toLocaleDateString() : '—'}</td>
                <td>
                  <Badge
                    text={item.status || 'In Stock'}
                    color={item.status === 'In Stock' ? 'green' : item.status === 'Low' ? 'amber' : 'red'}
                  />
                </td>
                <td>
                  <button className="btn btn-outline btn-sm" style={{ marginRight: 6 }} onClick={() => openEdit(item)}>Edit</button>
                  <button className="btn btn-amber btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseDataAdmin;
