import React, { useEffect, useRef, useState } from "react";
import { Menu, Bell, User, UserCircle, FileText, LogOut } from "lucide-react";
import SearchBar from "./searchbar";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../AuthContext";

export default function NavBar({
	toggleMenu,
	onLoginClick,
	onNotificationClick,
}) {
	const location = useLocation();
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const menuReference = useRef(null);
	const { user, logoutContext } = useAuth();

	const handleLogout = async () => {
		await logoutContext();
		alert("You have been successfully logged out.");
	};

	const userRoleId =
		user && user.roleId !== undefined && user.roleId !== null
			? Number(user.roleId)
			: null;
	const isAdmin = [3, 4].includes(userRoleId);
	const showViewOffers =
		userRoleId !== null && ![0, 1, 3, 4].includes(userRoleId);
	const showBuildDoctor = !isAdmin && userRoleId !== null;
	const showAccountOptions = !isAdmin;

	const accountMenuItems = [
		...(showAccountOptions
			? [
					{
						label: "My Profile",
						icon: <UserCircle size={18} />,
						path: "/profile",
					},
				]
			: []),
		...(showViewOffers
			? [
					{
						label: "View Offers",
						icon: <FileText size={18} />,
						path: "/offers",
					},
				]
			: []),
		...(showAccountOptions
			? [
					{
						label: "My Transactions",
						icon: <FileText size={18} />,
						path: "/transactions",
					},
				]
			: []),
		{
			label: "Log Out",
			icon: <LogOut size={18} />,
			path: "/",
			action: handleLogout,
			isDestructive: true,
		},
	];

	const mainNavLinks = [
		{ name: "Marketplace", path: "/marketplace" },
		...(showViewOffers ? [{ name: "Sell Gear", path: "/sell" }] : []),
		...(showBuildDoctor
			? [{ name: "Build Doctor", path: "/build-doctor" }]
			: []),
		{ name: "About", path: "/about" },
		{ name: "Support", path: "/contact-us" },
		{ name: "Log In / Register", isModal: true },
	];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				menuReference.current &&
				!menuReference.current.contains(event.target)
			) {
				setIsUserMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const UserMenu = () => (
		<div className="relative shrink-0" ref={menuReference}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					if (!user) {
						onLoginClick();
						return;
					}
					setIsUserMenuOpen(!isUserMenuOpen);
				}}
				className={`w-10 h-10 rounded-xl flex justify-center items-center border transition-all duration-300 ${
					isUserMenuOpen
						? "bg-fuchsia-600 border-fuchsia-400"
						: "bg-white/5 border-white/10 hover:border-fuchsia-500/50"
				}`}
			>
				<User
					className={`w-5 h-5 ${isUserMenuOpen ? "text-white" : "text-slate-400"}`}
				/>
			</button>

			<AnimatePresence>
				{isUserMenuOpen && user && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						className="absolute right-0 top-[130%] w-64 z-[100] p-1.5 bg-[#0a0a0c] rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
					>
						<div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/5 rounded-t-xl">
							<p className="text-[10px] sm:text-xs font-black text-fuchsia-500 uppercase tracking-[0.3em]">
								Current User:
							</p>
							<p className="text-white font-bold text-xs sm:text-sm truncate mt-1">
								{user.fullName}
							</p>
						</div>
						<div className="space-y-1">
							{accountMenuItems.map((item, idx) => (
								<Link
									key={idx}
									to={item.path}
									onClick={() => {
										setIsUserMenuOpen(false);
										if (item.action) item.action();
									}}
									className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest transition-all ${
										item.isDestructive
											? "text-red-400 hover:bg-red-500/10"
											: "text-slate-300 hover:bg-fuchsia-500/10 hover:text-white"
									}`}
								>
									<span
										className={
											item.isDestructive ? "text-red-400" : "text-fuchsia-500"
										}
									>
										{item.icon}
									</span>
									{item.label}
								</Link>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);

	return (
		<header className="w-full sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 text-xs sm:text-sm md:text-base lg:text-lg">
			<div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-8">
				<div className="flex items-center gap-4 shrink-0">
					<button
						onClick={toggleMenu}
						className="lg:hidden p-2 bg-white/5 rounded-lg border border-white/10 text-white"
					>
						<Menu size={24} />
					</button>
					<Link to="/" className="flex items-center gap-3 group">
						<img
							src={logo}
							alt="TechTrade"
							className="w-12 h-12 object-cover"
						/>
						<h1 className="text-white text-lg sm:text-xl font-black italic tracking-tighter uppercase">
							TechTrade <span className="text-fuchsia-500">ZA</span>
						</h1>
					</Link>
				</div>

				<nav className="hidden lg:flex items-center gap-2">
					{mainNavLinks.map((link) => {
						const isActive = location.pathname === link.path;
						const styles = `px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border ${
							isActive
								? "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/5"
								: "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
						}`;

						return link.isModal ? (
							<button key={link.name} onClick={onLoginClick} className={styles}>
								{link.name}
							</button>
						) : (
							<Link key={link.name} to={link.path} className={styles}>
								{link.name}
							</Link>
						);
					})}
				</nav>

				<div className="flex items-center gap-3 shrink-0">
					<button
						onClick={(e) => {
							e.stopPropagation();
							user ? onNotificationClick() : onLoginClick();
						}}
						className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center"
					>
						<Bell size={20} />
					</button>
					<div className="h-6 w-px bg-white/10 mx-1 hidden lg:block" />
					<UserMenu />
				</div>
			</div>

			<div className="w-full border-t border-white/5 bg-black/40 py-2">
				<div className="max-w-4xl mx-auto px-4">
					<SearchBar className="bg-transparent border-none text-fuchsia-400 uppercase tracking-widest text-[10px] sm:text-xs" />
				</div>
			</div>
		</header>
	);
}
