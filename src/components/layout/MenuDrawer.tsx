import {
	useEffect,
	useRef,
	type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { X, Menu, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";

interface MenuDrawerProps {
	isOpen: boolean;
	closeMenu: () => void;
	onSwitchToLogin: () => void;
}

interface MenuItem {
	name: string;
	label?: string;
	path: string | null;
	isModal?: boolean;
}

export default function MenuDrawer({
	isOpen,
	closeMenu,
	onSwitchToLogin,
}: MenuDrawerProps) {
	const location = useLocation();
	const { user } = useAuth();
	const drawerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!isOpen) return;
		const previousOverflow = document.body.style.overflow;
		const previouslyFocused =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		const handleEscape = (event: globalThis.KeyboardEvent) => {
			if (event.key === "Escape") closeMenu();
		};
		document.body.style.overflow = "hidden";
		drawerRef.current
			?.querySelector<HTMLElement>("a[href], button:not([disabled])")
			?.focus();
		window.addEventListener("keydown", handleEscape);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleEscape);
			previouslyFocused?.focus();
		};
	}, [closeMenu, isOpen]);

	const userRoleId =
		user && user.roleId !== undefined && user.roleId !== null
			? Number(user.roleId)
			: null;
	const isAdmin = userRoleId !== null && [3, 4].includes(userRoleId);
	const showSellGear =
		userRoleId !== null && ![0, 1, 3, 4].includes(userRoleId);
	const showBuildDoctor = !isAdmin;

	const menuItems: MenuItem[] = [
		{ name: "HOME", label: "Home", path: "/" },
		{ name: "ABOUT", label: "About us", path: "/about" },
		{ name: "MARKET", label: "Marketplace", path: "/marketplace" },
		...(showSellGear
			? [{ name: "Sell Your Gear", label: "Sell Your Gear", path: "/sell" }]
			: []),
		...(showBuildDoctor
			? [{ name: "Build Doctor", label: "Build Doctor", path: "/build-doctor" }]
			: []),
		{ name: "divider", path: null },
		{ name: "Contact Us", label: "Contact Us", path: "/contact-us" },
		...(!user
			? [
					{
						name: "Login/Register",
						label: "Log in or register",
						path: "/login",
						isModal: true,
					},
				]
			: []),
	];

	const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
		if (event.key !== "Tab" || !drawerRef.current) return;

		const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled])',
		);
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	};

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				onClick={closeMenu}
				aria-hidden="true"
			/>

			<aside
				id="mobile-navigation"
				ref={drawerRef}
				aria-modal={isOpen || undefined}
				aria-hidden={!isOpen}
				inert={!isOpen}
				role="dialog"
				aria-label="Site navigation"
				onKeyDown={handleDialogKeyDown}
				className={`fixed left-0 top-0 z-[70] flex h-full w-80 max-w-[85vw] flex-col border-r border-white/10 bg-base-200 text-slate-300 shadow-2xl transition-transform duration-200 ease-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex flex-col h-full p-5 sm:p-6 gap-8">
					<header className="flex w-full items-center justify-between border-b border-white/[0.08] pb-4">
						<div className="flex items-center gap-2.5">
							<Menu size={17} className="text-primary" aria-hidden="true" />
							<h2 className="text-base font-semibold text-white">
								Menu
							</h2>
						</div>
						<button
							type="button"
							onClick={closeMenu}
							aria-label="Close navigation menu"
							className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<X size={18} aria-hidden="true" />
						</button>
					</header>

					<nav className="flex w-full flex-col items-start gap-1.5">
						{menuItems.map((item, index) => {
							if (item.name === "divider") {
								return (
									<div
										key={`div-${index}`}
										className="my-3 h-px w-full bg-white/10"
										aria-hidden="true"
									/>
								);
							}

							const isActive =
								location.pathname === item.path ||
								(Boolean(item.path && item.path !== "/") &&
									location.pathname.startsWith(`${item.path}/`));
							if (!item.path) return null;

							const itemContent = (
								<>
									{isActive && (
										<div className="absolute bottom-2 left-0 top-2 w-0.5 rounded-r bg-primary" />
									)}

									<div className="flex items-center justify-between w-full">
										<span className="text-sm font-medium transition-transform group-hover:translate-x-0.5">
											{item.label}
										</span>
										<ChevronRight
											size={12}
											className="-translate-x-2 text-slate-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
											aria-hidden="true"
										/>
									</div>
								</>
							);
							const itemClassName = `relative flex min-h-11 w-full flex-col justify-center overflow-hidden rounded-xl border border-transparent px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
										${
											isActive
												? "border-primary/15 bg-primary/[0.08] text-white"
												: "text-slate-300 hover:bg-white/[0.04] hover:text-white"
										}
									`;

							return item.isModal ? (
								<button
									key={item.name}
									type="button"
									onClick={() => {
										closeMenu();
										onSwitchToLogin();
									}}
									className={itemClassName}
								>
									{itemContent}
								</button>
							) : (
								<Link
									key={item.name}
									to={item.path}
									onClick={closeMenu}
									className={itemClassName}
								>
									{itemContent}
								</Link>
							);
						})}
					</nav>
				</div>
			</aside>
		</>
	);
}
