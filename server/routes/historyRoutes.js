const express = require('express');
const router = express.Router();
const ViewHistory = require('../models/ViewHistory');
const requireAuth = require('../middleware/authMiddleware');

router.use(requireAuth);

// GET /api/history - get recently viewed schemes, most recent first
router.get('/', async (req, res) => {
  try {
    const history = await ViewHistory.find({ user: req.userId })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate('scheme');

    res.json(history.filter((h) => h.scheme).map((h) => h.scheme));
  } catch (err) {
    console.error('HISTORY GET ERROR:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// POST /api/history - record a view (upsert: update timestamp if already viewed)
router.post('/', async (req, res) => {
  try {
    const { schemeId } = req.body;
    if (!schemeId) {
      return res.status(400).json({ error: 'schemeId is required.' });
    }

    await ViewHistory.findOneAndUpdate(
      { user: req.userId, scheme: schemeId },
      { viewedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('HISTORY POST ERROR:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// DELETE /api/history/:schemeId - remove a single scheme from history
router.delete('/:schemeId', async (req, res) => {
  try {
    const { schemeId } = req.params;
    await ViewHistory.deleteMany({ user: req.userId, scheme: schemeId });
    res.json({ success: true, removed: schemeId });
  } catch (err) {
    console.error('HISTORY DELETE ONE ERROR:', err.message);
    res.status(500).json({ error: 'Failed to remove from history.' });
  }
});

// DELETE /api/history - clear all viewing history for the user
router.delete('/', async (req, res) => {
  try {
    await ViewHistory.deleteMany({ user: req.userId });
    res.json({ success: true, cleared: true });
  } catch (err) {
    console.error('HISTORY CLEAR ALL ERROR:', err.message);
    res.status(500).json({ error: 'Failed to clear history.' });
  }
});

module.exports = router;