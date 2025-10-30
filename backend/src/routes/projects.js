const express = require("express");
const projectController = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All project routes require authentication
router.use(protect);

router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProject);
router.post("/", projectController.createProject);
router.put("/:id/milestone/:milestoneId", projectController.updateMilestone);
router.post("/:id/complete", projectController.completeProject);
router.post("/:id/review", projectController.submitReview);

module.exports = router;
