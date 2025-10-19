import User from "../models/userModels.js";

export const signup = async (req, res) => {
    const {email, password, name} = req.body;
    try{
        const user_exists = await User.findOne({email});
    if (user_exists){
        return res.status(400).json({message: "User already exists"});
    }

    const user = await User.create({name, email, password});

    res.status(201).json({user, message: "User created"});
    
    } catch (e){
        res.status(500).json({message: e.message})
    }
    
}

export const signin = async (req, res) => {
    res.send("hi")
}

export const signout = async (req, res) => {
    res.send("hi")
}

