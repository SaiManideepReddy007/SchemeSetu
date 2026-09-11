const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Scheme = require('../models/Scheme');
const requireAuth = require('../middleware/authMiddleware');
const { sendError, sendServerError } = require('../utils/clientError');

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({ user: req.userId })
      .sort({ startedAt: -1 })
      .populate('scheme');

    const staleIds = applications.filter((item) => !item.scheme).map((item) => item._id);
    if (staleIds.length > 0) {
      await Application.deleteMany({ _id: { $in: staleIds }, user: req.userId });
    }

    res.json(
      applications
        .filter((item) => item.scheme)
        .map((item) => ({
          id: item._id,
          schemeId: item.scheme._id,
          name: item.scheme.name,
          status: item.status,
          startedAt: item.startedAt
        }))
    );
  } catch (err) {
    sendServerError(res, err, 'APPLICATIONS GET ERROR:');
  }
});

router.post('/', async (req, res) => {
  try {
    const { schemeId } = req.body;
    if (!schemeId) {
      return sendError(res, 400, 'schemeId is required.');
    }

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return sendError(res, 404, 'Scheme not found.');
    }

    const application = await Application.findOneAndUpdate(
      { user: req.userId, scheme: schemeId },
      { $setOnInsert: { user: req.userId, scheme: schemeId, status: 'Started', startedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.status(201).json({
      id: application._id,
      schemeId: application.scheme,
      status: application.status,
      startedAt: application.startedAt
    });
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, 409, 'Application already tracked.');
    }
    sendServerError(res, err, 'APPLICATIONS POST ERROR:');
  }
});

const VALID_STATUSES = [
  'Started',
  'Applied',
  'Under Review',
  'Documents Required',
  'Documents Submitted',
  'Approved',
  'Rejected'
];

// PATCH & PUT /api/applications/:id/status - user can manually update their own application status
const handleStatusUpdate = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return sendError(res, 400, `Invalid status value. Allowed statuses: ${VALID_STATUSES.join(', ')}`);
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return sendError(res, 404, 'Application not found.');
    }

    // Strict ownership verification: authenticated user can ONLY update their own application
    if (application.user.toString() !== req.userId.toString()) {
      return sendError(res, 403, 'Unauthorized: You can only update the status of your own application.');
    }

    application.status = status;
    await application.save();

    const populated = await Application.findById(application._id).populate('scheme');

    res.json({
      id: populated._id,
      schemeId: populated.scheme?._id || populated.scheme,
      name: populated.scheme?.name || null,
      status: populated.status,
      startedAt: populated.startedAt,
      updatedAt: populated.updatedAt
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return sendError(res, 404, 'Application not found.');
    }
    sendServerError(res, err, 'APPLICATIONS STATUS UPDATE ERROR:');
  }
};

router.patch('/:id/status', handleStatusUpdate);
router.put('/:id/status', handleStatusUpdate);
router.patch('/:id', handleStatusUpdate);

module.exports = router;
