const mongoose = require('mongoose');

const viewHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  viewedAt: { type: Date, default: Date.now }
});

// One entry per user+scheme; we'll update viewedAt on repeat views instead of duplicating
viewHistorySchema.index({ user: 1, scheme: 1 }, { unique: true });

module.exports = mongoose.model('ViewHistory', viewHistorySchema);