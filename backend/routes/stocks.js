import express from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  toggleStockStatus
} from '../controllers/stockController.js';

const router = express.Router();

// Validation rules
const stockValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Stock name must be between 2 and 100 characters'),
  body('symbol')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Stock symbol must be between 1 and 10 characters')
    .toUpperCase(),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  body('roiPercentage')
    .isFloat({ min: -100, max: 1000 })
    .withMessage('ROI percentage must be between -100% and 1000%')
];

// Validation handler
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Public routes (for users to view stocks)
router.get('/', authMiddleware, getAllStocks);
router.get('/:id', authMiddleware, getStockById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, stockValidation, validateRequest, createStock);
router.put('/:id', authMiddleware, adminMiddleware, stockValidation, validateRequest, updateStock);
router.delete('/:id', authMiddleware, adminMiddleware, deleteStock);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, toggleStockStatus);

export default router;
