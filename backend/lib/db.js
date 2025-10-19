import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const URI = process.env.MONGO_URI;
        
        if (!URI){
            console.log("MONGO URI Missing")
        }
        const connection = await mongoose.connect(URI);
        console.log("MongoDB connection successful", connection.connection.host)
    }
    catch (e){
        console.log("MongoDB connection error", e);
        process.exit(1)
    }
}