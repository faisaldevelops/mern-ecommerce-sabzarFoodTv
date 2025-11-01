import expresss from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getOrdersData } from "../controllers/orders.controller.js";


const router = expresss.Router();

router.get("/", protectRoute, adminRoute, getOrdersData);

export default router;