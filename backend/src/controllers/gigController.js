const Gig = require("../models/Gig");
const Bid = require("../models/Bid");

// @desc    Get all gigs with filtering and pagination
// @route   GET /api/gigs
// @access  Public
exports.getGigs = async (req, res) => {
  try {
    const {
      category,
      budget_min,
      budget_max,
      status,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { visibility: "public" };

    if (category) query.category = category;
    if (status) query.status = status;
    if (budget_min || budget_max) {
      query["budget.min"] = {};
      if (budget_min) query["budget.min"].$gte = Number(budget_min);
      if (budget_max) query["budget.max"].$lte = Number(budget_max);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const gigs = await Gig.find(query)
      .populate("client", "profile.displayName profile.avatar rating")
      .sort({ postedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Gig.countDocuments(query);

    res.json({
      success: true,
      gigs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
exports.getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("client", "profile rating completedProjects")
      .populate({
        path: "bids",
        populate: { path: "freelancer", select: "profile rating skills" },
      });

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // Increment view count
    gig.views += 1;
    await gig.save();

    res.json({ success: true, gig });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private (Client only)
exports.createGig = async (req, res) => {
  try {
    const gigData = {
      ...req.body,
      client: req.user.id,
    };

    const gig = await Gig.create(gigData);

    res.status(201).json({ success: true, gig });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private
exports.updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // Check ownership
    if (gig.client.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to update this gig" });
    }

    gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, gig });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // Check ownership
    if (gig.client.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this gig" });
    }

    await gig.deleteOne();

    res.json({ success: true, message: "Gig deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Place bid on gig
// @route   POST /api/gigs/:id/bid
// @access  Private (Freelancer only)
exports.placeBid = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    if (gig.status !== "open") {
      return res.status(400).json({ error: "Gig is not accepting bids" });
    }

    // Check if already bid
    const existingBid = await Bid.findOne({
      gig: req.params.id,
      freelancer: req.user.id,
    });
    if (existingBid) {
      return res
        .status(400)
        .json({ error: "You have already placed a bid on this gig" });
    }

    const bid = await Bid.create({
      gig: req.params.id,
      freelancer: req.user.id,
      ...req.body,
    });

    // Add bid to gig
    gig.bids.push(bid._id);
    await gig.save();

    // Populate bid data
    await bid.populate("freelancer", "profile rating skills");

    res.status(201).json({ success: true, bid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get bids for a gig
// @route   GET /api/gigs/:id/bids
// @access  Private
exports.getGigBids = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // Only gig owner can see all bids
    if (gig.client.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to view bids" });
    }

    const bids = await Bid.find({ gig: req.params.id })
      .populate("freelancer", "profile rating skills completedProjects")
      .sort({ createdAt: -1 });

    res.json({ success: true, bids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
