import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  updateUserKyc,
  updateUserStatus
} from '../controllers/userController.js';

const router = express.Router();

// Admin only routes
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.patch('/:id/kyc', authMiddleware, adminMiddleware, updateUserKyc);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateUserStatus);

export default router;
