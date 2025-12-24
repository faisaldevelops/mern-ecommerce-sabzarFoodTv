import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getOrdersData, getUserOrders, updateOrderTracking, getOrderTracking, exportOrdersCSV, getAddressSheet, getBulkAddressSheets } from "../controllers/orders.controller.js";


const router = express.Router();

router.get("/", protectRoute, adminRoute, getOrdersData);
router.get("/export/csv", protectRoute, adminRoute, exportOrdersCSV);
router.get("/bulk-address-sheets", protectRoute, adminRoute, getBulkAddressSheets);
router.get("/my-orders", protectRoute, getUserOrders);
router.get("/:orderId/tracking", protectRoute, getOrderTracking);
router.get("/:orderId/address-sheet", protectRoute, adminRoute, getAddressSheet);
router.patch("/:orderId/tracking", protectRoute, adminRoute, updateOrderTracking);

export default router;