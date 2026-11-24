import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/features/auth";
import {
	LayoutDashboard,
	ShieldCheck,
	MessageSquareCode,
	Terminal,
	LogOut,
	DollarSign,
	Cpu as CpuIcon,
	X,
} from "lucide-react";

export default function AdminSidebar({ closeSidebar }) {
	const { user } = useAuth();

	const linkClasses = ({ isActive }) =>
		`flex min-h-11 items-center gap-3 rounded-xl border-l-2 px-4 py-2.5 text-sm font-medium transition-colors ${
			isActive
				? "border-primary bg-primary/[0.08] text-white"
				: "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
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
		<aside className="flex h-dvh w-64 flex-col justify-between border-r border-white/[0.08] bg-base-200 text-slate-300">
			<div className="flex flex-col overflow-hidden">
				<header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
					<Link
						to="/admin"
						onClick={closeSidebar}
						className="flex items-center gap-3"
					>
						<img
							src={logo}
							alt="TechTrade Logo"
							className="h-9 w-9 rounded-lg object-cover"
						/>
						<h1 className="text-sm font-semibold tracking-tight text-white">
							TechTrade <span className="text-primary">Admin</span>
						</h1>
					</Link>

					<button
						type="button"
						onClick={closeSidebar}
						className="rounded-lg border border-white/10 p-2 text-slate-300 transition-colors hover:bg-white/[0.06] lg:hidden"
						aria-label="Close Sidebar"
					>
						<X size={16} aria-hidden="true" />
					</button>
				</header>

				<nav className="flex-grow space-y-6 overflow-y-auto p-4">
					<section aria-labelledby="main-controls-heading">
						<h2
							id="main-controls-heading"
							className="mb-3 px-4 text-xs font-medium text-slate-500"
						>
							Workspace
						</h2>
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
												className="shrink-0 text-current"
												aria-hidden="true"
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
							className="mb-3 px-4 text-xs font-medium text-slate-500"
						>
							Safety tools
						</h2>
						<ul className="space-y-2">
							<li>
								<NavLink
									to="/admin/nuke-suite"
									onClick={closeSidebar}
									className={({ isActive }) =>
										`flex min-h-11 items-center gap-3 rounded-xl border-l-2 px-4 py-2.5 text-sm font-medium transition-colors ${
											isActive
												? "border-rose-400 bg-rose-400/10 text-rose-200"
												: "border-transparent text-rose-300/80 hover:bg-rose-400/[0.06] hover:text-rose-200"
										}`
									}
								>
									<Terminal size={18} className="shrink-0" aria-hidden="true" />
									<span>Nuke Suite</span>
								</NavLink>
							</li>
						</ul>
					</section>
				</nav>
			</div>

			<footer className="shrink-0 border-t border-white/[0.08] p-4">
				<Link
					to="/"
					className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
				>
					<LogOut size={15} aria-hidden="true" />
					<span>Exit to Marketplace</span>
				</Link>
			</footer>
		</aside>
	);
}
