const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const requireAuth = require('../middleware/authMiddleware');
const { sendError, sendServerError } = require('../utils/clientError');

const VALID_CATEGORIES = ['website', 'scheme_info', 'chatbot', 'recommendations', 'bug', 'general'];

router.use(requireAuth);

// POST /api/feedback - submit feedback
router.post('/', async (req, res) => {
  try {
    const { category, message, pageContext } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return sendError(res, 400, 'Please provide a feedback message with at least 5 characters.');
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      return sendError(res, 400, `Invalid category. Allowed: ${VALID_CATEGORIES.join(', ')}`);
    }

    const feedback = await Feedback.create({
      user: req.userId,
      category: category || 'general',
      message: message.trim(),
      pageContext: typeof pageContext === 'string' ? pageContext.trim().slice(0, 500) : ''
    });

    res.status(201).json({
      success: true,
      feedback: {
        id: feedback._id,
        category: feedback.category,
        createdAt: feedback.createdAt
      }
    });
  } catch (err) {
    sendServerError(res, err, 'FEEDBACK SUBMIT ERROR:');
  }
});

module.exports = router;
