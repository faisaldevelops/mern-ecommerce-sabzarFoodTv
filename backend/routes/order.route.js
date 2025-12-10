import expresss from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getOrdersData, getUserOrders, updateOrderTracking, getOrderTracking, exportOrdersCSV } from "../controllers/orders.controller.js";


const router = expresss.Router();

router.get("/", protectRoute, adminRoute, getOrdersData);
router.get("/export/csv", protectRoute, adminRoute, exportOrdersCSV);
router.get("/my-orders", protectRoute, getUserOrders);
router.get("/:orderId/tracking", protectRoute, getOrderTracking);
router.patch("/:orderId/tracking", protectRoute, adminRoute, updateOrderTracking);

export default router;