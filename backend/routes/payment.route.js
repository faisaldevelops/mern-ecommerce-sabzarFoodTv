// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

// const router = express.Router();

// router.post("/create-checkout-session", protectRoute, createCheckoutSession);
// router.post("/checkout-success", protectRoute, checkoutSuccess);

// export default router;


// routes/payment.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
} from "../controllers/payments.razorpay.controller.js";

const router = express.Router();

// Protected endpoints (client calls these)
router.post("/razorpay-create-order", protectRoute, createRazorpayOrder);
router.post("/razorpay-verify", protectRoute, verifyRazorpayPayment);

// Webhook endpoint (Razorpay -> public)
router.post("/razorpay-webhook", razorpayWebhook);

export default router;
