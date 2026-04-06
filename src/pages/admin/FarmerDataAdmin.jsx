import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from '../../components/SharedUI';

const BASE = 'http://localhost:3001/api/farmer';

const emptySowing = {
  plot: '', crop_type: '', seed_type: '', sowing_date: '', expected_harvest_date: '',
  seed_qty: '', variety: '', fertiliser: '', pesticides: '', usage_rates: '', notes: '', status: 'Growing'
};
const emptyHarvest = {
  batch_id: '', plot: '', harvest_date: '', quantity_tonnes: '', grade: 'Grade A (Premium)',
  storage_conditions: '', movement_tracking: '', destination: '', status: 'Delivered'
};

/* ─── Sowing Tab ─── */
const SowingTab = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptySowing);

  const loadRecords = async () => {
    setLoading(true);
    try { const r = await axios.get(`${BASE}/sowing`); setRecords(r.data); }
    catch { setRecords([]); } finally { setLoading(false); }
  };
  useEffect(() => { loadRecords(); }, []);

  const openCreate = () => { setForm(emptySowing); setEditingId(null); setShowForm(true); };
  const openEdit = (rec) => { setForm({ ...rec, sowing_date: rec.sowing_date?.split('T')[0] || rec.sowing_date, expected_harvest_date: rec.expected_harvest_date?.split('T')[0] || rec.expected_harvest_date }); setEditingId(rec.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${BASE}/sowing/${editingId}`, form);
      else await axios.post(`${BASE}/sowing`, form);
      setShowForm(false); setEditingId(null); setForm(emptySowing); loadRecords();
    } catch (err) { alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sowing record?')) return;
    try { await axios.delete(`${BASE}/sowing/${id}`); loadRecords(); }
    catch { alert('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      {showForm && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid var(--primary)' }}>
          <div className="section-header">
            <h3>{editingId ? '✏️ Edit Sowing Record' : '➕ New Sowing Record'}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="three-col">
              <div className="form-group"><label>Plot</label><input className="form-control" value={form.plot} onChange={f('plot')} required /></div>
              <div className="form-group"><label>Crop Type</label><input className="form-control" value={form.crop_type} onChange={f('crop_type')} required /></div>
              <div className="form-group"><label>Seed Type</label><input className="form-control" value={form.seed_type} onChange={f('seed_type')} /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Sowing Date</label><input type="date" className="form-control" value={form.sowing_date} onChange={f('sowing_date')} required /></div>
              <div className="form-group"><label>Expected Harvest Date</label><input type="date" className="form-control" value={form.expected_harvest_date} onChange={f('expected_harvest_date')} /></div>
              <div className="form-group"><label>Seed Qty (kg)</label><input type="number" className="form-control" value={form.seed_qty} onChange={f('seed_qty')} /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Variety</label><input className="form-control" value={form.variety} onChange={f('variety')} /></div>
              <div className="form-group"><label>Fertiliser</label><input className="form-control" value={form.fertiliser} onChange={f('fertiliser')} /></div>
              <div className="form-group"><label>Pesticides</label><input className="form-control" value={form.pesticides} onChange={f('pesticides')} /></div>
            </div>
            <div className="two-col">
              <div className="form-group"><label>Usage Rates</label><input className="form-control" value={form.usage_rates} onChange={f('usage_rates')} /></div>
              <div className="form-group"><label>Status</label>
                <select className="form-control" value={form.status} onChange={f('status')}>
                  <option>Growing</option><option>Harvested</option><option>Failed</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Notes</label><textarea className="form-control" rows="2" value={form.notes} onChange={f('notes')} /></div>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Save Changes' : '✅ Create Record'}</button>
          </form>
        </div>
      )}
      <div className="card">
        <div className="section-header">
          <h3>🌱 Sowing Records</h3>
          {!showForm && <button className="btn btn-primary" onClick={openCreate}>+ Add Record</button>}
        </div>
        <table>
          <thead><tr><th>Plot</th><th>Crop</th><th>Variety</th><th>Sowing Date</th><th>Expected Harvest</th><th>Qty (kg)</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="8" style={{ textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && records.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center' }}>No records found.</td></tr>}
            {records.map(r => (
              <tr key={r.id}>
                <td><strong>{r.plot}</strong></td>
                <td>{r.crop_type}</td>
                <td>{r.variety || '—'}</td>
                <td>{r.sowing_date ? new Date(r.sowing_date).toLocaleDateString() : '—'}</td>
                <td>{r.expected_harvest_date ? new Date(r.expected_harvest_date).toLocaleDateString() : '—'}</td>
                <td>{r.seed_qty || '—'}</td>
                <td><Badge text={r.status} color={r.status === 'Growing' ? 'green' : r.status === 'Harvested' ? 'blue' : 'red'} /></td>
                <td>
                  <button className="btn btn-outline btn-sm" style={{ marginRight: 6 }} onClick={() => openEdit(r)}>Edit</button>
                  <button className="btn btn-amber btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ─── Harvest Tab ─── */
const HarvestTab = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyHarvest);

  const loadRecords = async () => {
    setLoading(true);
    try { const r = await axios.get(`${BASE}/harvest`); setRecords(r.data); }
    catch { setRecords([]); } finally { setLoading(false); }
  };
  useEffect(() => { loadRecords(); }, []);

  const openCreate = () => { setForm(emptyHarvest); setEditingId(null); setShowForm(true); };
  const openEdit = (rec) => { setForm({ ...rec, harvest_date: rec.harvest_date?.split('T')[0] || rec.harvest_date }); setEditingId(rec.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${BASE}/harvest/${editingId}`, form);
      else await axios.post(`${BASE}/harvest`, form);
      setShowForm(false); setEditingId(null); setForm(emptyHarvest); loadRecords();
    } catch (err) { alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this harvest record?')) return;
    try { await axios.delete(`${BASE}/harvest/${id}`); loadRecords(); }
    catch { alert('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      {showForm && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid var(--primary)' }}>
          <div className="section-header">
            <h3>{editingId ? '✏️ Edit Harvest Record' : '➕ New Harvest Record'}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="three-col">
              <div className="form-group"><label>Batch ID</label><input className="form-control" value={form.batch_id} onChange={f('batch_id')} /></div>
              <div className="form-group"><label>Plot</label><input className="form-control" value={form.plot} onChange={f('plot')} required /></div>
              <div className="form-group"><label>Harvest Date</label><input type="date" className="form-control" value={form.harvest_date} onChange={f('harvest_date')} required /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Quantity (tonnes)</label><input type="number" step="0.01" className="form-control" value={form.quantity_tonnes} onChange={f('quantity_tonnes')} /></div>
              <div className="form-group"><label>Grade</label>
                <select className="form-control" value={form.grade} onChange={f('grade')}>
                  <option>Grade A (Premium)</option><option>Grade B (Standard)</option><option>Grade C (Commercial)</option>
                </select>
              </div>
              <div className="form-group"><label>Status</label>
                <select className="form-control" value={form.status} onChange={f('status')}>
                  <option>Delivered</option><option>In Transit</option><option>Archived</option>
                </select>
              </div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Storage Conditions</label><input className="form-control" value={form.storage_conditions} onChange={f('storage_conditions')} /></div>
              <div className="form-group"><label>Movement Tracking</label><input className="form-control" value={form.movement_tracking} onChange={f('movement_tracking')} /></div>
              <div className="form-group"><label>Destination</label><input className="form-control" value={form.destination} onChange={f('destination')} /></div>
            </div>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Save Changes' : '✅ Create Record'}</button>
          </form>
        </div>
      )}
      <div className="card">
        <div className="section-header">
          <h3>🌾 Harvest Records</h3>
          {!showForm && <button className="btn btn-primary" onClick={openCreate}>+ Add Record</button>}
        </div>
        <table>
          <thead><tr><th>Batch ID</th><th>Plot</th><th>Harvest Date</th><th>Qty (t)</th><th>Grade</th><th>Destination</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="8" style={{ textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && records.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center' }}>No records found.</td></tr>}
            {records.map(r => (
              <tr key={r.id}>
                <td><strong>{r.batch_id}</strong></td>
                <td>{r.plot}</td>
                <td>{r.harvest_date ? new Date(r.harvest_date).toLocaleDateString() : '—'}</td>
                <td>{r.quantity_tonnes}</td>
                <td>{r.grade}</td>
                <td>{r.destination || '—'}</td>
                <td><Badge text={r.status} color={r.status === 'Delivered' ? 'green' : r.status === 'In Transit' ? 'amber' : 'blue'} /></td>
                <td>
                  <button className="btn btn-outline btn-sm" style={{ marginRight: 6 }} onClick={() => openEdit(r)}>Edit</button>
                  <button className="btn btn-amber btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
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
const FarmerDataAdmin = () => {
  const [tab, setTab] = useState('sowing');

  return (
    <div className="page-body active">
      <div className="page-header">
        <h2>🌱 Farmer Data Management</h2>
        <p>Admin view — Full CRUD over sowing logs and harvest records</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['sowing', 'harvest'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
            {t === 'sowing' ? '🌱 Sowing Records' : '🌾 Harvest Records'}
          </button>
        ))}
      </div>
      {tab === 'sowing' ? <SowingTab /> : <HarvestTab />}
    </div>
  );
};

export default FarmerDataAdmin;
