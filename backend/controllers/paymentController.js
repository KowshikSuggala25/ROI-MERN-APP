import { validationResult } from 'express-validator';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import path from 'path';

export const uploadPaymentProof = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { amount, method, transactionId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required' });
    }

    const payment = new Payment({
      userId: req.user._id,
      amount,
      method: req.body.method || "UPI",
      screenshot: req.file.path,
      transactionId: transactionId || ''
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment proof uploaded successfully. Please wait for admin approval.',
      payment
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({ message: 'Failed to upload payment proof' });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments({ userId: req.user._id });

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let filter = {};
    
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

export const approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { adminNotes } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    // Update payment status
    payment.status = 'approved';
    payment.adminNotes = adminNotes || '';
    payment.processedBy = req.user._id;
    payment.processedAt = new Date();
    await payment.save();

    // Add amount to user's wallet
    const user = await User.findById(payment.userId);
    user.walletBalance += payment.amount;
    await user.save();

    res.json({
      message: 'Payment approved and wallet updated',
      payment
    });
  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({ message: 'Failed to approve payment' });
  }
};

export const rejectPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { adminNotes } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    payment.status = 'rejected';
    payment.adminNotes = adminNotes || 'Payment rejected by admin';
    payment.processedBy = req.user._id;
    payment.processedAt = new Date();
    await payment.save();

    res.json({
      message: 'Payment rejected',
      payment
    });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ message: 'Failed to reject payment' });
  }
};