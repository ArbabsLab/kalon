import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/checkout-session", protectRoute, checkoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router
