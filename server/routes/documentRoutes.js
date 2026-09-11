const express = require('express');
const router = express.Router();
const DocumentProgress = require('../models/DocumentProgress');
const requireAuth = require('../middleware/authMiddleware');

router.use(requireAuth);

// GET /api/documents/:schemeId - get checklist progress for a scheme
router.get('/:schemeId', async (req, res) => {
  try {
    const progress = await DocumentProgress.findOne({
      user: req.userId,
      scheme: req.params.schemeId
    });
    res.json({ checkedDocuments: progress?.checkedDocuments || [] });
  } catch (err) {
    console.error('DOCUMENTS GET ERROR:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// PUT /api/documents/:schemeId - update checklist progress (full replace of checked list)
router.put('/:schemeId', async (req, res) => {
  try {
    const { checkedDocuments } = req.body;

    const progress = await DocumentProgress.findOneAndUpdate(
      { user: req.userId, scheme: req.params.schemeId },
      { checkedDocuments: checkedDocuments || [] },
      { upsert: true, new: true }
    );

    res.json({ checkedDocuments: progress.checkedDocuments });
  } catch (err) {
    console.error('DOCUMENTS PUT ERROR:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;