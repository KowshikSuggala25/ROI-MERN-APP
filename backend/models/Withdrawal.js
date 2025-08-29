import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1000, 'Minimum withdrawal amount is ₹1000']
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true,
    minLength: [10, 'Account number must be at least 10 digits']
  },
  ifscCode: {
    type: String,
    required: [true, 'IFSC code is required'],
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format']
  },
  bankName: {
    type: String,
    trim: true
  },
  accountHolderName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    maxLength: [200, 'Admin notes cannot be more than 200 characters']
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
withdrawalSchema.index({ userId: 1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ createdAt: -1 });

// Populate user data
withdrawalSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'name email walletBalance'
  }).populate({
    path: 'processedBy',
    select: 'name email'
  });
  next();
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;