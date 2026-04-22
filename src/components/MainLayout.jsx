import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from './main/common/NavBar';
import MenuDrawer from './main/common/MenuDrawer';
import ScrollToTop from './main/common/ScrollToTop';
import WelcomeBanner from './main/common/WelcomeBanner';
import FilterBar from './main/common/FilterBar';
import Footer from './main/common/Footer';

export default function MainLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const closeMenu = () => setIsMenuOpen(false);

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50" data-theme="techtrade">
            {/* Mobile Menu Drawer */}
            <MenuDrawer isOpen={isMenuOpen} closeMenu={closeMenu} />
            
            {/* Constant Top Components */}
            <header className="w-full h-auto bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 border-b-4 border-pink-600 flex flex justify-center px-4">
                <NavBar toggleMenu={() => setIsMenuOpen(true)} />
            </header>
            <WelcomeBanner />
            <FilterBar />

            {/* Dynamic Page Content */}
            <main className="flex-grow">
                <ScrollToTop />
                <Outlet />
            </main>

            {/* Constant Footer Component */}
            <Footer />
        </div>
    );
}