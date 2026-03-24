const Split = require('../models/Split');
const Transaction = require('../models/Transaction');
const { applyBalanceDelta } = require('./transactionsController');

// GET /api/splits
const getSplits = async (req, res) => {
  const { isSettled } = req.query;
  const filter = { userId: req.userId };
  if (isSettled !== undefined) filter.isSettled = isSettled === 'true';

  const splits = await Split.find(filter)
    .sort({ createdAt: -1 })
    .populate('accountId', 'name color');

  res.json(splits);
};

// POST /api/splits
const createSplit = async (req, res) => {
  const { description, totalAmount, currency, accountId, participants, notes } = req.body;

  const split = await Split.create({
    userId: req.userId,
    description,
    totalAmount,
    currency: currency || 'INR',
    accountId: accountId || null,
    participants: participants || [],
    notes: notes || '',
  });

  res.status(201).json(split);
};

// PUT /api/splits/:id/settle/:participantId
// Mark a participant's share as settled, create an income transaction
const settleParticipant = async (req, res) => {
  const split = await Split.findOne({ _id: req.params.id, userId: req.userId });
  if (!split) return res.status(404).json({ message: 'Split not found.' });

  const participant = split.participants.id(req.params.participantId);
  if (!participant) return res.status(404).json({ message: 'Participant not found.' });
  if (participant.isPaid) return res.status(400).json({ message: 'Participant already settled.' });

  const accountId = req.body.accountId || split.accountId;

  let transaction = null;
  if (accountId) {
    // Create income transaction — the participant paid us back
    transaction = await Transaction.create({
      userId: req.userId,
      accountId,
      type: 'income',
      amount: participant.amount,
      category: 'Split Settlement',
      note: `${participant.name} settled share — ${split.description}`,
      date: new Date(),
      reference: 'split_settlement',
      referenceId: split._id,
    });

    await applyBalanceDelta(accountId, req.userId, participant.amount);
  }

  // Mark participant paid
  participant.isPaid = true;
  participant.paidAt = new Date();
  if (transaction) participant.transactionId = transaction._id;

  // Check if all participants are settled
  split.isSettled = split.participants.every((p) => p.isPaid);
  await split.save();

  res.json({ split, transaction });
};

// PUT /api/splits/:id
const updateSplit = async (req, res) => {
  const split = await Split.findOne({ _id: req.params.id, userId: req.userId });
  if (!split) return res.status(404).json({ message: 'Split not found.' });

  const { description, notes, accountId } = req.body;
  if (description !== undefined) split.description = description;
  if (notes !== undefined) split.notes = notes;
  if (accountId !== undefined) split.accountId = accountId;

  await split.save();
  res.json(split);
};

// DELETE /api/splits/:id
const deleteSplit = async (req, res) => {
  const split = await Split.findOne({ _id: req.params.id, userId: req.userId });
  if (!split) return res.status(404).json({ message: 'Split not found.' });

  await split.deleteOne();
  res.json({ message: 'Split deleted.' });
};

module.exports = { getSplits, createSplit, settleParticipant, updateSplit, deleteSplit };
