const express = require('express');
const router = express.Router();
const { getSplits, createSplit, settleParticipant, updateSplit, deleteSplit } = require('../controllers/splitsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getSplits);
router.post('/', createSplit);
router.put('/:id/settle/:participantId', settleParticipant);  // Settle one participant
router.put('/:id', updateSplit);
router.delete('/:id', deleteSplit);

module.exports = router;
