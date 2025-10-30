const express = require("express");
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.post("/confirm-payment", paymentController.confirmPayment);
router.post("/subscribe", paymentController.createSubscription);
router.post("/cancel-subscription", paymentController.cancelSubscription);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

module.exports = router;
