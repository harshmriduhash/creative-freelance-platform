const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryTime: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['days', 'weeks', 'months'], default: 'days' }
  },
  proposal: {
    type: String,
    required: true,
    maxlength: 2000
  },
  aiAssisted: {
    type: Boolean,
    default: false
  },
  attachments: [{
    filename: String,
    url: String
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  isShortlisted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for queries
bidSchema.index({ gig: 1, freelancer: 1 }, { unique: true });
bidSchema.index({ freelancer: 1, status: 1 });
bidSchema.index({ gig: 1, status: 1 });

module.exports = mongoose.model('Bid', bidSchema);
