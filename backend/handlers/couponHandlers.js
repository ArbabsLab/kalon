import Coupon from "../models/couponModels.js";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "No active coupon found" });
		}

		res.status(200).json(coupon);
	} catch (error) {
		console.error("Error fetching coupon:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;

		if (!code) {
			return res.status(400).json({ message: "Coupon code is required" });
		}

		const coupon = await Coupon.findOne({
			code: code.trim(),
			userId: req.user._id,
			isActive: true,
		});

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found or inactive" });
		}

		if (coupon.expirationDate && coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(410).json({ message: "Coupon has expired" });
		}

		res.status(200).json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.error("Error validating coupon:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};