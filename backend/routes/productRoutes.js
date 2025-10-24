import express from "express";
import { getProducts, getFeaturedProducts } from "../handlers/productHandlers.js";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", protectRoute, adminRoute, getProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.get("/recommended", protectRoute, getRecommendedProducts);
router.get("/category/:category", protectRoute, getProductsCategory)
export default router;