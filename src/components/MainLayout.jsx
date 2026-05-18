import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./main/common/NavBar";
import MenuDrawer from "./main/common/MenuDrawer";
import ScrollToTop from "./main/common/ScrollToTop";
import WelcomeBanner from "./main/common/WelcomeBanner";
import FilterBar from "./main/common/FilterBar";
import Footer from "./main/common/Footer";

// Destructure the new props from App.jsx
export default function MainLayout({ openLogin, isMenuOpen, setIsMenuOpen, openNotifications, openTOS, openData }) {
	const location = useLocation();

	const closeMenu = () => setIsMenuOpen(false);

	// Scroll to top when route changes
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return (
		<div
			className="flex flex-col min-h-screen bg-neutral-50"
			data-theme="techtrade"
		>
			{/* Mobile Menu Drawer */}
			<MenuDrawer
				isOpen={isMenuOpen}
				closeMenu={closeMenu}
				onSwitchToLogin={openLogin}
			/>

			{/* Constant Top Components */}
			<header className="w-full bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800">
				<NavBar
					toggleMenu={() => setIsMenuOpen(true)}
					onLoginClick={openLogin}
					onNotificationClick={openNotifications}
				/>
			</header>

			<WelcomeBanner />

			{/* Dynamic Page Content */}
			<main className="flex-grow bg-[#090614]">
				<ScrollToTop />
				<Outlet />
			</main>

			{/* Constant Footer Component */}
			<Footer
				onLoginClick={openLogin}
				onTOSClick={openTOS}
				onDataClick={openData}
			/>
		</div>
	);
}
