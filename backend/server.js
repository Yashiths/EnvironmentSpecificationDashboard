import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import authRoutes from './routes/authRoutes.js';
import specificationRoutes from './routes/specificationRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import { seedAdminUser, seedSpecifications, seedSuperAdminUser } from './seed.js';

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(backendDirectory, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/env_spec_db';
const allowedOrigins = new Set([
  'http://localhost:3001',
  'http://localhost:5173',
  ...[process.env.CORS_ORIGINS, process.env.FRONTEND_URL]
    .filter(Boolean)
    .flatMap((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  ...[process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter(Boolean)
    .map((url) => url.startsWith('http') ? url : `https://${url}`)
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('CORS origin is not allowed.'));
  }
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/specifications', specificationRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  const message = status === 400 ? 'Invalid JSON request body.' : 'Internal server error.';
  return res.status(status).json({ message });
});

const startServer = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');
    await seedAdminUser();
    await seedSuperAdminUser();
    await seedSpecifications();
  } catch (error) {
    console.warn(`Warning: MongoDB connection unavailable. The API will start without database access. ${error.message}`);
  }

  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
};

startServer();

if (typeof module !== 'undefined') module.exports = app;
export default app;
export { app, startServer };
