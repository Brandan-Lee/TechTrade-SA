import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../main/common/ScrollToTop";
import AdminSidebar from "./common/AdminSideBar";
import { Menu } from "lucide-react";
import WelcomeBanner from "../main/common/WelcomeBanner";

export default function AdminLayout() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setIsSidebarOpen(false);

		const mainPanel = document.getElementById("admin-main-content");
		if (mainPanel) mainPanel.scrollTo(0, 0);
	}, [location]);

	return (
		<div
			className="flex h-screen w-screen overflow-hidden bg-[#090614] text-xs sm:text-sm md:text-base lg:text-lg"
			data-theme="techtrade"
		>
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			<aside
				className={`
				fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 h-full shrink-0
				${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
			`}
			>
				<AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
			</aside>

			<div className="flex flex-col flex-grow h-full overflow-hidden">
				<header className="h-16 border-b border-neutral-800 flex items-center justify-between px-4 sm:px-8 shrink-0">
					<div className="flex items-center gap-4">
						<button
							onClick={() => setIsSidebarOpen(true)}
							className="btn btn-ghost btn-sm btn-circle lg:hidden text-neutral-400 hover:text-white"
							aria-label="Open Navigation"
						>
							<Menu className="w-5 h-5" />
						</button>
					</div>
					<WelcomeBanner />
				</header>

				<main
					id="admin-main-content"
					className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8"
				>
					<ScrollToTop />
					<Outlet />
				</main>
			</div>
		</div>
	);
}
