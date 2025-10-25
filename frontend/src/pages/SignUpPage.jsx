import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { signup, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-screen bg-[#0a0a0a]'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-4xl font-bold text-[#fafafa] text-balance' style={{ fontFamily: 'Playfair Display, serif' }}>
					Create Account
				</h2>
				<p className='mt-2 text-center text-sm text-[#a3a3a3] leading-relaxed'>
					Join our exclusive collection
				</p>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-[#111111] py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-[#262626]'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label htmlFor='name' className='block text-sm font-medium text-[#fafafa]'>
								Full name
							</label>
							<div className='mt-1 relative rounded-lg shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='h-5 w-5 text-[#a3a3a3]' aria-hidden='true' />
								</div>
								<input
									id='name'
									type='text'
									required
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-[#0a0a0a] border border-[#262626] rounded-lg shadow-sm text-[#fafafa]
									 placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm transition-all duration-300'
									placeholder='First Last'
								/>
							</div>
						</div>

						<div>
							<label htmlFor='email' className='block text-sm font-medium text-[#fafafa]'>
								Email address
							</label>
							<div className='mt-1 relative rounded-lg shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-[#a3a3a3]' aria-hidden='true' />
								</div>
								<input
									id='email'
									type='email'
									required
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-[#0a0a0a] border border-[#262626] 
									rounded-lg shadow-sm text-[#fafafa]
									 placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#d4af37] 
									 focus:border-[#d4af37] sm:text-sm transition-all duration-300'
									placeholder='you@example.com'
								/>
							</div>
						</div>

						<div>
							<label htmlFor='password' className='block text-sm font-medium text-[#fafafa]'>
								Password
							</label>
							<div className='mt-1 relative rounded-lg shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-[#a3a3a3]' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-[#0a0a0a] border border-[#262626] 
									rounded-lg shadow-sm text-[#fafafa] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm transition-all duration-300'
									placeholder='••••••••'
								/>
							</div>
						</div>

						<div>
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-[#fafafa]'>
								Confirm Password
							</label>
							<div className='mt-1 relative rounded-lg shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-[#a3a3a3]' aria-hidden='true' />
								</div>
								<input
									id='confirmPassword'
									type='password'
									required
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									className='block w-full px-3 py-2 pl-10 bg-[#0a0a0a] border
									 border-[#262626] rounded-lg shadow-sm text-[#fafafa] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm transition-all duration-300'
									placeholder='••••••••'
								/>
							</div>
						</div>

						<button
							type='submit'
							className='w-full flex justify-center py-3 px-4 border border-transparent 
							rounded-lg shadow-sm text-sm font-medium text-[#0a0a0a] bg-[#d4af37]
							 hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-[#d4af37] transition-all duration-300 ease-in-out disabled:opacity-50
							  hover:scale-105 transform'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Creating account...
								</>
							) : (
								<>
									<UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
									Sign up
								</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-[#a3a3a3] leading-relaxed'>
						Already have an account?{" "}
						<Link to='/login' className='font-medium text-[#d4af37] hover:text-[#f59e0b] transition-colors duration-300'>
							Sign in here <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};
export default SignUpPage;