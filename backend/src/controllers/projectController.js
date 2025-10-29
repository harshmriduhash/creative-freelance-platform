const Project = require("../models/Project");
const Gig = require("../models/Gig");
const User = require("../models/User");

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {
      $or: [{ client: req.user.id }, { freelancer: req.user.id }],
    };

    if (status) query.status = status;

    const projects = await Project.find(query)
      .populate("client", "profile rating")
      .populate("freelancer", "profile rating")
      .populate("gig", "title category")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "profile rating email")
      .populate("freelancer", "profile rating email")
      .populate("gig");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check authorization
    if (
      project.client._id.toString() !== req.user.id &&
      project.freelancer._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this project" });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create new project from accepted bid
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const { gigId, freelancerId, bidId } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // Only gig owner can create project
    if (gig.client.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Create project
    const project = await Project.create({
      gig: gigId,
      client: req.user.id,
      freelancer: freelancerId,
      title: gig.title,
      description: gig.description,
      budget: gig.budget,
      collaboration: {
        roomId: `project_${gigId}_${Date.now()}`,
      },
    });

    // Update gig status
    gig.status = "in-progress";
    gig.selectedBid = bidId;
    gig.project = project._id;
    await gig.save();

    await project.populate("client freelancer gig");

    // Emit socket event
    const io = req.app.get("io");
    io.to(`user_${freelancerId}`).emit("project-created", project);

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update milestone status
// @route   PUT /api/projects/:id/milestone/:milestoneId
// @access  Private
exports.updateMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    Object.assign(milestone, req.body);
    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Complete project
// @route   POST /api/projects/:id/complete
// @access  Private
exports.completeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Only client can mark as complete
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    project.status = "completed";
    project.completedAt = new Date();
    await project.save();

    // Update freelancer stats
    await User.findByIdAndUpdate(project.freelancer, {
      $inc: {
        completedProjects: 1,
        totalEarnings: project.payment.freelancerEarnings,
      },
    });

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Submit review for project
// @route   POST /api/projects/:id/review
// @access  Private
exports.submitReview = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { rating, comment } = req.body;

    if (project.client.toString() === req.user.id) {
      project.review.clientReview = { rating, comment, createdAt: new Date() };

      // Update freelancer rating
      const freelancer = await User.findById(project.freelancer);
      const newTotal =
        freelancer.rating.average * freelancer.rating.count + rating;
      freelancer.rating.count += 1;
      freelancer.rating.average = newTotal / freelancer.rating.count;
      await freelancer.save();
    } else if (project.freelancer.toString() === req.user.id) {
      project.review.freelancerReview = {
        rating,
        comment,
        createdAt: new Date(),
      };

      // Update client rating
      const client = await User.findById(project.client);
      const newTotal = client.rating.average * client.rating.count + rating;
      client.rating.count += 1;
      client.rating.average = newTotal / client.rating.count;
      await client.save();
    } else {
      return res.status(403).json({ error: "Not authorized" });
    }

    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
