const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    // Transaction created when this participant settles
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },
  },
  { _id: true }
);

const splitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Split description is required'],
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    // Account to credit/debit when created/settled
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    // The transaction created when the split/debt was initiated (e.g. full payment)
    initialTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },
    type: {
      type: String,
      enum: ['split', 'lend', 'borrow'],
      default: 'split',
    },
    participants: {
      type: [participantSchema],
      default: [],
    },
    isSettled: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

splitSchema.index({ userId: 1, isSettled: 1 });

module.exports = mongoose.model('Split', splitSchema);
