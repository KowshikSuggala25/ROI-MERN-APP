import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';
import Stock from '../models/Stock.js';
import User from '../models/User.js';

export const buyStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { stockId, amount } = req.body;
    const userId = req.user._id;

    // Check if stock exists and is active
    const stock = await Stock.findById(stockId);
    if (!stock || !stock.active) {
      return res.status(400).json({ message: 'Stock not available for trading' });
    }

    // Check if user has sufficient balance
    const user = await User.findById(userId);
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Calculate shares
    const shares = amount / stock.price;

    // Create transaction
    const transaction = new Transaction({
      userId,
      stockId,
      amount,
      shares,
      pricePerShare: stock.price,
      type: 'buy',
      status: 'completed'
    });

    await transaction.save();

    // Update user wallet balance
    user.walletBalance -= amount;
    await user.save();

    res.status(201).json({
      message: 'Stock purchased successfully',
      transaction
    });
  } catch (error) {
    console.error('Buy stock error:', error);
    res.status(500).json({ message: 'Failed to purchase stock' });
  }
};

export const sellStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { stockId, shares } = req.body;
    const userId = req.user._id;

    // Check if stock exists
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(400).json({ message: 'Stock not found' });
    }

    // Check user's holdings
    const userTransactions = await Transaction.find({
      userId,
      stockId,
      status: 'completed'
    });

    const totalShares = userTransactions.reduce((total, t) => {
      return t.type === 'buy' ? total + t.shares : total - t.shares;
    }, 0);

    if (totalShares < shares) {
      return res.status(400).json({ message: 'Insufficient shares to sell' });
    }

    // Calculate current value with ROI
    const currentPrice = stock.price * (1 + stock.roiPercentage / 100);
    const sellAmount = shares * currentPrice;

    // Create sell transaction
    const transaction = new Transaction({
      userId,
      stockId,
      amount: sellAmount,
      shares,
      pricePerShare: currentPrice,
      type: 'sell',
      status: 'completed'
    });

    await transaction.save();

    // Update user wallet balance
    const user = await User.findById(userId);
    user.walletBalance += sellAmount;
    await user.save();

    res.status(201).json({
      message: 'Stock sold successfully',
      transaction
    });
  } catch (error) {
    console.error('Sell stock error:', error);
    res.status(500).json({ message: 'Failed to sell stock' });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    let filter = { userId: req.user._id };
    
    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    let filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

export const getUserHoldings = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
      status: 'completed'
    });

    // Group by stock and calculate holdings
    const holdings = {};
    
    for (const transaction of transactions) {
      const stockId = transaction.stockId._id.toString();
      if (!holdings[stockId]) {
        holdings[stockId] = {
          stock: transaction.stockId,
          totalShares: 0,
          totalInvested: 0,
          transactions: []
        };
      }

      if (transaction.type === 'buy') {
        holdings[stockId].totalShares += transaction.shares;
        holdings[stockId].totalInvested += transaction.amount;
      } else {
        holdings[stockId].totalShares -= transaction.shares;
        holdings[stockId].totalInvested -= transaction.amount;
      }
      
      holdings[stockId].transactions.push(transaction);
    }

    // Filter out zero holdings and calculate current values
    const activeHoldings = Object.values(holdings).filter(h => h.totalShares > 0);
    
    for (const holding of activeHoldings) {
      const stock = holding.stock;
      const currentPrice = stock.price * (1 + stock.roiPercentage / 100);
      holding.currentValue = holding.totalShares * currentPrice;
      holding.profit = holding.currentValue - holding.totalInvested;
      holding.profitPercentage = (holding.profit / holding.totalInvested) * 100;
    }

    res.json({ holdings: activeHoldings });
  } catch (error) {
    console.error('Get holdings error:', error);
    res.status(500).json({ message: 'Failed to fetch holdings' });
  }
};