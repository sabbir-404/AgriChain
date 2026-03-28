import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleContext } from './context/RoleContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/Layout';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import SowingLog from './pages/farmer/SowingLog';
import HarvestTracking from './pages/farmer/HarvestTracking';
import CropPredictions from './pages/farmer/CropPredictions';

// Warehouse Pages
import WarehouseDashboard from './pages/warehouse/WarehouseDashboard';
import InventoryManagement from './pages/warehouse/InventoryManagement';
import WarehouseAnalytics from './pages/warehouse/WarehouseAnalytics';

// Processing Pages
import ProcessingDashboard from './pages/processing/ProcessingDashboard';
import BatchManagement from './pages/processing/BatchManagement';
import QualityControl from './pages/processing/QualityControl';

// Supplier Pages
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import OrderManagement from './pages/supplier/OrderManagement';
import StockMonitor from './pages/supplier/StockMonitor';

// Admin Pages
import SystemOverview from './pages/admin/SystemOverview';
import PredictiveAnalytics from './pages/admin/PredictiveAnalytics';
import UserManagement from './pages/admin/UserManagement';
import SystemAlerts from './pages/admin/SystemAlerts';

function App() {
  const { currentRole, user } = useContext(RoleContext);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Redirect root to default page of current role */}
        <Route path="/" element={<Navigate to={currentRole.defaultPage} replace />} />

        {currentRole.key === 'farmer' && (
          <>
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/farmer/sowing" element={<SowingLog />} />
            <Route path="/farmer/harvest" element={<HarvestTracking />} />
            <Route path="/farmer/predictions" element={<CropPredictions />} />
          </>
        )}

        {currentRole.key === 'warehouse' && (
          <>
            <Route path="/warehouse" element={<WarehouseDashboard />} />
            <Route path="/warehouse/inventory" element={<InventoryManagement />} />
            <Route path="/warehouse/analytics" element={<WarehouseAnalytics />} />
          </>
        )}

        {currentRole.key === 'processing' && (
          <>
            <Route path="/processing" element={<ProcessingDashboard />} />
            <Route path="/processing/batches" element={<BatchManagement />} />
            <Route path="/processing/qc" element={<QualityControl />} />
          </>
        )}

        {currentRole.key === 'supplier' && (
          <>
            <Route path="/supplier" element={<SupplierDashboard />} />
            <Route path="/supplier/orders" element={<OrderManagement />} />
            <Route path="/supplier/stock" element={<StockMonitor />} />
          </>
        )}

        {currentRole.key === 'admin' && (
          <>
            <Route path="/admin" element={<SystemOverview />} />
            <Route path="/admin/analytics" element={<PredictiveAnalytics />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/alerts" element={<SystemAlerts />} />
          </>
        )}

        <Route path="*" element={<Navigate to={currentRole.defaultPage} replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
