import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { getCoupon, validateCoupon } from "../handlers/couponHandlers.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.get("/validate", protectRoute, validateCoupon);

export default router
