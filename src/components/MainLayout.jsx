import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import NavBar from "./main/common/NavBar";
import MenuDrawer from "./main/common/MenuDrawer";
import ScrollToTop from "./main/common/ScrollToTop";
import WelcomeBanner from "./main/common/WelcomeBanner";
import Footer from "./main/common/Footer";

export default function MainLayout({
	openLogin,
	isMenuOpen,
	setIsMenuOpen,
	openNotifications,
	openTOS,
	openData,
}) {
	const { isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#090614] flex items-center justify-center text-white text-sm sm:text-base md:text-lg">
				Loading...
			</div>
		);
	}

	const closeMenu = () => setIsMenuOpen(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return (
		<div
			className="flex flex-col min-h-screen bg-neutral-50 text-xs sm:text-sm md:text-base lg:text-lg"
			data-theme="techtrade"
		>
			<MenuDrawer
				isOpen={isMenuOpen}
				closeMenu={closeMenu}
				onSwitchToLogin={openLogin}
			/>

			<header className="w-full bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800">
				<NavBar
					toggleMenu={() => setIsMenuOpen(true)}
					onLoginClick={openLogin}
					onNotificationClick={openNotifications}
				/>
			</header>

			<WelcomeBanner />

			<main className="flex-grow bg-[#090614]">
				<ScrollToTop />
				<Outlet />
			</main>

			<Footer
				onLoginClick={openLogin}
				onTOSClick={openTOS}
				onDataClick={openData}
			/>
		</div>
	);
}
