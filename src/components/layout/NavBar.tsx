import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, FileText, LogOut, Menu, User, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth, type AuthUser } from "@/features/auth";
import { SearchBar } from "@/features/marketplace";

interface NavBarProps {
	toggleMenu: () => void;
	isMenuOpen: boolean;
	onLoginClick: () => void;
	onNotificationClick: () => void;
}

interface NavigationLink {
	name: string;
	path: string;
	isModal?: boolean;
}

interface AccountMenuItem {
	label: string;
	icon: ReactNode;
	path: string;
	action?: () => void;
	isDestructive?: boolean;
}

interface AccountMenuProps {
	user: AuthUser | null;
	isOpen: boolean;
	menuRef: React.RefObject<HTMLDivElement | null>;
	items: AccountMenuItem[];
	onToggle: () => void;
	onClose: () => void;
	onLoginClick: () => void;
}

function AccountMenu({
	user,
	isOpen,
	menuRef,
	items,
	onToggle,
	onClose,
	onLoginClick,
}: AccountMenuProps) {
	return (
		<div className="relative shrink-0" ref={menuRef}>
			<button
				type="button"
				onClick={user ? onToggle : onLoginClick}
				aria-label={user ? "Open account menu" : "Sign in"}
				aria-expanded={isOpen}
				className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
					isOpen
						? "border-primary/40 bg-primary/10 text-primary"
						: "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white"
				}`}
			>
				<User size={19} aria-hidden="true" />
			</button>

			<AnimatePresence>
				{isOpen && user && (
					<motion.div
						initial={{ opacity: 0, y: 8, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.98 }}
						transition={{ duration: 0.16 }}
						className="absolute right-0 top-[calc(100%+0.75rem)] z-[100] w-64 rounded-2xl border border-white/10 bg-base-200 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
					>
						<div className="mb-1 rounded-t-xl border-b border-white/[0.07] bg-white/[0.03] px-4 py-3">
							<p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
								Signed in as
							</p>
							<p className="mt-1 truncate text-sm font-medium text-white">
								{user.fullName || user.email || "TechTrade member"}
							</p>
						</div>
						<nav aria-label="Account">
							{items.map((item) => (
								<Link
									key={item.label}
									to={item.path}
									onClick={() => {
										onClose();
										if (item.action) item.action();
									}}
									className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
										item.isDestructive
											? "text-rose-300 hover:bg-rose-400/10"
											: "text-slate-300 hover:bg-white/[0.06] hover:text-white"
									}`}
								>
									<span className={item.isDestructive ? "text-rose-300" : "text-slate-400"}>
										{item.icon}
									</span>
									{item.label}
								</Link>
							))}
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default function NavBar({
	toggleMenu,
	isMenuOpen,
	onLoginClick,
	onNotificationClick,
}: NavBarProps) {
	const location = useLocation();
	const { user, logoutContext } = useAuth();
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const menuReference = useRef<HTMLDivElement>(null);

	const userRoleId = user?.roleId == null ? null : Number(user.roleId);
	const isAdmin = userRoleId !== null && [3, 4].includes(userRoleId);
	const showViewOffers =
		userRoleId !== null && ![0, 1, 3, 4].includes(userRoleId);
	const showBuildDoctor = !isAdmin && userRoleId !== null;
	const showAccountOptions = !isAdmin;

	const handleLogout = async () => {
		await logoutContext();
		setIsUserMenuOpen(false);
	};

	const accountMenuItems: AccountMenuItem[] = [
		...(showAccountOptions
			? [
					{
						label: "My profile",
						icon: <UserCircle size={17} aria-hidden="true" />,
						path: "/profile",
					},
				]
			: []),
		...(showViewOffers
			? [
					{
						label: "My offers",
						icon: <FileText size={17} aria-hidden="true" />,
						path: "/offers",
					},
				]
			: []),
		...(showAccountOptions
			? [
					{
						label: "Transactions",
						icon: <FileText size={17} aria-hidden="true" />,
						path: "/transactions",
					},
				]
			: []),
		{
			label: "Log out",
			icon: <LogOut size={17} aria-hidden="true" />,
			path: "/",
			action: handleLogout,
			isDestructive: true,
		},
	];

	const mainNavLinks: NavigationLink[] = [
		{ name: "Marketplace", path: "/marketplace" },
		...(showViewOffers ? [{ name: "Sell gear", path: "/sell" }] : []),
		...(showBuildDoctor
			? [{ name: "Build Doctor", path: "/build-doctor" }]
			: []),
		{ name: "About", path: "/about" },
		{ name: "Support", path: "/contact-us" },
		...(!user ? [{ name: "Sign in", path: "#sign-in", isModal: true }] : []),
	];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				event.target instanceof Node &&
				menuReference.current &&
				!menuReference.current.contains(event.target)
			) {
				setIsUserMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-base-100/95 text-sm backdrop-blur-xl">
			<div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-5 px-4 sm:px-7 lg:px-10">
				<div className="flex shrink-0 items-center gap-3">
					<button
						type="button"
						onClick={toggleMenu}
						aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
						aria-expanded={isMenuOpen}
						aria-controls="mobile-navigation"
						className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-200 transition-colors hover:border-white/20 hover:text-primary lg:hidden"
					>
						<Menu size={21} aria-hidden="true" />
					</button>
					<Link to="/" className="group flex items-center gap-2.5">
						<img
							src={logo}
							alt=""
							className="h-9 w-9 rounded-lg object-cover"
							aria-hidden="true"
						/>
						<span className="text-[15px] font-bold tracking-tight text-white sm:text-base">
							TechTrade <span className="text-primary">ZA</span>
						</span>
					</Link>
				</div>

				<nav
					aria-label="Main navigation"
					className="hidden items-center gap-1 xl:flex"
				>
					{mainNavLinks.map((link) => {
						const isActive =
							location.pathname === link.path ||
							(link.path !== "/" && location.pathname.startsWith(`${link.path}/`));
						const linkClass = `rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
							isActive
								? "bg-white/[0.06] text-primary"
								: "text-slate-300 hover:bg-white/[0.04] hover:text-white"
						}`;

						return link.isModal ? (
							<button
								key={link.name}
								type="button"
								onClick={onLoginClick}
								className={linkClass}
							>
								{link.name}
							</button>
						) : (
							<Link
								key={link.path}
								to={link.path}
								aria-current={isActive ? "page" : undefined}
								className={linkClass}
							>
								{link.name}
							</Link>
						);
					})}
				</nav>

				<div className="flex shrink-0 items-center gap-2.5">
					<button
						type="button"
						onClick={() => (user ? onNotificationClick() : onLoginClick())}
						aria-label={
							user ? "View notifications" : "Sign in to view notifications"
						}
						className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-white/20 hover:text-primary"
					>
						<Bell size={18} aria-hidden="true" />
					</button>
					<AccountMenu
						user={user}
						isOpen={isUserMenuOpen}
						menuRef={menuReference}
						items={accountMenuItems}
						onToggle={() => setIsUserMenuOpen((open) => !open)}
						onClose={() => setIsUserMenuOpen(false)}
						onLoginClick={onLoginClick}
					/>
				</div>
			</div>

			<div className="border-t border-white/[0.04] bg-white/[0.015] py-2">
				<div className="mx-auto max-w-4xl px-4">
					<SearchBar />
				</div>
			</div>
		</header>
	);
}
