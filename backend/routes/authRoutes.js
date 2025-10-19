import express from "express";
import { signin, signout, signup, refreshToken } from "../handlers/authHandlers.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/signin", signin)

router.post("/signout", signout)

router.post("/refresh", refreshToken)

export default router