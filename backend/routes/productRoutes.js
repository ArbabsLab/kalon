import express from "express";
import { getProducts, getFeaturedProducts } from "../handlers/productHandlers.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", protectRoute, adminRoute, getProducts);
router.get("/featured", getFeaturedProducts);

export default router;