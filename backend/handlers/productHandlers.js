import Product from "../models/productModels.js"
export const getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.json({products})
    } catch (e){
        res.status(500).json({message: e.message})
    }
    
}