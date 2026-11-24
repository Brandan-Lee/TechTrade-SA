import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/features/admin/components/common/AdminSideBar";
import { Menu } from "lucide-react";
import WelcomeBanner from "@/components/layout/WelcomeBanner";

export default function AdminLayout() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		// Route changes intentionally close the mobile drawer and reset the admin scroll container.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsSidebarOpen(false);

		const mainPanel = document.getElementById("admin-main-content");
		if (mainPanel) mainPanel.scrollTo(0, 0);
	}, [location]);

	return (
		<div className="flex h-dvh w-full overflow-hidden bg-base-100 text-base-content" data-theme="techtrade">
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
					aria-hidden="true"
				/>
			)}

			<aside
				className={`fixed inset-y-0 left-0 z-50 h-full shrink-0 transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
			</aside>

			<div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
				<header className="flex min-h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-4 sm:px-8">
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => setIsSidebarOpen(true)}
							aria-expanded={isSidebarOpen}
							aria-label="Open admin navigation"
							className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
						>
							<Menu size={20} aria-hidden="true" />
						</button>
					</div>
					<WelcomeBanner />
				</header>

				<main
					id="admin-main-content"
					className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
				>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
