const express = require("express");
const gigController = require("../controllers/gigController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", gigController.getGigs);
router.get("/:id", gigController.getGig);
router.post(
  "/",
  protect,
  authorize("client", "admin"),
  gigController.createGig
);
router.put("/:id", protect, gigController.updateGig);
router.delete("/:id", protect, gigController.deleteGig);
router.post(
  "/:id/bid",
  protect,
  authorize("freelancer"),
  gigController.placeBid
);
router.get("/:id/bids", protect, gigController.getGigBids);

module.exports = router;
