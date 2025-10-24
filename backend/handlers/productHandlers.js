import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/productModels.js"
export const getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.json({products})
    } catch (e){
        res.status(500).json({message: e.message})
    }
    
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featured_products = await redis.get("featured_products");
        if (featured_products){
        return res.json(JSON.parse(featured_products))
        }

        featured_products = await Product.find({isFeatured: true}).lean();
        if (!featured_products){
            return res.status(400).json({message: "No featured products"});
        }
        await redis.set("featured_products", JSON.stringify(featured_products));
        res.json(featured_products);

    } catch (e){
        res.status(500).json({message: e.message})
    }
}

export const createProducts = async (req, res) => {
    try{
        const {name, description, price, image, category} = req.body;

        let cldnry = null;

        if (image){
            cldnry = await cloudinary.uploader.upload(image, {folder: "products"} );
        }

        const product = await Product.create({
            name, description, price, image: cldnry.secure_url, category
        });

        res.status(200).json(product);
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}