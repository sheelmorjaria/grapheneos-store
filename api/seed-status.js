// api/seed-status.js
import mongoose from 'mongoose';
import Product from '../backend/models/productModel.js';
import User from '../backend/models/userModel.js';

// Reuse the connection helper
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
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get counts
    const productCount = await Product.countDocuments();
    const adminUser = await User.findOne({ email: 'admin@grapheneosstore.com' });
    
    // Get product breakdown
    const productsByModel = await Product.aggregate([
      {
        $group: {
          _id: '$modelName',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const productsByCondition = await Product.aggregate([
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      database: {
        connected: true,
        name: mongoose.connection.name
      },
      products: {
        total: productCount,
        byModel: productsByModel,
        byCondition: productsByCondition
      },
      admin: {
        exists: !!adminUser,
        email: adminUser?.email
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check status',
      error: error.message
    });
  }
}