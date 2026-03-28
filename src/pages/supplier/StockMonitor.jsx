import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from '../../components/SharedUI';

const StockMonitor = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/supplier/stock');
      setStock(res.data);
    } catch (err) {
      console.error('API Error:', err);
      // Fallback
      setStock([
        { id: 1, item: 'NPK Fertiliser', current_stock: 4.2, reorder_level: 5, reorder_qty: 15, auto_order_enabled: 1 },
        { id: 2, item: 'Wheat', current_stock: 8, reorder_level: 10, reorder_qty: 50, auto_order_enabled: 1 },
        { id: 3, item: 'Soybean Seeds', current_stock: 1.2, reorder_level: 2, reorder_qty: 5, auto_order_enabled: 1 },
        { id: 4, item: 'Packaging 10kg', current_stock: 800, reorder_level: 500, reorder_qty: 2000, auto_order_enabled: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoOrder = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      await axios.put(`http://localhost:3001/api/supplier/stock/${id}`, { auto_order_enabled: newStatus });
      fetchStock();
    } catch (err) {
      console.error('API Error updating stock setting:', err);
      // Fallback UI update
      setStock(stock.map(s => s.id === id ? { ...s, auto_order_enabled: newStatus } : s));
    }
  };

  return (
    <div className="page-body active">
      <div className="page-header">
        <h2>Stock Level Monitor</h2>
        <p>Auto-reorder thresholds and current stock vs reorder points</p>
      </div>
      <div className="card">
        <div className="section-header"><h3>🔄 Reorder Settings</h3></div>
        <table>
          <thead><tr><th>Item</th><th>Current Stock</th><th>Reorder Level</th><th>Reorder Qty</th><th>Auto-Order</th><th>Action</th></tr></thead>
          <tbody>
            {stock.map((s) => (
              <tr key={s.id}>
                <td>{s.item}</td>
                <td>{s.current_stock}{s.item.includes('Packaging') ? ' pcs' : 't'}</td>
                <td>{s.reorder_level}{s.item.includes('Packaging') ? ' pcs' : 't'}</td>
                <td>{s.reorder_qty}{s.item.includes('Packaging') ? ' pcs' : 't'}</td>
                <td>
                  <Badge 
                    text={s.auto_order_enabled ? 'Enabled' : 'Disabled'} 
                    color={s.auto_order_enabled ? 'green' : 'amber'} 
                  />
                </td>
                <td>
                  <button 
                    className={`btn ${s.auto_order_enabled ? 'btn-outline' : 'btn-amber'} btn-sm`}
                    onClick={() => toggleAutoOrder(s.id, s.auto_order_enabled)}
                  >
                    {s.auto_order_enabled ? 'Disable' : 'Enable'}
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

export default StockMonitor;
