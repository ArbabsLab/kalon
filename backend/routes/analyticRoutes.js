import express from "express";
import { protectRoute, adminRoute } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute,)

export default router;