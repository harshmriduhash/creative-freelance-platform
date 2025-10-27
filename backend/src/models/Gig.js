const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: ['design', 'writing', 'music', 'video', 'photography', 'marketing', 'development', 'other']
  },
  subcategory: String,
  budget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true
    },
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  duration: {
    type: String,
    enum: ['less-than-week', '1-2-weeks', '2-4-weeks', '1-3-months', '3-6-months', '6-months-plus']
  },
  skills: [String],
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in-progress', 'completed', 'cancelled', 'disputed'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invited-only'],
    default: 'public'
  },
  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  }],
  selectedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  aiGenerated: {
    isAiAssisted: { type: Boolean, default: false },
    aiSuggestions: [String]
  },
  deadline: Date,
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for searching
gigSchema.index({ title: 'text', description: 'text', skills: 'text' });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ client: 1 });

module.exports = mongoose.model('Gig', gigSchema);
