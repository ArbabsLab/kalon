import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
	return (
		<div className='min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-[#111111] rounded-lg shadow-2xl overflow-hidden relative z-10 border border-[#262626]'
			>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<XCircle className='text-[#f59e0b] w-16 h-16 mb-4' />
					</div>
					<h1 
						className='text-2xl sm:text-3xl font-bold text-center text-[#f59e0b] mb-2 text-balance'
						style={{ fontFamily: 'Playfair Display, serif' }}
					>
						Purchase Cancelled
					</h1>
					<p className='text-[#fafafa] text-center mb-6 leading-relaxed'>
						Your order has been cancelled. No charges have been made.
					</p>
					<div className='bg-[#0a0a0a] rounded-lg p-4 mb-6 border border-[#262626]'>
						<p className='text-sm text-[#a3a3a3] text-center leading-relaxed'>
							If you encountered any issues during the checkout process, please don&apos;t hesitate to
							contact our support team.
						</p>
					</div>
					<div className='space-y-4'>
						<Link
							to={"/"}
							className='w-full bg-[#d4af37] hover:bg-[#f59e0b] text-[#0a0a0a] font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-105 transform'
						>
							<ArrowLeft className='mr-2' size={18} />
							Return to Shop
						</Link>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;