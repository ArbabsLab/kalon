import Product from "../models/productModels.js";

export const addCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (!user || !user.cartItems) {
			return res.status(400).json({ message: "User cart not found" });
		}

		const inCart = user.cartItems.find((prod) => prod.id === productId);

		if (inCart) {
			inCart.quantity += 1;
		} else {
			user.cartItems.push({ id: productId, quantity: 1 });
		}

		await user.save();
		res.status(200).json(user.cartItems);
	} catch (e) {
		console.error("Error adding to cart:", e);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getCart = async (req, res) => {
	try {
		const user = req.user;

		if (!user || !user.cartItems) {
			return res.status(400).json({ message: "User cart not found" });
		}

		const productIds = user.cartItems.map((item) => item.id);
		const products = await Product.find({ _id: { $in: productIds } });

		const cart = products.map((prod) => {
			const item = user.cartItems.find((i) => i.id === prod.id.toString());
			return { ...prod.toJSON(), quantity: item?.quantity || 1 };
		});

		res.status(200).json(cart);
	} catch (e) {
		console.error("Error getting cart:", e);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const emptyCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!user || !user.cartItems) {
			return res.status(400).json({ message: "User cart not found" });
		}

		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((prod) => prod.id !== productId);
		}

		await user.save();
		res.status(200).json(user.cartItems);
	} catch (e) {
		console.error("Error emptying cart:", e);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const user = req.user;
		const { id } = req.params;
		const { quantity } = req.body;

		if (!user || !user.cartItems) {
			return res.status(400).json({ message: "User cart not found" });
		}

		if (!id || quantity == null) {
			return res.status(400).json({ message: "Product ID and quantity are required" });
		}

		const inCart = user.cartItems.find((prod) => prod.id === id);

		if (inCart) {
			if (quantity <= 0) {
				user.cartItems = user.cartItems.filter((prod) => prod.id !== id);
			} else {
				inCart.quantity = quantity;
			}
			await user.save();
			res.status(200).json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found in cart" });
		}
	} catch (e) {
		console.error("Error updating quantity:", e);
		res.status(500).json({ message: "Internal server error" });
	}
};
