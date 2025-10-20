import express from "express";
import { signin, signout, signup, refreshToken, getUserProfile } from "../handlers/authHandlers.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/signin", signin)

router.post("/signout", signout)

router.post("/refresh", refreshToken)

router.post("/profile", protectRoute, getUserProfile)

export default router