import express from "express";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";
import { addCart, emptyCart, updateQuantity, getCart } from "../handlers/cartHandlers.js";
const router = express.Router();

router.post("/", protectRoute,addCart);
router.delete("/", protectRoute, emptyCart);
router.put("/:id", protectRoute, updateQuantity);
router.get("/", protectRoute, getCart);

export default router