import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge } from '../../components/SharedUI';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('API Error:', err);
      // Fallback
      setUsers([
        { id: 1, name: 'Ahmad Farid', role: 'Farmer', region: 'Kedah', last_login: '2025-03-28T09:15:00', status: 'Active' },
        { id: 2, name: 'Nurul Ain', role: 'Warehouse Mgr', region: 'KL Central', last_login: '2025-03-28T10:02:00', status: 'Active' },
        { id: 3, name: 'Razlan Ibrahim', role: 'Processing Unit', region: 'Selangor', last_login: '2025-03-27T14:20:00', status: 'Active' },
        { id: 4, name: 'Siti Mariam', role: 'Supplier Portal', region: 'Perak', last_login: '2025-03-26T11:00:00', status: 'Inactive' },
        { id: 5, name: 'Dr. Amirul', role: 'Admin', region: 'All Regions', last_login: '2025-03-28T08:00:00', status: 'Active' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body active">
      <div className="page-header">
        <h2>User Management</h2>
        <p>Manage system users, roles and permissions</p>
      </div>
      <div className="card">
        <div className="section-header">
          <h3>👥 System Users</h3> 
          <button className="btn btn-primary">+ Add User</button>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Role</th><th>Region</th><th>Last Login</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.role}</td>
                <td>{u.region}</td>
                <td>{new Date(u.last_login).toLocaleDateString()}</td>
                <td><Badge text={u.status} color={u.status === 'Active' ? 'green' : 'amber'} /></td>
                <td><button className="btn btn-outline btn-sm">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
