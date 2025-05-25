// api/seed-clear.js
import mongoose from 'mongoose';
import Product from '../backend/models/productModel.js';

// Reuse connection helper
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed. Use DELETE to clear database.' });
  }
  
  // Check authentication
  const seedSecret = req.headers['x-seed-secret'];
  if (!seedSecret || seedSecret !== process.env.SEED_SECRET) {
    return res.status(401).json({ 
      success: false,
      message: 'Unauthorized' 
    });
  }
  
  try {
    await connectToDatabase();
    
    const result = await Product.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: 'Database cleared',
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear database',
      error: error.message
    });
  }
}