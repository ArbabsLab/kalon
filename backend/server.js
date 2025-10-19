import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
if (!PORT){
    console.log("PORT number not specified")
}
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes)
app.listen(PORT, () => {
    console.log(`${PORT}`)
    connectDB();
})