import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Stock name is required'],
    trim: true,
    maxLength: [100, 'Stock name cannot be more than 100 characters']
  },
  symbol: {
    type: String,
    required: [true, 'Stock symbol is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxLength: [10, 'Stock symbol cannot be more than 10 characters']
  },
  price: {
    type: Number,
    required: [true, 'Stock price is required'],
    min: [0.01, 'Stock price must be greater than 0']
  },
  roiPercentage: {
    type: Number,
    required: [true, 'ROI percentage is required'],
    min: [-100, 'ROI cannot be less than -100%'],
    max: [1000, 'ROI cannot be more than 1000%']
  },
  description: {
    type: String,
    maxLength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    enum: ['technology', 'healthcare', 'finance', 'energy', 'consumer', 'other'],
    default: 'other'
  },
  active: {
    type: Boolean,
    default: true
  },
  minInvestment: {
    type: Number,
    default: 1000,
    min: [1, 'Minimum investment must be at least ₹1']
  },
  maxInvestment: {
    type: Number,
    default: 100000,
    min: [1000, 'Maximum investment must be at least ₹1000']
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for efficient queries
stockSchema.index({ symbol: 1 });
stockSchema.index({ active: 1 });
stockSchema.index({ category: 1 });

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;