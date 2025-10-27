const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  budget: {
    amount: { type: Number, required: true },
    type: { type: String, enum: ['fixed', 'hourly'], required: true },
    currency: { type: String, default: 'USD' }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'disputed', 'in-review'],
    default: 'active'
  },
  milestones: [{
    title: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true },
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'submitted', 'approved', 'rejected'],
      default: 'pending'
    },
    deliverables: [{
      filename: String,
      url: String,
      uploadedAt: Date
    }],
    completedAt: Date
  }],
  timeline: {
    startDate: Date,
    endDate: Date,
    estimatedHours: Number,
    actualHours: Number
  },
  payment: {
    escrowAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    freelancerEarnings: { type: Number, default: 0 },
    stripePaymentIntentId: String,
    stripeTransferId: String
  },
  collaboration: {
    roomId: String,
    sharedFiles: [{
      filename: String,
      url: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: Date
    }],
    aiSessions: [{
      type: String,
      prompt: String,
      response: String,
      usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: Date
    }]
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  review: {
    clientReview: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: Date
    },
    freelancerReview: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: Date
    }
  },
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

// Index for queries
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ freelancer: 1, status: 1 });
projectSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
