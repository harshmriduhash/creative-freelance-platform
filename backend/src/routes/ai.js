const express = require("express");
const aiController = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All AI routes require authentication
router.use(protect);

router.post("/generate-gig-ideas", aiController.generateGigIdeas);
router.post("/generate-proposal", aiController.generateProposal);
router.post("/generate-content", aiController.generateContent);
router.post("/analyze-requirements", aiController.analyzeRequirements);
router.get("/usage", aiController.getUsageStats);

module.exports = router;
