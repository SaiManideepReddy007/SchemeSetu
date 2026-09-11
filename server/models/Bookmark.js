const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
}, { timestamps: true });

// Prevent the same user from bookmarking the same scheme twice
bookmarkSchema.index({ user: 1, scheme: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);