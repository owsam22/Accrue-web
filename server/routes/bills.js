const express = require('express');
const router = express.Router();
const { getBills, createBill, payBill, updateBill, deleteBill } = require('../controllers/billsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getBills);
router.post('/', createBill);
router.put('/:id/pay', payBill);   // Pay a bill (creates transaction)
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);

module.exports = router;
