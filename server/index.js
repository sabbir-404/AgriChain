import express from 'express';
import cors from 'cors';
import farmerRoutes from './routes/farmer.js';
import warehouseRoutes from './routes/warehouse.js';
import processingRoutes from './routes/processing.js';
import supplierRoutes from './routes/supplier.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/farmer', farmerRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/processing', processingRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
