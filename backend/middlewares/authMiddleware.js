import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

export const protectRoute = async (req, res, next) => {
    try {
        const access_token = req.cookies.accessToken;

        if (!access_token) {
            return res.status(400).json({message: "No access token"});

        }

        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user){
            return res.status(400).json({message: "No user foud"});

        }

        req.user = user;
        next();
    } catch (e) {
        return res.status(400).json({message: "No access token"});
    }
}

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role == "admin"){
        next()
    }
    else{
        return res.status(401).json({message: "Admin restricted"})
    }
}