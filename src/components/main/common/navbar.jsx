import React, { useEffect, useRef, useState } from "react";
import {
	Menu,
	ShoppingCart,
	Bell,
	User,
	UserCircle,
	File,
	LogOut,
} from "lucide-react";
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
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const dropDownRef = useRef(null);
	const { user, logoutContext } = useAuth();

	const handleLogout = async() => {
        await logoutContext();
        alert("You have been successfully logged out.");
    }

	const showSellGearViewOffers = user && user.roleId !== null && String(user.roleId) !== "0" && String(user.roleId) !== "1";

	const menuItems = [
		{
			label: "Manage Profile",
			icon: <UserCircle size={18} />,
			path: "/profile",
		},
		...(showSellGearViewOffers
			? [{ label: "View Offers", icon: <File size={18} />, path: "/offers" }]
			: []),
		{
			label: "My Transactions",
			icon: <File size={18} />,
			path: "/transactions",
		},
		{
			label: "Logout",
			icon: <LogOut size={18} />,
			path: "/",
			action: handleLogout,
			isDanger: true,
		},
	];

	const navLinks = [
		{ name: "Marketplace", path: "/marketplace" },
		...(showSellGearViewOffers 
			? [{ name: "Sell Gear", path: "/sell" }] 
			: []),
		{ name: "Build Doctor", path: "/build-doctor" },
		{ name: "About", path: "/about" },
		{ name: "Support", path: "/contact-us" },
		{ name: "Login/Register", isModal: true },
	];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
				setIsUserDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const UserMenu = () => (
		<div className="relative shrink-0" ref={dropDownRef}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					if (!user) {
						onLoginClick();
						return;
					}
					setIsUserDropdownOpen(!isUserDropdownOpen);
				}}
				className={`w-10 h-10 rounded-xl flex justify-center items-center border transition-all duration-300 ${
					isUserDropdownOpen
						? "bg-fuchsia-600 border-fuchsia-400 shadow-[0_0_20px_rgba(192,38,211,0.5)]"
						: "bg-white/5 border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10"
				}`}
			>
				<User
					className={`w-5 h-5 ${isUserDropdownOpen ? "text-white" : "text-slate-400"}`}
				/>
			</button>

			<AnimatePresence>
				{isUserDropdownOpen && user && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						className="absolute right-0 top-[130%] w-64 z-[100] p-1.5 bg-[#0a0a0c] backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
					>
						<div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/5 rounded-t-xl">
							<p className="text-xs md:text-sm font-black text-fuchsia-500 uppercase tracking-[0.3em]">
								Logged In User:
							</p>
							<p className="text-white font-bold text-xs md:text-sm truncate mt-1">
								{user.fullName}
							</p>
						</div>
						<div className="space-y-1">
							{menuItems.map((item, idx) => (
								<Link
									key={idx}
									to={item.path}
									onClick={() => {
										setIsUserDropdownOpen(false);
										if (item.action) item.action();
									}}
									className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
										item.isDanger
											? "text-red-400 hover:bg-red-500/10"
											: "text-slate-300 hover:bg-fuchsia-500/10 hover:text-white"
									}`}
								>
									<span
										className={
											item.isDanger ? "text-red-400" : "text-fuchsia-500"
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
		<header className="w-full sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
			<div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-8">
				<div className="flex items-center gap-4 shrink-0">
					<button
						onClick={toggleMenu}
						className="lg:hidden p-2 bg-white/5 rounded-lg border border-white/10 text-white hover:border-fuchsia-500 transition-colors"
					>
						<Menu size={24} />
					</button>
					<Link to="/" className="flex items-center gap-3 group">
						<div className="relative">
							<div className="absolute inset-0 bg-fuchsia-500/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-all" />
							<img
								src={logo}
								alt="TechTrade"
								className="relative w-15 h-15 object-cover group-hover:scale-110 transition-transform"
							/>
						</div>
						<h1 className="text-white text-xl font-black italic tracking-tighter uppercase sm:block">
							TechTrade{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500 ml-2">
								ZA
							</span>
						</h1>
					</Link>
				</div>

				<nav className="hidden lg:flex items-center gap-2">
					{navLinks.map((link) => {
						const isActive = location.pathname === link.path;
						const baseStyles =
							"px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border cursor-pointer";
						const activeStyles = isActive
							? "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/5 shadow-[0_0_15px_rgba(192,38,211,0.2)]"
							: "text-slate-400 border-transparent hover:text-white hover:bg-white/5";

						if (link.isModal) {
							return (
								<button
									key={link.name}
									onClick={onLoginClick}
									className={`${baseStyles} ${activeStyles}`}
								>
									{link.name}
								</button>
							);
						}

						return (
							<Link
								key={link.name}
								to={link.path}
								className={`${baseStyles} ${activeStyles}`}
							>
								{link.name}
							</Link>
						);
					})}
				</nav>

				<div className="flex items-center gap-3 shrink-0">
					<div className="relative">
						<button
							onClick={(e) => {
								e.stopPropagation();
								if (!user) {
									onLoginClick();
									return;
								} else {
									onNotificationClick();
								}
							}}
							className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-fuchsia-500/50 transition-all flex items-center justify-center"
						>
							<Bell size={20} />
						</button>
						<span className="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500 rounded-full shadow-[0_0_8px_#d946ef] border border-[#050505]" />
					</div>

					<div className="h-6 w-px bg-white/10 mx-1 hidden lg:block" />
					<UserMenu />
				</div>
			</div>

			<div className="w-full border-t border-white/5 bg-black/40 py-2">
				<div className="max-w-4xl mx-auto px-4">
					<SearchBar className="bg-transparent border-none focus:ring-0 text-fuchsia-400 placeholder:text-slate-700 font-mono text-xs md:text-sm uppercase tracking-widest" />
				</div>
			</div>
		</header>
	);
}
