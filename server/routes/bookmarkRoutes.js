const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const requireAuth = require('../middleware/authMiddleware');
const { sendError, sendServerError } = require('../utils/clientError');

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.userId }).populate('scheme');
    const staleBookmarkIds = bookmarks.filter((bookmark) => !bookmark.scheme).map((bookmark) => bookmark._id);

    if (staleBookmarkIds.length > 0) {
      await Bookmark.deleteMany({ _id: { $in: staleBookmarkIds }, user: req.userId });
    }

    res.json(
      bookmarks
        .filter((bookmark) => bookmark.scheme)
        .map((bookmark) => ({ bookmarkId: bookmark._id, ...bookmark.scheme.toObject() }))
    );
  } catch (err) {
    sendServerError(res, err, 'BOOKMARKS GET ERROR:');
  }
});

router.post('/', async (req, res) => {
  try {
    const { schemeId } = req.body;
    if (!schemeId) {
      return sendError(res, 400, 'schemeId is required.');
    }

    const bookmark = await Bookmark.create({ user: req.userId, scheme: schemeId });
    res.status(201).json(bookmark);
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, 409, 'Already bookmarked.');
    }
    sendServerError(res, err, 'BOOKMARKS POST ERROR:');
  }
});

router.delete('/:schemeId', async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ user: req.userId, scheme: req.params.schemeId });
    res.json({ success: true });
  } catch (err) {
    sendServerError(res, err, 'BOOKMARKS DELETE ERROR:');
  }
});

module.exports = router;