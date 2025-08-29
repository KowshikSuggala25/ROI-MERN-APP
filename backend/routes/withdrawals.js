import express from 'express';
import { body } from 'express-validator';
import { authMiddleware, adminMiddleware, weekdayMiddleware } from '../middleware/auth.js';
import {
  requestWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
} from '../controllers/withdrawalController.js';

const router = express.Router();

// Validation rules
const withdrawalValidation = [
  body('amount')
    .isFloat({ min: 1000 })
    .withMessage('Minimum withdrawal amount is ₹1000'),
  body('accountNumber')
    .isLength({ min: 10, max: 20 })
    .withMessage('Account number must be between 10 and 20 digits'),
  body('ifscCode')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage('Invalid IFSC code format')
];

// User routes
router.post('/request', 
  authMiddleware, 
  weekdayMiddleware, 
  withdrawalValidation, 
  requestWithdrawal
);
router.get('/my-withdrawals', authMiddleware, getUserWithdrawals);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, getAllWithdrawals);
router.patch('/:withdrawalId/approve', authMiddleware, adminMiddleware, approveWithdrawal);
router.patch('/:withdrawalId/reject', authMiddleware, adminMiddleware, rejectWithdrawal);

export default router;
