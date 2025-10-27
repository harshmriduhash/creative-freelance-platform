const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['freelancer', 'client', 'admin'],
    default: 'freelancer'
  },
  profile: {
    firstName: String,
    lastName: String,
    displayName: String,
    avatar: String,
    bio: String,
    title: String,
    location: String,
    timezone: String
  },
  portfolio: [{
    title: String,
    description: String,
    images: [String],
    url: String,
    aiAssisted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  skills: [String],
  categories: [String],
  hourlyRate: {
    type: Number,
    min: 0
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  aiUsage: {
    monthlyLimit: { type: Number, default: 10 },
    monthlyUsed: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  verified: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    identity: { type: Boolean, default: false }
  },
  balance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  oauth: {
    google: String,
    linkedin: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Reset monthly AI usage
userSchema.methods.resetAIUsageIfNeeded = function() {
  const now = new Date();
  const lastReset = new Date(this.aiUsage.lastResetDate);

  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.aiUsage.monthlyUsed = 0;
    this.aiUsage.lastResetDate = now;
  }
};

module.exports = mongoose.model('User', userSchema);
