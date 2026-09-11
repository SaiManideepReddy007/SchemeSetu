const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  type: { type: String, default: 'new_scheme' },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'pending'
  },
  error: { type: String },
  sentAt: { type: Date }
}, { timestamps: true });

// Prevent duplicate notification emails for the same user and scheme
notificationSchema.index({ user: 1, scheme: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Notification', notificationSchema);
