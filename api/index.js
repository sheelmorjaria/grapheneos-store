// api/index.js
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from '../backend/routes/productRoutes.js';
import userRoutes from '../backend/routes/userRoutes.js';
import seedRoutes from '../backend/routes/seedRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Database connection
let cachedDb = null;
async function connectDB() {
  if (cachedDb) return cachedDb;
  
  const db = await mongoose.connect(process.env.MONGO_URI);
  cachedDb = db;
  return db;
}

// Connect on each request (serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoutes);

// Base route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'GrapheneOS Store API',
    endpoints: [
      '/api/products',
      '/api/users',
      '/api/seed/test'
    ]
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

export default app;