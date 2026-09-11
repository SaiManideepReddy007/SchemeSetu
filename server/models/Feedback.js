const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    required: true,
    enum: ['website', 'scheme_info', 'chatbot', 'recommendations', 'bug', 'general'],
    default: 'general'
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 3000
  },
  pageContext: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
