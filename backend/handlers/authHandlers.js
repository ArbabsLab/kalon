import { redis } from "../lib/redis.js";
import User from "../models/userModels.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const access_token = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    })

    const refresh_token = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    })

    return {access_token, refresh_token};
}

const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`${userId}`, refreshToken, "EX", 7*24*60*60)
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15*60*1000,
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000,
    })
}


export const signup = async (req, res) => {
    const {email, password, name} = req.body;
    try{
        const user_exists = await User.findOne({email});
    if (user_exists){
        return res.status(400).json({message: "User already exists"});
    }

    const user = await User.create({name, email, password});

    const {access_token, refresh_token} = generateToken(user._id);
    await storeRefreshToken(user._id, refresh_token);

    setCookies(res, access_token, refresh_token)
    res.status(201).json({user: {
        _id: user._id,
        name: user.name,
    }, message: "User created"});

    } catch (e){
        res.status(500).json({message: e.message})
    }
    
}

export const signin = async (req, res) => {
    res.send("hi")
}

export const signout = async (req, res) => {
    try{
        const refresh_token = req.cookies.refreshToken;
        if (refresh_token) {
            const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`${decoded.userId}`)
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken")
        res.status(200).json({message: "User signed out"})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}

