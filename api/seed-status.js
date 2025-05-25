// api/seed-status.js
import mongoose from 'mongoose';

// Initialize models inline to avoid import issues
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  conditionDescription: { type: String, required: true },
  countInStock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  modelName: { type: String, required: true },
  storage: { type: String, required: true },
  color: { type: String, required: true },
  condition: { type: String, required: true }
}, { timestamps: true });

// Get or create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Connection helper
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
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
  
  // First check environment variables
  if (!process.env.MONGO_URI) {
    return res.status(500).json({
      success: false,
      message: 'MONGO_URI environment variable is not configured',
      hint: 'Please add MONGO_URI to your Vercel environment variables'
    });
  }
  
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get counts with error handling for each query
    let productCount = 0;
    let adminUser = null;
    let productsByModel = [];
    let productsByCondition = [];
    
    try {
      productCount = await Product.countDocuments();
    } catch (e) {
      console.error('Error counting products:', e);
    }
    
    try {
      adminUser = await User.findOne({ email: 'admin@grapheneosstore.com' });
    } catch (e) {
      console.error('Error finding admin:', e);
    }
    
    // Only run aggregations if we have products
    if (productCount > 0) {
      try {
        productsByModel = await Product.aggregate([
          {
            $group: {
              _id: '$modelName',
              count: { $sum: 1 },
              avgPrice: { $avg: '$price' }
            }
          },
          { $sort: { _id: 1 } }
        ]);
      } catch (e) {
        console.error('Error aggregating by model:', e);
      }
      
      try {
        productsByCondition = await Product.aggregate([
          {
            $group: {
              _id: '$condition',
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
      } catch (e) {
        console.error('Error aggregating by condition:', e);
      }
    }
    
    res.status(200).json({
      success: true,
      database: {
        connected: true,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host
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
      environment: {
        hasMongoUri: !!process.env.MONGO_URI,
        hasSeedSecret: !!process.env.SEED_SECRET,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check status',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}