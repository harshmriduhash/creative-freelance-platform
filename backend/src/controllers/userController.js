const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -oauth -subscription.stripeCustomerId -subscription.stripeSubscriptionId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update portfolio
// @route   PUT /api/users/portfolio
// @access  Private
exports.updatePortfolio = async (req, res) => {
  try {
    const { portfolio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { portfolio },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user portfolio
// @route   GET /api/users/:id/portfolio
// @access  Public
exports.getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('portfolio profile');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, portfolio: user.portfolio, profile: user.profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
