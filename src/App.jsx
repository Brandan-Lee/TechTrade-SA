import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Layout & Navigation
import MainLayout from "./components/MainLayout";
import ScrollToTop from "./components/main/common/ScrollToTop";

// Pages
import Home from "./pages/main/Home";
import About from "./pages/main/About";
import Market from "./pages/main/Market";
import SellGear from "./pages/main/SellGear";
import BuildDoctor from "./pages/main/BuildDoctor";

// Auth Modals
import LoginModal from "./components/main/authentication/LoginModal";
import RegisterModal from "./components/main/authentication/RegisterModal";
import ForgotModal from "./components/main/authentication/ForgotModal";
import OTPModal from "./components/main/authentication/OTPModal";
import ResetModal from "./components/main/authentication/ResetModal";

function App() {
    // --- UI State ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isOTPOpen, setIsOTPOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);

    const isAnyModalOpen = useMemo(() => {
        return isMenuOpen || isLoginOpen || isRegisterOpen || isForgotOpen || isOTPOpen || isResetOpen;
    }, [isMenuOpen, isLoginOpen, isRegisterOpen, isForgotOpen, isOTPOpen, isResetOpen]);

    useEffect(() => {
        document.body.style.overflow = isAnyModalOpen ? "hidden" : "unset";
    }, [isAnyModalOpen]);

    // --- Switch Logic (Navigation between Auth States) ---
    const closeAllModals = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setIsForgotOpen(false);
        setIsOTPOpen(false);
        setIsResetOpen(false);
    };

    const switchToRegister = () => {
        closeAllModals();
        setIsRegisterOpen(true);
    };

    const switchToLogin = () => {
        closeAllModals();
        setIsLoginOpen(true);
    };

    const switchToForgot = () => {
        closeAllModals();
        setIsForgotOpen(true);
    };

    const switchToOTP = () => {
        closeAllModals();
        setIsOTPOpen(true);
    };

    const switchToReset = () => {
        closeAllModals();
        setIsResetOpen(true);
    };

    return (
        <BrowserRouter>
            <ScrollToTop />

            <Routes>
                <Route
                    path="/"
                    element={
                        <MainLayout
                            openLogin={() => setIsLoginOpen(true)}
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="marketplace" element={<Market />} />
                    <Route path="sell" element={<SellGear />} />
                    <Route path="build-doctor" element={<BuildDoctor />} />
                </Route>
            </Routes>

            {/* Modals sit outside the Routes so it can overlay any page */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={switchToRegister}
                onSwitchToForgot={switchToForgot}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToOTP={switchToOTP}
                onSwitchToLogin={switchToLogin}
            />

            <ForgotModal
                isOpen={isForgotOpen}
                onClose={() => setIsForgotOpen(false)}
                onSwitchToLogin={switchToLogin}
                onSwitchToOTP={switchToOTP}
            />

            <OTPModal
                isOpen={isOTPOpen}
                onClose={() => setIsOTPOpen(false)}
                onSwitchToForgot={switchToForgot}
                onSwitchToReset={switchToReset}
                onSwitchToLogin={switchToLogin}
            />

            <ResetModal
                isOpen={isResetOpen}
                onClose={() => setIsResetOpen(false)}
                onSwitchToLogin={switchToLogin}
            />
        </BrowserRouter>
    );
}

export default App;