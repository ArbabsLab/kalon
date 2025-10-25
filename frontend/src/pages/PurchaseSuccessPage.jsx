import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				await axios.post("/payments/checkout-success", {
					sessionId,
				});
				clearCart();
			} catch (error) {
				console.log(error);
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("No session ID found in the URL");
		}
	}, [clearCart]);

	if (isProcessing) return (
		<div className='h-screen flex items-center justify-center bg-[#0a0a0a]'>
			<p className='text-[#d4af37] text-xl' style={{ fontFamily: 'Playfair Display, serif' }}>
				Processing...
			</p>
		</div>
	);

	if (error) return (
		<div className='h-screen flex items-center justify-center bg-[#0a0a0a]'>
			<p className='text-[#a3a3a3] text-xl'>Error: {error}</p>
		</div>
	);

	return (
		<div className='h-screen flex items-center justify-center px-4 bg-[#0a0a0a]'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
				colors={['#d4af37', '#f59e0b', '#fafafa', '#a3a3a3']}
			/>

			<div className='max-w-md w-full bg-[#111111] rounded-lg shadow-2xl overflow-hidden relative z-10 border border-[#262626]'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-[#d4af37] w-16 h-16 mb-4' />
					</div>
					<h1 
						className='text-2xl sm:text-3xl font-bold text-center text-[#d4af37] mb-2 text-balance'
						style={{ fontFamily: 'Playfair Display, serif' }}
					>
						Purchase Successful!
					</h1>
					<p className='text-[#fafafa] text-center mb-2 leading-relaxed'>
						Thank you for your order. {"We're"} processing it now.
					</p>
					<p className='text-[#a3a3a3] text-center text-sm mb-6 leading-relaxed'>
						Check your email for order details and updates.
					</p>

					<div className='bg-[#0a0a0a] rounded-lg p-4 mb-6 border border-[#262626]'>
						<div className='flex items-center justify-between mb-2'>
							<span className='text-sm text-[#a3a3a3]'>Order number</span>
							<span className='text-sm font-semibold text-[#d4af37]'>#12345</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='text-sm text-[#a3a3a3]'>Estimated delivery</span>
							<span className='text-sm font-semibold text-[#d4af37]'>3-5 business days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-[#d4af37] hover:bg-[#f59e0b] text-[#0a0a0a] font-bold py-3 px-4
							rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-105 transform'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						<Link
							to={"/"}
							className='w-full bg-[#262626] hover:bg-[#333333] text-[#d4af37] font-bold py-3 px-4
							rounded-lg transition-all duration-300 flex items-center justify-center border border-[#262626] hover:border-[#d4af37]'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PurchaseSuccessPage;