const Bill = require('../models/Bill');
const Transaction = require('../models/Transaction');
const { applyBalanceDelta } = require('./transactionsController');

// GET /api/bills
const getBills = async (req, res) => {
  const { isPaid } = req.query;
  const filter = { userId: req.userId };
  if (isPaid !== undefined) filter.isPaid = isPaid === 'true';

  const bills = await Bill.find(filter)
    .sort({ dueDate: 1 })
    .populate('accountId', 'name color')
    .populate('transactionId', 'amount date');

  res.json(bills);
};

// POST /api/bills
const createBill = async (req, res) => {
  const { name, amount, category, dueDate, accountId, isRecurring, recurringPeriod, notes } = req.body;

  const bill = await Bill.create({
    userId: req.userId,
    name,
    amount,
    category: category || 'Bills',
    dueDate,
    accountId: accountId || null,
    isRecurring: isRecurring || false,
    recurringPeriod: recurringPeriod || null,
    notes: notes || '',
  });

  res.status(201).json(bill);
};

// PUT /api/bills/:id/pay  — mark a bill as paid, create expense transaction
const payBill = async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, userId: req.userId });
  if (!bill) return res.status(404).json({ message: 'Bill not found.' });
  if (bill.isPaid) return res.status(400).json({ message: 'Bill is already paid.' });

  // accountId can come from the bill itself or from request body override
  const accountId = req.body.accountId || bill.accountId;
  if (!accountId) return res.status(400).json({ message: 'An account must be specified to pay the bill.' });

  // Create the expense transaction
  const transaction = await Transaction.create({
    userId: req.userId,
    accountId,
    type: 'expense',
    amount: bill.amount,
    category: bill.category || 'Bills',
    note: `Bill payment: ${bill.name}`,
    date: new Date(),
    reference: 'bill_payment',
    referenceId: bill._id,
  });

  // Deduct from account
  await applyBalanceDelta(accountId, req.userId, -bill.amount);

  // Mark bill paid
  bill.isPaid = true;
  bill.paidAt = new Date();
  bill.transactionId = transaction._id;
  if (accountId) bill.accountId = accountId;
  await bill.save();

  res.json({ bill, transaction });
};

// PUT /api/bills/:id
const updateBill = async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, userId: req.userId });
  if (!bill) return res.status(404).json({ message: 'Bill not found.' });
  if (bill.isPaid) return res.status(400).json({ message: 'Cannot edit a paid bill.' });

  const { name, amount, category, dueDate, accountId, isRecurring, recurringPeriod, notes } = req.body;
  if (name !== undefined) bill.name = name;
  if (amount !== undefined) bill.amount = amount;
  if (category !== undefined) bill.category = category;
  if (dueDate !== undefined) bill.dueDate = dueDate;
  if (accountId !== undefined) bill.accountId = accountId;
  if (isRecurring !== undefined) bill.isRecurring = isRecurring;
  if (recurringPeriod !== undefined) bill.recurringPeriod = recurringPeriod;
  if (notes !== undefined) bill.notes = notes;

  await bill.save();
  res.json(bill);
};

// DELETE /api/bills/:id
const deleteBill = async (req, res) => {
  const bill = await Bill.findOne({ _id: req.params.id, userId: req.userId });
  if (!bill) return res.status(404).json({ message: 'Bill not found.' });

  await bill.deleteOne();
  res.json({ message: 'Bill deleted.' });
};

module.exports = { getBills, createBill, payBill, updateBill, deleteBill };
