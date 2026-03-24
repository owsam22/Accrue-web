const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Bill name is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      trim: true,
      default: 'Bills',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    // Account to debit when paying the bill
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    // Transaction automatically created when bill is paid
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPeriod: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly', null],
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

billSchema.index({ userId: 1, dueDate: 1 });
billSchema.index({ userId: 1, isPaid: 1 });

module.exports = mongoose.model('Bill', billSchema);
