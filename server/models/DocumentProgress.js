const mongoose = require('mongoose');

const documentProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  checkedDocuments: [String], // list of document names the user has marked as "have"
}, { timestamps: true });

documentProgressSchema.index({ user: 1, scheme: 1 }, { unique: true });

module.exports = mongoose.model('DocumentProgress', documentProgressSchema);