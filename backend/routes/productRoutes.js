import express from "express";
import { getProducts } from "../handlers/productHandlers.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", protectRoute, adminRoute, getProducts);

export default router;