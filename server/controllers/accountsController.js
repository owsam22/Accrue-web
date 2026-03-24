const Account = require('../models/Account');

// GET /api/accounts
const getAccounts = async (req, res) => {
  const accounts = await Account.find({ userId: req.userId, isArchived: false }).sort({ createdAt: 1 });
  res.json(accounts);
};

// POST /api/accounts
const createAccount = async (req, res) => {
  const { name, type, balance, currency, color, icon } = req.body;

  const account = await Account.create({
    userId: req.userId,
    name,
    type: type || 'bank',
    balance: balance || 0,
    currency: currency || 'INR',
    color: color || '#6366F1',
    icon: icon || 'wallet',
  });

  res.status(201).json(account);
};

// PUT /api/accounts/:id
const updateAccount = async (req, res) => {
  const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
  if (!account) return res.status(404).json({ message: 'Account not found.' });

  const { name, type, currency, color, icon } = req.body;
  if (name !== undefined) account.name = name;
  if (type !== undefined) account.type = type;
  if (currency !== undefined) account.currency = currency;
  if (color !== undefined) account.color = color;
  if (icon !== undefined) account.icon = icon;
  // Note: balance is NOT directly editable — it is managed by transactions

  await account.save();
  res.json(account);
};

// DELETE /api/accounts/:id
const deleteAccount = async (req, res) => {
  const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
  if (!account) return res.status(404).json({ message: 'Account not found.' });

  // Soft-delete: archive instead of dropping
  account.isArchived = true;
  await account.save();
  res.json({ message: 'Account archived successfully.' });
};

module.exports = { getAccounts, createAccount, updateAccount, deleteAccount };
