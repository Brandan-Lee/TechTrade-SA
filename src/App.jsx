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
import Profile from "./pages/main/Profile";

// Auth Modals
import LoginModal from "./components/main/authentication/LoginModal";
import RegisterModal from "./components/main/authentication/RegisterModal";
import ForgotModal from "./components/main/authentication/ForgotModal";
import OTPModal from "./components/main/authentication/OTPModal";
import ResetModal from "./components/main/authentication/ResetModal";
import MyOffers from "./pages/main/MyOffers";
import ViewListing from "./pages/main/ViewListing";
import ManageOffer from "./pages/main/ManageOffer";
import NotificationModal from "./components/main/Notifications/NotificationModal";
import CounterOfferModal from "./components/main/Notifications/CounterOfferModal";

function App() {
    // --- UI State ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isOTPOpen, setIsOTPOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

    const isAnyModalOpen = useMemo(() => {
        return isMenuOpen || isLoginOpen || isRegisterOpen || isForgotOpen || isOTPOpen || isResetOpen || isNotificationOpen || isCounterModalOpen;
    }, [isMenuOpen, isLoginOpen, isRegisterOpen, isForgotOpen, isOTPOpen, isResetOpen || isNotificationOpen || isCounterModalOpen]);

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
        setIsNotificationOpen(false);
        setIsCounterModalOpen(false);
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
                            openNotifications={() => setIsNotificationOpen(true)}
                        />
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="about" element={<About openLogin={switchToLogin} />} />
                    <Route path="marketplace" element={<Market />} />
                    <Route path="sell" element={<SellGear />} />
                    <Route path="build-doctor" element={<BuildDoctor />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="offers" element={<MyOffers />} />
                    <Route path="view-listing" element={<ViewListing />} />
                    <Route path="manage-offer" element={<ManageOffer openCounterModal={() => setIsCounterModalOpen(true)} />} />
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

            <NotificationModal
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
            />

            <CounterOfferModal
                isOpen={isCounterModalOpen}
                onClose={() => setIsCounterModalOpen(false)}
            />
            
        </BrowserRouter>
    );
}

export default App;