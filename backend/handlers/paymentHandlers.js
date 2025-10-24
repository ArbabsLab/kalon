import Coupon from "../models/couponModels.js";
import Order from "../models/orderModels.js";
import { stripe } from "../lib/stripe.js";

export const checkoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ message: "No products provided" });
		}

		let totalAmount = 0;

		const line_items = products.map((prod) => {
			if (!prod.name || !prod.price || !prod.image) {
				throw new Error("Invalid product data");
			}

			const amount_cents = Math.round(prod.price * 100);
			totalAmount += amount_cents * (prod.quantity || 1);

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: prod.name,
						images: [prod.image],
					},
					unit_amount: amount_cents,
				},
				quantity: prod.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, isActive: true });
			if (coupon) {
				totalAmount -= (totalAmount * coupon.discountPercentage) / 100;
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: line_items,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (e) {
		console.error("Error in checkoutSession:", e);
		res.status(500).json({ message: e.message || "Internal server error" });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;

		if (!sessionId) {
			return res.status(400).json({ message: "Session ID is required" });
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (!session) {
			return res.status(404).json({ message: "Checkout session not found" });
		}

		if (session.payment_status !== "paid") {
			return res.status(400).json({ message: "Payment not completed" });
		}

		if (session.metadata.couponCode) {
			await Coupon.findOneAndUpdate(
				{
					code: session.metadata.couponCode,
					userId: session.metadata.userId,
				},
				{ isActive: false }
			);
		}

		const products = JSON.parse(session.metadata.products || "[]");

		const newOrder = new Order({
			user: session.metadata.userId,
			products: products.map((product) => ({
				product: product.id,
				quantity: product.quantity,
				price: product.price,
			})),
			totalAmount: session.amount_total / 100,
			stripeSessionId: sessionId,
		});

		await newOrder.save();

		res.status(200).json({
			success: true,
			message: "Payment successful and order created",
			orderId: newOrder._id,
		});
	} catch (e) {
		console.error("Error in checkoutSuccess:", e);
		res.status(500).json({ message: e.message || "Internal server error" });
	}
};

async function createStripeCoupon(discountPercentage) {
	try {
		const coupon = await stripe.coupons.create({
			percent_off: discountPercentage,
			duration: "once",
		});
		return coupon.id;
	} catch (e) {
		console.error("Error creating Stripe coupon:", e);
		throw new Error("Failed to create Stripe coupon");
	}
}
