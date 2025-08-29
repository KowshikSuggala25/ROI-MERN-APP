import { validationResult } from 'express-validator';
import Withdrawal from '../models/Withdrawal.js';
import User from '../models/User.js';

export const requestWithdrawal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { amount, accountNumber, ifscCode, bankName, accountHolderName } = req.body;
    const userId = req.user._id;

    // Check if user has sufficient balance
    const user = await User.findById(userId);
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const withdrawal = new Withdrawal({
      userId,
      amount,
      accountNumber,
      ifscCode,
      bankName,
      accountHolderName
    });

    await withdrawal.save();

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      withdrawal
    });
  } catch (error) {
    console.error('Request withdrawal error:', error);
    res.status(500).json({ message: 'Failed to submit withdrawal request' });
  }
};

export const getUserWithdrawals = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Withdrawal.countDocuments({ userId: req.user._id });

    res.json({
      withdrawals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user withdrawals error:', error);
    res.status(500).json({ message: 'Failed to fetch withdrawals' });
  }
};

export const getAllWithdrawals = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let filter = {};
    
    if (status) filter.status = status;

    const withdrawals = await Withdrawal.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Withdrawal.countDocuments(filter);

    res.json({
      withdrawals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all withdrawals error:', error);
    res.status(500).json({ message: 'Failed to fetch withdrawals' });
  }
};

export const approveWithdrawal = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { adminNotes } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    // Check if user still has sufficient balance
    const user = await User.findById(withdrawal.userId);
    if (user.walletBalance < withdrawal.amount) {
      return res.status(400).json({ message: 'User has insufficient balance' });
    }

    // Update withdrawal status
    withdrawal.status = 'approved';
    withdrawal.adminNotes = adminNotes || '';
    withdrawal.processedBy = req.user._id;
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    // Deduct amount from user's wallet
    user.walletBalance -= withdrawal.amount;
    await user.save();

    res.json({
      message: 'Withdrawal approved and amount deducted from wallet',
      withdrawal
    });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ message: 'Failed to approve withdrawal' });
  }
};

export const rejectWithdrawal = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { adminNotes } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    withdrawal.status = 'rejected';
    withdrawal.adminNotes = adminNotes || 'Withdrawal rejected by admin';
    withdrawal.processedBy = req.user._id;
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    res.json({
      message: 'Withdrawal rejected',
      withdrawal
    });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ message: 'Failed to reject withdrawal' });
  }
};