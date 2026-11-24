import { useCallback, type Dispatch, type SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import MenuDrawer from "@/components/layout/MenuDrawer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import WelcomeBanner from "@/components/layout/WelcomeBanner";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
	openLogin: () => void;
	isMenuOpen: boolean;
	setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
	openNotifications: () => void;
	openTOS: () => void;
	openData: () => void;
}

export default function MainLayout({
	openLogin,
	isMenuOpen,
	setIsMenuOpen,
	openNotifications,
	openTOS,
	openData,
}: MainLayoutProps) {
	const closeMenu = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen]);

	return (
		<div className="flex min-h-screen flex-col bg-base-100 text-base-content" data-theme="techtrade">
			<MenuDrawer
				isOpen={isMenuOpen}
				closeMenu={closeMenu}
				onSwitchToLogin={openLogin}
			/>

			<NavBar
				toggleMenu={() => setIsMenuOpen(true)}
				isMenuOpen={isMenuOpen}
				onLoginClick={openLogin}
				onNotificationClick={openNotifications}
			/>

			<WelcomeBanner />

			<main className="flex-1">
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
