import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import {
  uploadPaymentProof,
  getUserPayments,
  getAllPayments,
  approvePayment,
  rejectPayment
} from '../controllers/paymentController.js';

const router = express.Router();

// Multer configuration for payment screenshots
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payments/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed!'));
    }
  }
});

// Validation rules
const paymentValidation = [
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Amount must be greater than 0'),
  body('method')
    .isIn(['upi', 'bank_transfer', 'qr_code'])
    .withMessage('Invalid payment method')
];

// User routes
router.post('/upload-proof', 
  authMiddleware, 
  upload.single("screenshot"), 
  paymentValidation, 
  uploadPaymentProof
);
router.get('/my-payments', authMiddleware, getUserPayments);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, getAllPayments);
router.patch('/:paymentId/approve', authMiddleware, adminMiddleware, approvePayment);
router.patch('/:paymentId/reject', authMiddleware, adminMiddleware, rejectPayment);

export default router;
