// backend/standalone-seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from './models/userModel.js';
import Product from './models/productModel.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Comprehensive product data based on real Pixel phones
const PIXEL_PRODUCTS = [
  // Pixel 9 Series
  { model: 'Pixel 9 Pro XL', storage: '128GB', colors: ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'], basePrice: 1099 },
  { model: 'Pixel 9 Pro XL', storage: '256GB', colors: ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'], basePrice: 1199 },
  { model: 'Pixel 9 Pro XL', storage: '512GB', colors: ['Obsidian', 'Porcelain', 'Hazel'], basePrice: 1319 },
  { model: 'Pixel 9 Pro XL', storage: '1TB', colors: ['Obsidian'], basePrice: 1549 },
  
  { model: 'Pixel 9 Pro', storage: '128GB', colors: ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'], basePrice: 999 },
  { model: 'Pixel 9 Pro', storage: '256GB', colors: ['Obsidian', 'Porcelain', 'Hazel', 'Rose Quartz'], basePrice: 1099 },
  { model: 'Pixel 9 Pro', storage: '512GB', colors: ['Obsidian', 'Porcelain', 'Hazel'], basePrice: 1219 },
  { model: 'Pixel 9 Pro', storage: '1TB', colors: ['Obsidian'], basePrice: 1449 },
  
  { model: 'Pixel 9', storage: '128GB', colors: ['Obsidian', 'Porcelain', 'Wintergreen', 'Peony'], basePrice: 799 },
  { model: 'Pixel 9', storage: '256GB', colors: ['Obsidian', 'Porcelain', 'Wintergreen', 'Peony'], basePrice: 899 },
  
  { model: 'Pixel 9 Pro Fold', storage: '256GB', colors: ['Obsidian', 'Porcelain'], basePrice: 1799 },
  { model: 'Pixel 9 Pro Fold', storage: '512GB', colors: ['Obsidian', 'Porcelain'], basePrice: 1919 },
  
  // Pixel 8 Series
  { model: 'Pixel 8 Pro', storage: '128GB', colors: ['Obsidian', 'Porcelain', 'Bay'], basePrice: 999 },
  { model: 'Pixel 8 Pro', storage: '256GB', colors: ['Obsidian', 'Porcelain', 'Bay'], basePrice: 1059 },
  { model: 'Pixel 8 Pro', storage: '512GB', colors: ['Obsidian', 'Porcelain', 'Bay'], basePrice: 1179 },
  { model: 'Pixel 8 Pro', storage: '1TB', colors: ['Obsidian'], basePrice: 1399 },
  
  { model: 'Pixel 8', storage: '128GB', colors: ['Obsidian', 'Hazel', 'Rose'], basePrice: 699 },
  { model: 'Pixel 8', storage: '256GB', colors: ['Obsidian', 'Hazel', 'Rose'], basePrice: 759 },
  
  { model: 'Pixel 8a', storage: '128GB', colors: ['Obsidian', 'Porcelain', 'Bay', 'Aloe'], basePrice: 499 },
  { model: 'Pixel 8a', storage: '256GB', colors: ['Obsidian', 'Porcelain', 'Bay', 'Aloe'], basePrice: 559 },
  
  // Pixel 7 Series
  { model: 'Pixel 7 Pro', storage: '128GB', colors: ['Obsidian', 'Snow', 'Hazel'], basePrice: 899 },
  { model: 'Pixel 7 Pro', storage: '256GB', colors: ['Obsidian', 'Snow', 'Hazel'], basePrice: 999 },
  { model: 'Pixel 7 Pro', storage: '512GB', colors: ['Obsidian', 'Snow'], basePrice: 1099 },
  
  { model: 'Pixel 7', storage: '128GB', colors: ['Obsidian', 'Snow', 'Lemongrass'], basePrice: 599 },
  { model: 'Pixel 7', storage: '256GB', colors: ['Obsidian', 'Snow', 'Lemongrass'], basePrice: 699 },
  
  { model: 'Pixel 7a', storage: '128GB', colors: ['Charcoal', 'Snow', 'Sea', 'Coral'], basePrice: 449 },
  
  // Pixel 6 Series
  { model: 'Pixel 6 Pro', storage: '128GB', colors: ['Stormy Black', 'Cloudy White', 'Sorta Sunny'], basePrice: 899 },
  { model: 'Pixel 6 Pro', storage: '256GB', colors: ['Stormy Black', 'Cloudy White', 'Sorta Sunny'], basePrice: 999 },
  { model: 'Pixel 6 Pro', storage: '512GB', colors: ['Stormy Black', 'Cloudy White'], basePrice: 1099 },
  
  { model: 'Pixel 6', storage: '128GB', colors: ['Stormy Black', 'Sorta Seafoam', 'Kinda Coral'], basePrice: 599 },
  { model: 'Pixel 6', storage: '256GB', colors: ['Stormy Black', 'Sorta Seafoam', 'Kinda Coral'], basePrice: 699 },
  
  { model: 'Pixel 6a', storage: '128GB', colors: ['Chalk', 'Charcoal', 'Sage'], basePrice: 449 },
  
  // Special Models
  { model: 'Pixel Fold', storage: '256GB', colors: ['Obsidian', 'Porcelain'], basePrice: 1799 },
  { model: 'Pixel Fold', storage: '512GB', colors: ['Obsidian'], basePrice: 1919 },
  
  { model: 'Pixel Tablet', storage: '128GB', colors: ['Porcelain', 'Hazel'], basePrice: 499 },
  { model: 'Pixel Tablet', storage: '256GB', colors: ['Porcelain', 'Hazel'], basePrice: 599 }
];

// Create admin user
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@grapheneosstore.com' });
    if (adminExists) return adminExists;
    
    const admin = await User.create({
      name: 'GrapheneOS Store Admin',
      email: 'admin@grapheneosstore.com',
      password: 'securepassword123',
      isAdmin: true
    });
    
    console.log('Admin user created'.green.inverse);
    return admin;
  } catch (error) {
    console.error(`Error creating admin: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Generate products with all combinations
const generateProducts = (adminUserId) => {
  const products = [];
  const conditions = ['A', 'B', 'C'];
  const conditionLabels = { 'A': 'Excellent', 'B': 'Good', 'C': 'Fair' };
  const conditionMultipliers = { 'A': 1.0, 'B': 0.85, 'C': 0.70 };
  
  // Define condition descriptions
  const conditionDescriptions = {
    'A': 'Excellent condition - Like new with minimal signs of use. Perfect working condition with exceptional battery health (95%+).',
    'B': 'Good condition - Light scratches or minor wear. Fully functional with great battery life (85-94% battery health).',
    'C': 'Fair condition - Visible scratches and signs of use. 100% functional with decent battery life (75-84% battery health).'
  };
  
  for (const pixelProduct of PIXEL_PRODUCTS) {
    for (const color of pixelProduct.colors) {
      for (const condition of conditions) {
        // Skip Fair condition for premium models (Pro, Fold)
        if (condition === 'C' && (pixelProduct.model.includes('Pro') || pixelProduct.model.includes('Fold'))) {
          continue;
        }
        
        const conditionLabel = conditionLabels[condition];
        const price = Math.round(pixelProduct.basePrice * conditionMultipliers[condition]);
        
        // Generate random but realistic stock numbers
        const stockVariation = {
          'A': () => Math.floor(Math.random() * 8) + 3, // 3-10
          'B': () => Math.floor(Math.random() * 6) + 2, // 2-7
          'C': () => Math.floor(Math.random() * 4) + 1  // 1-4
        };
        
        const product = {
          user: adminUserId,
          name: `GrapheneOS ${pixelProduct.model} ${pixelProduct.storage} ${color} - ${conditionLabel}`,
          image: `/images/${pixelProduct.model.toLowerCase().replace(/\s+/g, '-')}-${color.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          brand: 'Google Pixel',
          category: pixelProduct.model.includes('Tablet') ? 'Tablet' : 'Smartphone',
          description: generateDescription(pixelProduct.model, pixelProduct.storage, color, condition),
          conditionDescription: conditionDescriptions[condition], // ADD THIS LINE
          countInStock: stockVariation[condition](),
          price: price,
          rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)), // 4.2-4.9 rating
          numReviews: Math.floor(Math.random() * 25) + 5, // 5-29 reviews
          modelName: pixelProduct.model,
          storage: pixelProduct.storage,
          color: color,
          condition: condition
        };
        
        products.push(product);
      }
    }
  }
  
  return products;
};

