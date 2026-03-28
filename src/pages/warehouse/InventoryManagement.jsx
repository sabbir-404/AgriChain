import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from '../../components/SharedUI';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/warehouse/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error('API Error:', err);
      // Fallback data matching HTML mockup
      setInventory([
        { id: 1, sku: 'WH-001', product: 'Paddy Grade A', category: 'Grain', qty_tonnes: 120, location: 'Zone A, Bay 3', expiry: '2025-06-01', status: 'Good' },
        { id: 2, sku: 'WH-002', product: 'Maize Premium', category: 'Grain', qty_tonnes: 48, location: 'Zone B, Bay 1', expiry: '2025-05-01', status: 'Good' },
        { id: 3, sku: 'WH-003', product: 'Soybean Organic', category: 'Legume', qty_tonnes: 12, location: 'Zone A, Bay 5', expiry: '2025-04-01', status: 'Low' },
        { id: 4, sku: 'WH-004', product: 'Wheat (Standard)', category: 'Grain', qty_tonnes: 8, location: 'Zone B, Bay 4', expiry: '2025-07-01', status: 'Critical' },
        { id: 5, sku: 'WH-005', product: 'NPK Fertiliser', category: 'Input', qty_tonnes: 4.2, location: 'Zone C, Bay 2', expiry: '2025-12-01', status: 'Low' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body active">
      <div className="page-header">
        <h2>Inventory Management</h2>
        <p>Manage stock, record movements and update quantities</p>
      </div>
      <div className="card">
        <div className="section-header">
          <h3>📋 Full Inventory Register</h3>
          <div style={{display:'flex',gap:'10px'}}>
            <input className="form-control" placeholder="Search product..." style={{width:'200px'}}/>
            <button className="btn btn-primary">+ Add Item</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>SKU</th><th>Product</th><th>Category</th><th>Qty (t)</th><th>Location</th><th>Expiry</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, idx) => (
              <tr key={idx}>
                <td>{item.sku}</td>
                <td>{item.product}</td>
                <td>{item.category}</td>
                <td>{item.qty_tonnes}</td>
                <td>{item.location}</td>
                <td>{new Date(item.expiry).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</td>
                <td>
                  <Badge 
                    text={item.status} 
                    color={item.status === 'Good' ? 'green' : item.status === 'Low' ? 'amber' : 'red'} 
                  />
                </td>
                <td>
                  <button className={`btn ${item.status === 'Good' ? 'btn-outline' : 'btn-amber'} btn-sm`}>
                    {item.status === 'Good' ? 'Edit' : 'Reorder'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
