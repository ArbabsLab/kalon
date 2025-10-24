import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/productModels.js";

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json({ products });
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ message: "Server error while fetching products." });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");

		if (featuredProducts) {
			return res.status(200).json(JSON.parse(featuredProducts));
		}

		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts || featuredProducts.length === 0) {
			return res.status(404).json({ message: "No featured products found." });
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));
		res.status(200).json(featuredProducts);
	} catch (error) {
		console.error("Error fetching featured products:", error);
		res.status(500).json({ message: "Server error while fetching featured products." });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		if (!name || !description || !price || !category) {
			return res.status(400).json({ message: "Missing required fields." });
		}

		let cldnry = null;
		if (image) {
			cldnry = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cldnry ? cldnry.secure_url : null,
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.error("Error creating product:", error);
		res.status(500).json({ message: "Server error while creating product." });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}

		if (product.image) {
			const imgId = product.image.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(`products/${imgId}`);
		}

		await Product.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Product deleted successfully." });
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ message: "Server error while deleting product." });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{ $sample: { size: 3 } },
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.status(200).json(products);
	} catch (error) {
		console.error("Error fetching recommended products:", error);
		res.status(500).json({ message: "Server error while fetching recommendations." });
	}
};

export const getProductsCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });

		if (!products || products.length === 0) {
			return res.status(404).json({ message: "No products found for this category." });
		}

		res.status(200).json({ products });
	} catch (error) {
		console.error("Error fetching category products:", error);
		res.status(500).json({ message: "Server error while fetching products by category." });
	}
};

export const featuredToggle = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}

		product.isFeatured = !product.isFeatured;
		await product.save();
		await updateCache();

		res.status(200).json(product);
	} catch (error) {
		console.error("Error toggling featured status:", error);
		res.status(500).json({ message: "Server error while toggling featured status." });
	}
};

export const updateCache = async () => {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.error("Error updating Redis cache:", error);
	}
};
