import express from 'express';
import { body } from 'express-validator';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import {
  buyStock,
  sellStock,
  getUserTransactions,
  getAllTransactions,
  getUserHoldings
} from '../controllers/transactionController.js';

const router = express.Router();

// Validation rules
const buyStockValidation = [
  body('stockId')
    .notEmpty()
    .withMessage('Stock ID is required'),
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be greater than 0')
];

const sellStockValidation = [
  body('stockId')
    .notEmpty()
    .withMessage('Stock ID is required'),
  body('shares')
    .isFloat({ min: 0.001 })
    .withMessage('Shares must be greater than 0')
];

// User routes
router.post('/buy', authMiddleware, buyStockValidation, buyStock);
router.post('/sell', authMiddleware, sellStockValidation, sellStock);
router.get('/my-transactions', authMiddleware, getUserTransactions);
router.get('/my-holdings', authMiddleware, getUserHoldings);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, getAllTransactions);

export default router;
