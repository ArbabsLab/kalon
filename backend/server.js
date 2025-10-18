import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
if (!PORT){
    console.log("PORT number not specified")
}

app.listen(PORT, () => {
    console.log(`${PORT}`)
})