import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute, optionalAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", optionalAuth, getCartProducts);
router.post("/", optionalAuth, addToCart);
router.delete("/", optionalAuth, removeAllFromCart);
router.put("/:id", optionalAuth, updateQuantity);

export default router;
