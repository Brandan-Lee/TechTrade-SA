import React, { useEffect } from "react";
import { X, Terminal, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MenuDrawer({ isOpen, closeMenu, onSwitchToLogin }) {
	const location = useLocation();

	// Prevent background scrolling when navigation layer dashboard overlay is active
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const menuItems = [
		{ name: "HOME", label: "Home", path: "/" },
		{ name: "ABOUT", label: "About Us", path: "/about" },
		{ name: "MARKET", label: "Main Marketplace", path: "/marketplace" },
		{ name: "Sell Your Gear", label: "Sell Your Gear", path: "/sell" },
		{ name: "Build Doctor", label: "Build Doctor", path: "/build-doctor" },
		{ name: "divider", path: null },
		{ name: "Contact Us", label: "Contact Us", path: "/contact" },
		{
			name: "Login/Register",
			label: "Log in / Register",
			path: "/login",
			isModal: true,
		},
	];

	return (
		<>
			{/* Blurry Interface Terminal Backdrop Veil Dimmer */}
			<div
				className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 
                ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				onClick={closeMenu}
				aria-hidden="true"
			/>

			{/* STRUCTURAL INTERFACE NAVIGATION DIALOG DRAW PANEL */}
			<aside
				aria-modal="true"
				role="dialog"
				aria-label="System Navigation Menu"
				className={`fixed top-0 left-0 w-80 max-w-[85vw] h-full z-[70] bg-[#09090b]/95 border-r border-white/10 shadow-[5px_0_40px_rgba(0,0,0,0.6)] backdrop-blur-md transition-transform duration-300 ease-in-out font-mono text-slate-300 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Decorative Internal Technical Detail Accent */}
				<div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-fuchsia-500/0 via-fuchsia-500/20 to-fuchsia-500/0" />

				<div className="flex flex-col h-full p-5 sm:p-6 gap-8">
					{/* DRAWER TOP BAR: CONSOLE HEAD */}
					<div className="flex justify-between items-center w-full pb-4 border-b border-white/5">
						<div className="flex items-center gap-2">
							<Terminal size={14} className="text-fuchsia-500 animate-pulse" />
							<h2 className="text-white text-xs font-black uppercase tracking-[0.25em]">
								NAVIGATION
							</h2>
						</div>
						<button
							onClick={closeMenu}
							aria-label="Close Navigation Menu"
							className="p-1.5 hover:bg-white/5 rounded-lg border border-white/0 hover:border-white/10 text-slate-400 hover:text-fuchsia-400 transition-all outline-none focus-visible:ring-1 focus-visible:ring-fuchsia-500"
						>
							<X size={16} />
						</button>
					</div>

					{/* INTERFACE ACCESS SYSTEM LINK TREE */}
					<nav className="flex flex-col gap-1.5 w-full items-start">
						{menuItems.map((item, index) => {
							if (item.name === "divider") {
								return (
									<div
										key={`div-${index}`}
										className="w-full h-[1px] my-3 bg-gradient-to-r from-white/10 to-transparent"
										aria-hidden="true"
									/>
								);
							}

							const isActive = location.pathname === item.path;
							const Element = item.isModal ? "button" : Link;

							// Interactive parameters config binding
							const elementProps = item.isModal
								? {
										onClick: () => {
											closeMenu();
											onSwitchToLogin();
										},
									}
								: {
										to: item.path,
										onClick: closeMenu,
									};

							return (
								<Element
									key={item.name}
									{...elementProps}
									className={`w-full group flex flex-col justify-center px-4 py-3 rounded-lg relative overflow-hidden transition-all text-left outline-none border border-transparent
                                        ${
																					isActive
																						? "bg-fuchsia-500/10 border-fuchsia-500/20 text-white shadow-[inset_0_0_15px_rgba(217,70,239,0.05)]"
																						: "hover:bg-white/[0.02] hover:border-white/5 text-slate-400 hover:text-white"
																				}
                                        focus-visible:ring-1 focus-visible:ring-fuchsia-500 focus-visible:bg-fuchsia-500/5
                                    `}
								>
									{/* Action Route Pointer Tag Decor */}
									{isActive && (
										<div className="absolute left-0 top-2 bottom-2 w-[3px] bg-fuchsia-500 rounded-r" />
									)}

									{/* Visual Clean Name String Block */}
									<div className="flex items-center justify-between w-full">
										<span className="text-xs sm:text-sm font-bold tracking-wide transition-transform group-hover:translate-x-0.5">
											{item.label}
										</span>
										<ChevronRight
											size={12}
											className="text-slate-600 group-hover:text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
										/>
									</div>
								</Element>
							);
						})}
					</nav>
				</div>
			</aside>
		</>
	);
}
