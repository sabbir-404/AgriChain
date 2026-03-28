import { createContext, useState } from 'react';

export const RoleContext = createContext();

export const ROLES = {
  farmer: {
    key: 'farmer',
    name: 'Farmer',
    user: 'Ahmad Farid',
    avatar: 'AF',
    pill: '🌾 Farm: Plot A1',
    nav: [
      { section: 'Main' },
      { id: 'farmer-dashboard', icon: '🏠', label: 'Dashboard', path: '/farmer' },
      { section: 'Farm Activity' },
      { id: 'farmer-sowing', icon: '🌱', label: 'Sowing Log', path: '/farmer/sowing' },
      { id: 'farmer-harvest', icon: '🌾', label: 'Harvest Tracking', path: '/farmer/harvest' },
      { id: 'farmer-predictions', icon: '📈', label: 'Crop Predictions', path: '/farmer/predictions' },
    ],
    defaultPage: '/farmer'
  },
  warehouse: {
    key: 'warehouse',
    name: 'Warehouse Manager',
    user: 'Nurul Ain',
    avatar: 'NA',
    pill: '🏭 Warehouse: KL Central',
    nav: [
      { section: 'Main' },
      { id: 'warehouse-dashboard', icon: '🏠', label: 'Dashboard', path: '/warehouse' },
      { section: 'Operations' },
      { id: 'warehouse-inventory', icon: '📦', label: 'Inventory', path: '/warehouse/inventory' },
      { id: 'warehouse-analytics', icon: '📊', label: 'Analytics', path: '/warehouse/analytics' },
    ],
    defaultPage: '/warehouse'
  },
  processing: {
    key: 'processing',
    name: 'Processing Unit',
    user: 'Razlan Ibrahim',
    avatar: 'RI',
    pill: '⚙️ Unit: Selangor Plant',
    nav: [
      { section: 'Main' },
      { id: 'processing-dashboard', icon: '🏠', label: 'Dashboard', path: '/processing' },
      { section: 'Operations' },
      { id: 'processing-batches', icon: '🗂️', label: 'Batch Management', path: '/processing/batches' },
      { id: 'processing-qc', icon: '🔬', label: 'Quality Control', path: '/processing/qc' },
    ],
    defaultPage: '/processing'
  },
  supplier: {
    key: 'supplier',
    name: 'Supplier Portal',
    user: 'Siti Mariam',
    avatar: 'SM',
    pill: '🚚 Supplier Access',
    nav: [
      { section: 'Main' },
      { id: 'supplier-dashboard', icon: '🏠', label: 'Dashboard', path: '/supplier' },
      { section: 'Procurement' },
      { id: 'supplier-orders', icon: '📋', label: 'Purchase Orders', path: '/supplier/orders' },
      { id: 'supplier-stock', icon: '📉', label: 'Stock Monitor', path: '/supplier/stock' },
    ],
    defaultPage: '/supplier'
  },
  admin: {
    key: 'admin',
    name: 'Admin / Analytics',
    user: 'Dr. Amirul',
    avatar: 'DA',
    pill: '🔧 Admin: All Regions',
    nav: [
      { section: 'Main' },
      { id: 'admin-dashboard', icon: '🏠', label: 'System Overview', path: '/admin' },
      { section: 'Analytics' },
      { id: 'admin-analytics', icon: '📊', label: 'Predictive Analytics', path: '/admin/analytics' },
      { id: 'admin-alerts', icon: '🔔', label: 'Alerts & Rules', path: '/admin/alerts' },
      { section: 'Administration' },
      { id: 'admin-users', icon: '👥', label: 'User Management', path: '/admin/users' },
    ],
    defaultPage: '/admin'
  }
};

export const RoleProvider = ({ children }) => {
  const [currentRoleKey, setCurrentRoleKey] = useState(null);
  
  const currentRole = currentRoleKey ? ROLES[currentRoleKey] : null;

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRoleKey, ROLES }}>
      {children}
    </RoleContext.Provider>
  );
};
