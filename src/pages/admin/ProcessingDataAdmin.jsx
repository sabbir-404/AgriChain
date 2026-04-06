import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from '../../components/SharedUI';

const BASE = 'http://localhost:3001/api/processing';

const emptyBatch = {
  batch_id: '', raw_material: '', processing_type: '', input_qty: '', output_qty: '', line: '', start_time: '', status: 'Active'
};
const emptyQC = {
  batch_id: '', inspector: '', inspection_date: new Date().toISOString().split('T')[0],
  moisture_pct: '', foreign_matter_pct: '', grade: 'Grade A — Premium', notes: ''
};

/* ─── Batches Tab ─── */
const BatchesTab = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyBatch);

  const loadRecords = async () => {
    setLoading(true);
    try { const r = await axios.get(`${BASE}/batches`); setRecords(r.data); }
    catch { setRecords([]); } finally { setLoading(false); }
  };
  useEffect(() => { loadRecords(); }, []);

  const openCreate = () => { setForm(emptyBatch); setEditingId(null); setShowForm(true); };
  const openEdit = (rec) => {
    setForm({ ...rec, start_time: rec.start_time ? new Date(rec.start_time).toISOString().slice(0, 16) : '' });
    setEditingId(rec.id); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${BASE}/batches/${editingId}`, form);
      else await axios.post(`${BASE}/batches`, form);
      setShowForm(false); setEditingId(null); setForm(emptyBatch); loadRecords();
    } catch (err) { alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this batch?')) return;
    try { await axios.delete(`${BASE}/batches/${id}`); loadRecords(); }
    catch { alert('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      {showForm && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid var(--primary)' }}>
          <div className="section-header">
            <h3>{editingId ? '✏️ Edit Batch' : '➕ New Batch'}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="three-col">
              <div className="form-group"><label>Batch ID</label><input className="form-control" value={form.batch_id} onChange={f('batch_id')} required /></div>
              <div className="form-group"><label>Raw Material</label><input className="form-control" value={form.raw_material} onChange={f('raw_material')} /></div>
              <div className="form-group"><label>Processing Type</label><input className="form-control" value={form.processing_type} onChange={f('processing_type')} /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Input Qty (t)</label><input type="number" step="0.01" className="form-control" value={form.input_qty} onChange={f('input_qty')} /></div>
              <div className="form-group"><label>Output Qty (t)</label><input type="number" step="0.01" className="form-control" value={form.output_qty} onChange={f('output_qty')} /></div>
              <div className="form-group"><label>Processing Line</label><input className="form-control" value={form.line} onChange={f('line')} /></div>
            </div>
            <div className="two-col">
              <div className="form-group"><label>Start Time</label><input type="datetime-local" className="form-control" value={form.start_time} onChange={f('start_time')} /></div>
              <div className="form-group"><label>Status</label>
                <select className="form-control" value={form.status} onChange={f('status')}>
                  <option>Active</option><option>Completed</option><option>On Hold</option><option>Cancelled</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Save Changes' : '✅ Create Batch'}</button>
          </form>
        </div>
      )}
      <div className="card">
        <div className="section-header">
          <h3>📋 Processing Batches</h3>
          {!showForm && <button className="btn btn-primary" onClick={openCreate}>+ New Batch</button>}
        </div>
        <table>
          <thead><tr><th>Batch ID</th><th>Raw Material</th><th>Type</th><th>Input (t)</th><th>Output (t)</th><th>Line</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="8" style={{ textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && records.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center' }}>No batches found.</td></tr>}
            {records.map(r => (
              <tr key={r.id}>
                <td><strong>{r.batch_id}</strong></td>
                <td>{r.raw_material}</td>
                <td>{r.processing_type}</td>
                <td>{r.input_qty ?? '—'}</td>
                <td>{r.output_qty ?? '—'}</td>
                <td>{r.line || '—'}</td>
                <td><Badge text={r.status} color={r.status === 'Active' ? 'green' : r.status === 'Completed' ? 'blue' : r.status === 'On Hold' ? 'amber' : 'red'} /></td>
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

/* ─── QC Tab ─── */
const QCTab = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyQC);

  const loadReports = async () => {
    setLoading(true);
    try { const r = await axios.get(`${BASE}/qc`); setReports(r.data); }
    catch { setReports([]); } finally { setLoading(false); }
  };
  useEffect(() => { loadReports(); }, []);

  const openCreate = () => { setForm(emptyQC); setEditingId(null); setShowForm(true); };
  const openEdit = (rec) => {
    setForm({ ...rec, inspection_date: rec.inspection_date?.split('T')[0] || rec.inspection_date });
    setEditingId(rec.id); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${BASE}/qc/${editingId}`, form);
      else await axios.post(`${BASE}/qc`, form);
      setShowForm(false); setEditingId(null); setForm(emptyQC); loadReports();
    } catch (err) { alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this QC report?')) return;
    try { await axios.delete(`${BASE}/qc/${id}`); loadReports(); }
    catch { alert('Delete failed'); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      {showForm && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid var(--primary)' }}>
          <div className="section-header">
            <h3>{editingId ? '✏️ Edit QC Report' : '➕ New QC Report'}</h3>
            <button className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="three-col">
              <div className="form-group"><label>Batch ID</label><input className="form-control" value={form.batch_id} onChange={f('batch_id')} required /></div>
              <div className="form-group"><label>Inspector</label><input className="form-control" value={form.inspector} onChange={f('inspector')} /></div>
              <div className="form-group"><label>Inspection Date</label><input type="date" className="form-control" value={form.inspection_date} onChange={f('inspection_date')} /></div>
            </div>
            <div className="three-col">
              <div className="form-group"><label>Moisture Content (%)</label><input type="number" step="0.1" className="form-control" value={form.moisture_pct} onChange={f('moisture_pct')} /></div>
              <div className="form-group"><label>Foreign Matter (%)</label><input type="number" step="0.1" className="form-control" value={form.foreign_matter_pct} onChange={f('foreign_matter_pct')} /></div>
              <div className="form-group"><label>Grade</label>
                <select className="form-control" value={form.grade} onChange={f('grade')}>
                  <option>Grade A — Premium</option><option>Grade B — Standard</option><option>Reject</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Notes</label><textarea className="form-control" rows="2" value={form.notes} onChange={f('notes')} /></div>
            <button type="submit" className="btn btn-primary">{editingId ? '💾 Save Changes' : '✅ Submit Report'}</button>
          </form>
        </div>
      )}
      <div className="card">
        <div className="section-header">
          <h3>🔬 QC Reports</h3>
          {!showForm && <button className="btn btn-primary" onClick={openCreate}>+ New Report</button>}
        </div>
        <table>
          <thead><tr><th>Batch ID</th><th>Inspector</th><th>Date</th><th>Moisture %</th><th>Foreign Matter %</th><th>Grade</th><th>Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading…</td></tr>}
            {!loading && reports.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center' }}>No reports found.</td></tr>}
            {reports.map(r => (
              <tr key={r.id}>
                <td><strong>{r.batch_id}</strong></td>
                <td>{r.inspector}</td>
                <td>{r.inspection_date ? new Date(r.inspection_date).toLocaleDateString() : '—'}</td>
                <td>{r.moisture_pct ?? '—'}%</td>
                <td>{r.foreign_matter_pct ?? '—'}%</td>
                <td><Badge text={r.grade} color={r.grade?.includes('A') ? 'green' : r.grade?.includes('B') ? 'amber' : 'red'} /></td>
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
const ProcessingDataAdmin = () => {
  const [tab, setTab] = useState('batches');

  return (
    <div className="page-body active">
      <div className="page-header">
        <h2>⚙️ Processing Data Management</h2>
        <p>Admin view — Full CRUD over processing batches and QC reports</p>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['batches', 'qc'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
            {t === 'batches' ? '📋 Batches' : '🔬 QC Reports'}
          </button>
        ))}
      </div>
      {tab === 'batches' ? <BatchesTab /> : <QCTab />}
    </div>
  );
};

export default ProcessingDataAdmin;
