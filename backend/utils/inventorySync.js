import axios from 'axios';
import cron from 'node-cron';
import Product from '../models/productModel.js';

// Function to fetch inventory data from the external API
const fetchInventoryData = async () => {
  try {
    const response = await axios.get(process.env.INVENTORY_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    return null;
  }
};

// Function to update product inventory in database
const updateProductInventory = async (inventoryData) => {
  if (!inventoryData) return;

  try {
    for (const item of inventoryData) {
      // Find product by model name and condition
      const pixelModel = mapInventoryModelToPixelModel(item.model);
      if (!pixelModel) continue;

      // Extract condition from API response (or use a default if not provided)
      const condition = item.condition || 'A';

      // Update specific model+condition variants
      await Product.updateMany(
        { 
          modelName: pixelModel, 
          condition: condition 
        },
        { 
          $set: { countInStock: determineStockCount(item) } 
        }
      );
    }
    console.log('Inventory update completed successfully');
  } catch (error) {
    console.error('Error updating product inventory:', error);
  }
};

// Map the inventory API model names to our product model names
const mapInventoryModelToPixelModel = (inventoryModel) => {
  const modelMap = {
    // This is a simplification - you'd need to map the actual model names from the API
    'PIXEL9A': 'Pixel 9a',
    'PIXEL9PROFOLD': 'Pixel 9 Pro Fold',
    'PIXEL9PROXL': 'Pixel 9 Pro XL',
    'PIXEL9PRO': 'Pixel 9 Pro',
    'PIXEL9': 'Pixel 9',
    'PIXEL8A': 'Pixel 8a',
    'PIXEL8PRO': 'Pixel 8 Pro',
    'PIXEL8': 'Pixel 8',
    'PIXELFOLD': 'Pixel Fold',
    'PIXELTABLET': 'Pixel Tablet',
    'PIXEL7A': 'Pixel 7a',
    'PIXEL7PRO': 'Pixel 7 Pro',
    'PIXEL7': 'Pixel 7',
    'PIXEL6A': 'Pixel 6a',
    'PIXEL6PRO': 'Pixel 6 Pro',
    'PIXEL6': 'Pixel 6',
    // Add mappings for all models
  };
  
  return modelMap[inventoryModel] || null;
};

const getConditionQuantities = (item) => {
  // This is a simple example where we might split the quantities
  // if the API doesn't explicitly provide condition breakdowns
  if (!item.conditionBreakdown) {
    // Arbitrary split based on your business rules
    const total = item.quantity || 0;
    return {
      'A': Math.floor(total * 0.5),  // 50% of stock is excellent condition
      'B': Math.floor(total * 0.3),  // 30% of stock is good condition
      'C': Math.floor(total * 0.2)   // 20% of stock is fair condition
    };
  }
  
  // If the API does provide condition breakdown, use that
  return item.conditionBreakdown;
};

// Updated determine stock count function
const determineStockCount = (item, condition) => {
  if (item.availability !== 'IN_STOCK') return 0;
  
  const quantities = getConditionQuantities(item);
  return quantities[condition] || 0;
};

// Setup inventory sync process to run every hour
export const setupInventorySync = () => {
  // Run immediately once on startup
  (async () => {
    const inventoryData = await fetchInventoryData();
    await updateProductInventory(inventoryData);
  })();

  // Then schedule to run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled inventory sync...');
    const inventoryData = await fetchInventoryData();
    await updateProductInventory(inventoryData);
  });
};