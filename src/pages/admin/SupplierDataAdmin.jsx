import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from '../../components/SharedUI';

const BASE = 'http://localhost:3001/api/supplier';

const emptyOrder = {
  supplier: '', item: '', quantity: '', unit: 'tonnes', required_by: '', delivery_address: '', status: 'Pending'
};
const emptyStock = {
  item: '', input_category: '', current_stock: '', reorder_level: '', reorder_qty: '', procurement_schedules: '', auto_order_enabled: true
};

/* ─── Purchase Orders Tab ─── */
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyOrder);

  const loadOrders = async () => {
    setLoading(true);
    try { const r = await axios.get(`${BASE}/orders`); setOrders(r.data); }
    catch { setOrders([]); } finally { setLoading(false); }
  };
  useEffect(() => { loadOrders(); }, []);

  const openCreate = () => { setForm(emptyOrder); setEditingId(null); setShowForm(true); };
  const openEdit = (rec) => {
    setForm({ ...rec, required_by: rec.required_by?.split('T')[0] || rec.required_by || '' });
    setEditingId(rec.id); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${BASE}/orders/${editingId}`, form);
      else await axios.post(`${BASE}/orders`, form);
      setShowForm(false); setEditingId(null); setForm(emptyOrder); loadOrders();
    } catch (err) { alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this purchase order?')) return;
    try { await axios.delete(`${BASE}/orders/${id}`); loadOrders(); }
    catch { alert('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      {showForm && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid var(--primary)' }}>
          <div className="section-header">
            <h3>{editingId ? '✏️ Edit Purchase Order' : '➕ New Purchase Order'}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="three-col">
              <div className="form-group"><label>Supplier</label><input className="form-control" value={form.supplier} onChange={f('supplier')} required /></div>
              <div className="form-group"><label>Item</label><input className="form-control" value={form.item} onChange={f('item')} required /></div>
              <div className="form-group"><label>Quantity</label><input type="number" step="0.01" className="form-control" value={form.quantity} onChange={f('quantity')} required /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Unit</label>
                <select className="form-control" value={form.unit} onChange={f('unit')}>
                  <option>tonnes</option><option>kg</option><option>litres</option><option>units</option>
                </select>
              </div>
              <div className="form-group"><label>Required By</label><input type="date" className="form-control" value={form.required_by} onChange={f('required_by')} /></div>
              <div className="form-group"><label>Status</label>
                <select className="form-control" value={form.status} onChange={f('status')}>
                  <option>Pending</option><option>Confirmed</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Delivery Address</label><input className="form-control" value={form.delivery_address} onChange={f('delivery_address')} /></div>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Save Changes' : '✅ Create Order'}</button>
          </form>
        </div>
      )}
      <div className="card">
        <div className="section-header">
          <h3>📋 Purchase Orders</h3>
          {!showForm && <button className="btn btn-primary" onClick={openCreate}>+ New Order</button>}
        </div>
        <table>
          <thead><tr><th>PO #</th><th>Supplier</th><th>Item</th><th>Qty</th><th>Unit</th><th>Required By</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="8" style={{ textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && orders.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center' }}>No orders found.</td></tr>}
            {orders.map(o => (
              <tr key={o.id}>
                <td><strong>{o.po_number}</strong></td>
                <td>{o.supplier}</td>
                <td>{o.item}</td>
                <td>{o.quantity}</td>
                <td>{o.unit}</td>
                <td>{o.required_by ? new Date(o.required_by).toLocaleDateString() : '—'}</td>
                <td><Badge text={o.status} color={o.status === 'Delivered' ? 'green' : o.status === 'Pending' ? 'amber' : o.status === 'Cancelled' ? 'red' : 'blue'} /></td>
                <td>
                  <button className="btn btn-outline btn-sm" style={{ marginRight: 6 }} onClick={() => openEdit(o)}>Edit</button>
                  <button className="btn btn-amber btn-sm" onClick={() => handleDelete(o.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Stock Settings Tab ─── */
const StockTab = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyStock);

  const loadSettings = async () => {
    setLoading(true);
    try { const r = await axios.get(`${BASE}/stock`); setSettings(r.data); }
    catch { setSettings([]); } finally { setLoading(false); }
  };
  useEffect(() => { loadSettings(); }, []);

  const openCreate = () => { setForm(emptyStock); setEditingId(null); setShowForm(true); };
  const openEdit = (rec) => { setForm({ ...rec }); setEditingId(rec.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${BASE}/stock/${editingId}`, form);
      else await axios.post(`${BASE}/stock`, form);
      setShowForm(false); setEditingId(null); setForm(emptyStock); loadSettings();
    } catch (err) { alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stock setting?')) return;
    try { await axios.delete(`${BASE}/stock/${id}`); loadSettings(); }
    catch { alert('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      {showForm && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid var(--primary)' }}>
          <div className="section-header">
            <h3>{editingId ? '✏️ Edit Stock Setting' : '➕ New Stock Setting'}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="three-col">
              <div className="form-group"><label>Item Name</label><input className="form-control" value={form.item} onChange={f('item')} required /></div>
              <div className="form-group"><label>Input Category</label><input className="form-control" value={form.input_category} onChange={f('input_category')} /></div>
              <div className="form-group"><label>Current Stock</label><input type="number" step="0.01" className="form-control" value={form.current_stock} onChange={f('current_stock')} /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Reorder Level</label><input type="number" step="0.01" className="form-control" value={form.reorder_level} onChange={f('reorder_level')} /></div>
              <div className="form-group"><label>Reorder Qty</label><input type="number" step="0.01" className="form-control" value={form.reorder_qty} onChange={f('reorder_qty')} /></div>
              <div className="form-group"><label>Procurement Schedules</label><input className="form-control" value={form.procurement_schedules} onChange={f('procurement_schedules')} /></div>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!form.auto_order_enabled} onChange={e => setForm({ ...form, auto_order_enabled: e.target.checked })} />
                Enable Auto-Order
              </label>
            </div>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Save Changes' : '✅ Create Setting'}</button>
          </form>
        </div>
      )}
      <div className="card">
        <div className="section-header">
          <h3>📦 Stock Reorder Settings</h3>
          {!showForm && <button className="btn btn-primary" onClick={openCreate}>+ Add Setting</button>}
        </div>
        <table>
          <thead><tr><th>Item</th><th>Category</th><th>Current Stock</th><th>Reorder Level</th><th>Reorder Qty</th><th>Auto-Order</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && settings.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center' }}>No stock settings found.</td></tr>}
            {settings.map(s => (
              <tr key={s.id}>
                <td><strong>{s.item}</strong></td>
                <td>{s.input_category || '—'}</td>
                <td>{s.current_stock ?? '—'}</td>
                <td>{s.reorder_level ?? '—'}</td>
                <td>{s.reorder_qty ?? '—'}</td>
                <td><Badge text={s.auto_order_enabled ? 'On' : 'Off'} color={s.auto_order_enabled ? 'green' : 'amber'} /></td>
                <td>
                  <button className="btn btn-outline btn-sm" style={{ marginRight: 6 }} onClick={() => openEdit(s)}>Edit</button>
                  <button className="btn btn-amber btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const SupplierDataAdmin = () => {
  const [tab, setTab] = useState('orders');

  return (
    <div className="page-body active">
      <div className="page-header">
        <h2>🚚 Supplier Data Management</h2>
        <p>Admin view — Full CRUD over purchase orders and stock reorder settings</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['orders', 'stock'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
            {t === 'orders' ? '📋 Purchase Orders' : '📦 Stock Settings'}
          </button>
        ))}
      </div>
      {tab === 'orders' ? <OrdersTab /> : <StockTab />}
    </div>
  );
};

export default SupplierDataAdmin;
