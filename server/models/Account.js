const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['cash', 'bank', 'other'],
      default: 'bank',
    },
    specifiedType: {
      type: String,
      default: 'other',
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    specifiedCurrency: {
      type: String,
      default: 'other',
    },
    specifiedCurrency: {
      type: String,
      default: 'other',
    },
    color: {
      type: String,
      default: '#6366F1',
    },
    icon: {
      type: String,
      default: 'wallet',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
