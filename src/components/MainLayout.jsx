import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from './main/common/NavBar';
import MenuDrawer from './main/common/MenuDrawer';
import ScrollToTop from './main/common/ScrollToTop';
import WelcomeBanner from './main/common/WelcomeBanner';
import FilterBar from './main/common/FilterBar';
import Footer from './main/common/Footer';

// Destructure the new props from App.jsx
export default function MainLayout({ openLogin, isMenuOpen, setIsMenuOpen }) {
    const location = useLocation();

    const closeMenu = () => setIsMenuOpen(false);

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50" data-theme="techtrade">
            {/* Mobile Menu Drawer */}
            <MenuDrawer 
                isOpen={isMenuOpen}
                closeMenu={closeMenu}
                // Pass openLogin here so mobile users can log in too!
                onLoginClick={openLogin} 
            />
            
            {/* Constant Top Components */}
            <header className="w-full h-auto bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 border-b-4 border-pink-600 flex justify-center px-4">
                {/* Navbar now handles both the Menu toggle and the Login trigger */}
                <NavBar 
                    toggleMenu={() => setIsMenuOpen(true)} 
                    onLoginClick={openLogin}
                />
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