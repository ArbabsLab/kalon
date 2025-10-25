import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();

	return (
		<header className='fixed top-0 left-0 w-full bg-[#111111] bg-opacity-95 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-[#262626]'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link 
						to='/' 
						className='text-2xl font-bold text-[#d4af37] items-center space-x-2 flex transition-colors duration-300 hover:text-[#f59e0b]'
						style={{ fontFamily: 'Playfair Display, serif' }}
					>
						Kalon
					</Link>

					<nav className='flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-[#a3a3a3] hover:text-[#d4af37] transition duration-300 ease-in-out'
						>
							Home
						</Link>

						{user && (
							<Link
								to={"/cart"}
								className='relative group text-[#a3a3a3] hover:text-[#d4af37] transition duration-300 ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-[#d4af37]' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-[#d4af37] text-[#0a0a0a] rounded-full px-2 py-0.5
										text-xs group-hover:bg-[#f59e0b] transition duration-300 ease-in-out font-medium'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}

						{isAdmin && (
							<Link
								className='bg-[#d4af37] hover:bg-[#f59e0b] text-[#0a0a0a] px-3 py-1 rounded-md font-medium
								transition duration-300 ease-in-out flex items-center hover:scale-105 transform'
								to={"/secret-dashboard"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								className='bg-[#262626] hover:bg-[#333333] text-[#fafafa] py-2 px-4
								rounded-md flex items-center transition duration-300 ease-in-out border border-[#262626] hover:border-[#d4af37]'
								onClick={logout}
							>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log Out</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-[#d4af37] hover:bg-[#f59e0b] text-[#0a0a0a] py-2 px-4
									rounded-md flex items-center transition duration-300 ease-in-out font-medium hover:scale-105 transform'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-[#262626] hover:bg-[#333333] text-[#fafafa] py-2 px-4
									rounded-md flex items-center transition duration-300 ease-in-out border border-[#262626] hover:border-[#d4af37]'
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Navbar;