// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

// const router = express.Router();

// router.post("/create-checkout-session", protectRoute, createCheckoutSession);
// router.post("/checkout-success", protectRoute, checkoutSuccess);

// export default router;


// routes/payment.route.js
import express from "express";
import { optionalAuth } from "../middleware/auth.middleware.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
} from "../controllers/payments.razorpay.controller.js";

const router = express.Router();

// Allow both authenticated and guest users (optionalAuth instead of protectRoute)
router.post("/razorpay-create-order", optionalAuth, createRazorpayOrder);
router.post("/razorpay-verify", optionalAuth, verifyRazorpayPayment);

// Webhook endpoint (Razorpay -> public)
router.post("/razorpay-webhook", razorpayWebhook);

export default router;
