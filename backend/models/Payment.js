import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  method: {
    type: String,
    enum: ['upi', 'bank_transfer', 'qr_code'],
    required: [true, 'Payment method is required']
  },
  screenshot: {
    type: String, // File path for uploaded screenshot
    required: [true, 'Payment screenshot is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
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
  },
  transactionId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Populate user data
paymentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'name email'
  }).populate({
    path: 'processedBy',
    select: 'name email'
  });
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;