// Generate realistic product descriptions
const generateDescription = (model, storage, color, condition) => {
  const conditionDescriptions = {
    'A': 'Excellent condition - Like new with minimal signs of use. Perfect working condition with exceptional battery health (95%+).',
    'B': 'Good condition - Light scratches or minor wear. Fully functional with great battery life (85-94% battery health).',
    'C': 'Fair condition - Visible scratches and signs of use. 100% functional with decent battery life (75-84% battery health).'
  };
  
  const features = {
    'Pixel 9': 'Google Tensor G4 chip, 12GB RAM, 48MP main camera with 2x ultrawide',
    'Pixel 9 Pro': 'Google Tensor G4 chip, 16GB RAM, 50MP main + 48MP ultrawide + 48MP telephoto cameras',
    'Pixel 9 Pro XL': 'Google Tensor G4 chip, 16GB RAM, 50MP main + 48MP ultrawide + 48MP telephoto cameras, 6.8" display',
    'Pixel 9 Pro Fold': 'Google Tensor G4 chip, 16GB RAM, foldable 8" inner display, triple camera system',
    'Pixel 8': 'Google Tensor G3 chip, 8GB RAM, 50MP main camera with Magic Eraser',
    'Pixel 8 Pro': 'Google Tensor G3 chip, 12GB RAM, 50MP main + 48MP ultrawide + 48MP telephoto cameras',
    'Pixel 8a': 'Google Tensor G3 chip, 8GB RAM, 64MP main camera, excellent value',
    'Pixel 7': 'Google Tensor G2 chip, 8GB RAM, 50MP main camera',
    'Pixel 7 Pro': 'Google Tensor G2 chip, 12GB RAM, 50MP main + 12MP ultrawide + 48MP telephoto cameras',
    'Pixel 7a': 'Google Tensor G2 chip, 8GB RAM, 64MP main camera, wireless charging',
    'Pixel 6': 'Google Tensor chip, 8GB RAM, 50MP main camera',
    'Pixel 6 Pro': 'Google Tensor chip, 12GB RAM, 50MP main + 12MP ultrawide + 48MP telephoto cameras',
    'Pixel 6a': 'Google Tensor chip, 6GB RAM, 12.2MP main camera, great value',
    'Pixel Fold': 'Google Tensor G2 chip, 12GB RAM, foldable design, multiple cameras',
    'Pixel Tablet': 'Google Tensor G2 chip, 8GB RAM, 11" display, charging speaker dock included'
  };
  
  const modelFeatures = features[model] || 'Latest Google Pixel technology';
  
  return `GrapheneOS flashed ${model} in ${color} with ${storage} storage. ${conditionDescriptions[condition]}

This device comes with GrapheneOS pre-installed, offering unparalleled privacy and security. GrapheneOS is a privacy and security-focused mobile OS with Android app compatibility developed as an open source project.

Device Features:
- ${modelFeatures}
- ${storage} internal storage
- Beautiful ${color} finish
- ${condition === 'A' ? 'Like-new' : condition === 'B' ? 'Excellent' : 'Good'} physical condition

GrapheneOS Features:
- Enhanced privacy protection beyond standard Android
- Hardened security with regular updates
- No Google services pre-installed
- Full Android app compatibility through sandboxed Google Play
- Advanced permission controls
- Network permission toggle
- Enhanced verified boot
- Regular security updates

This phone has been thoroughly tested and comes with a 30-day warranty. All original accessories may not be included, but a compatible charger is provided.

Perfect for privacy-conscious users who want the latest Android features without compromising their personal data.`;
};

