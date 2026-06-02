import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../AuthContext";
import {
	LayoutDashboard,
	ShieldCheck,
	MessageSquareCode,
	Terminal,
	LogOut,
	DollarSign,
	Cpu as CpuIcon,
} from "lucide-react";

export default function AdminSidebar({ closeSidebar }) {
	const { user, logoutContext } = useAuth();
	const linkClasses = ({ isActive }) =>
		`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
			isActive
				? "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/5"
				: "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
		}`;

	const userRoleId =
		user && user.roleId !== undefined && user.roleId !== null
			? Number(user.roleId)
			: null;

	const showUserRoleManagement = userRoleId === 4;

	const mainControls = [
		{ name: "Main Dashboard", path: "/admin", icon: LayoutDashboard },
		...(showUserRoleManagement
			? [
					{
						name: "User Role Management",
						path: "/admin/user-roles",
						icon: ShieldCheck,
					},
				]
			: []),
		{ name: "Escrow Vault", path: "/admin/escrow-vault", icon: DollarSign },
		{
			name: "Hardware Database",
			path: "/admin/hardware-database",
			icon: CpuIcon,
		},
		{
			name: "User Support Tickets",
			path: "/admin/user-support",
			icon: MessageSquareCode,
		},
	];

	return (
		<aside className="w-64 bg-[#050505] border-r border-white/5 flex flex-col justify-between h-screen text-slate-300 font-mono">
			<div className="flex flex-col overflow-hidden">
				<header className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-black/20 shrink-0">
					<Link
						to="/admin"
						onClick={closeSidebar}
						className="flex items-center gap-3 group"
					>
						<img
							src={logo}
							alt="TechTrade Logo"
							className="w-10 h-10 object-cover group-hover:rotate-6 transition-transform duration-300"
						/>
						<h1 className="text-white text-base font-black italic tracking-tighter uppercase">
							TechTrade <span className="text-fuchsia-500">Admin</span>
						</h1>
					</Link>

					<button
						onClick={closeSidebar}
						className="p-2 bg-white/5 rounded-lg border border-white/10 text-white lg:hidden hover:bg-white/10 transition-all"
						aria-label="Close Sidebar"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
							stroke="currentColor"
							className="w-4 h-4"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</header>

				<nav className="p-4 flex-grow overflow-y-auto space-y-6">
					<section aria-labelledby="main-controls-heading">
						<h2
							id="main-controls-heading"
							className="text-xs font-black text-fuchsia-500 uppercase tracking-[0.25em] px-4 mb-3"
						>
							Main Controls
						</h2>
						{/* 🛠️ SEMANTIC HTML: Structured links inside list loops for accessibility screenreaders */}
						<ul className="space-y-2">
							{mainControls.map((link) => {
								const IconComponent = link.icon;
								return (
									<li key={link.path}>
										<NavLink
											to={link.path}
											end={link.path === "/admin"}
											onClick={closeSidebar}
											className={linkClasses}
										>
											<IconComponent
												size={18}
												className="text-fuchsia-500 shrink-0"
											/>
											<span>{link.name}</span>
										</NavLink>
									</li>
								);
							})}
						</ul>
					</section>

					<section aria-labelledby="safety-controls-heading">
						<h2
							id="safety-controls-heading"
							className="text-xs font-black text-red-500 uppercase tracking-[0.25em] px-4 mb-3"
						>
							Reports & Flags
						</h2>
						<ul className="space-y-2">
							<li>
								<NavLink
									to="/admin/nuke-suite"
									onClick={closeSidebar}
									className={({ isActive }) =>
										`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
											isActive
												? "bg-red-500/10 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
												: "bg-red-500/5 border-red-500/10 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
										}`
									}
								>
									<Terminal size={18} className="shrink-0" />
									<span>Nuke Suite</span>
								</NavLink>
							</li>
						</ul>
					</section>
				</nav>
			</div>

			<footer className="p-4 border-t border-white/5 bg-black/40 shrink-0">
				<Link
					to="/"
					className="w-full h-10 px-4 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
				>
					<LogOut size={14} />
					<span>Exit to Marketplace</span>
				</Link>
			</footer>
		</aside>
	);
}
