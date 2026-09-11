const mongoose = require('mongoose');

const localizedString = {
  en: { type: String, required: true },
  hi: { type: String },
  te: { type: String }
};

const schemeSchema = new mongoose.Schema({
  name: localizedString,
  ministry: localizedString,
  description: localizedString,
  eligibility: {
    category: [String],
    businessType: [String],
    states: [String],
    minAge: { type: Number, default: 18 },
    maxIncome: { type: Number },
    newOrExisting: { type: String }
  },
  benefits: {
    type: { type: String },
    amount: localizedString
  },
  applyLink: { type: String },
  documentsRequired: [localizedString]
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);