// Main import function
const importProducts = async () => {
  try {
    console.log('Starting comprehensive product import...'.cyan);
    
    const admin = await createAdminUser();
    console.log('Admin user ready.'.cyan);
    
    // Generate all product combinations
    console.log('Generating product catalog...'.cyan);
    const products = generateProducts(admin._id);
    console.log(`Generated ${products.length} product variants`.green);
    
    // Clear existing products
    console.log('Clearing existing products...'.cyan);
    await Product.deleteMany({});
    
    // Insert products in batches
    console.log('Inserting products...'.cyan);
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(products.length/BATCH_SIZE)}: ${batch.length} products`.cyan);
    }
    
    console.log(`Successfully imported ${products.length} products!`.green.inverse);
    
    // Summary
    const modelCounts = {};
    products.forEach(p => {
      modelCounts[p.modelName] = (modelCounts[p.modelName] || 0) + 1;
    });
    
    console.log('\nProduct summary by model:'.cyan);
    Object.entries(modelCounts).forEach(([model, count]) => {
      console.log(`- ${model}: ${count} variants`.white);
    });
    
    console.log('\nData import complete!'.green.inverse);
    process.exit();
    
  } catch (error) {
    console.error(`Import failed: ${error.message}`.red.inverse);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the import
importProducts();