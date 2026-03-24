const express = require('express');
const router = express.Router();
const { getAccounts, createAccount, updateAccount, deleteAccount } = require('../controllers/accountsController');
const { protect } = require('../middleware/auth');

router.use(protect); // All account routes require auth

router.get('/', getAccounts);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

module.exports = router;
