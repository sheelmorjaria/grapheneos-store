import express from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Manually trigger inventory sync
// @route   POST /api/inventory/sync
// @access  Private/Admin
router.post(
  '/sync',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    try {
      // Call the inventory sync API
      const response = await axios.get(process.env.INVENTORY_API_URL);
      
      // Process the inventory data (you would call your sync function here)
      // This is just a placeholder
      
      res.json({ message: 'Inventory sync triggered successfully', data: response.data });
    } catch (error) {
      console.error('Error triggering inventory sync:', error);
      res.status(500);
      throw new Error('Failed to trigger inventory sync');
    }
  })
);

// @desc    Get current inventory status from external API
// @route   GET /api/inventory/status
// @access  Private/Admin
router.get(
  '/status',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    try {
      const response = await axios.get(process.env.INVENTORY_API_URL);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching inventory status:', error);
      res.status(500);
      throw new Error('Failed to fetch inventory status');
    }
  })
);

export default router;