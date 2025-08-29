import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: [true, 'Stock ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  shares: {
    type: Number,
    required: [true, 'Shares is required'],
    min: [0.001, 'Shares must be greater than 0']
  },
  pricePerShare: {
    type: Number,
    required: [true, 'Price per share is required'],
    min: [0.01, 'Price per share must be greater than 0']
  },
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: [true, 'Transaction type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'upi', 'bank_transfer'],
    default: 'wallet'
  },
  paymentScreenshot: {
    type: String, // File path for uploaded screenshot
    default: null
  },
  profit: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxLength: [200, 'Notes cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
transactionSchema.index({ userId: 1 });
transactionSchema.index({ stockId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: -1 });

// Populate user and stock data on find
transactionSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'name email'
  }).populate({
    path: 'stockId',
    select: 'name symbol price roiPercentage'
  });
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;