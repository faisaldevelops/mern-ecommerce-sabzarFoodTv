import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAddresses, addAddress, deleteAddress, updateAddress } from "../controllers/address.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAddresses);
router.post("/", protectRoute, addAddress);
router.delete("/:addressId", protectRoute, deleteAddress);
router.put("/:addressId", protectRoute, updateAddress);

export default router;