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
import ContactUs from "./pages/main/ContactUs";

// Auth Modals
import LoginModal from "./components/main/authentication/LoginModal";
import RegisterModal from "./components/main/authentication/RegisterModal";
import ForgotModal from "./components/main/authentication/ForgotModal";
import OTPModal from "./components/main/authentication/OTPModal";
import ResetModal from "./components/main/authentication/ResetModal";
import MyOffers from "./pages/main/MyOffers";
import MyTransactions from "./pages/main/MyTransactions";
import ViewListing from "./pages/main/ViewListing";
import ManageOffer from "./pages/main/ManageOffer";
import NotificationModal from "./components/main/Notifications/NotificationModal";
import CounterOfferModal from "./components/main/Notifications/CounterOfferModal";
import TOSModal from "./components/main/tos/TOSModal";
import PrivacyModal from "./components/main/privacy/PrivacyModal";
import ListingReportPage from "./pages/main/ListingReport";
import PaymentGateWay from "./pages/main/PaymentGateWay";
import EscrowTrackerPage from "./pages/main/EscrowTrackerPage";
import ReviewPage from "./pages/main/ReviewPage";
import ReportUser from "./pages/main/ReportUser";
import LaunchDisputePage from "./pages/main/LaunchDispute";

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
    const [isTOSModalOpen, setIsTOSModalOpen] = useState(false);
    const [isDataModalOpen, setIsDataModalOpen] = useState(false);

    const isAnyModalOpen = useMemo(() => {
        return isMenuOpen || isLoginOpen || isRegisterOpen || isForgotOpen || isOTPOpen || isResetOpen || isNotificationOpen || isCounterModalOpen || isTOSModalOpen || isDataModalOpen;
    }, [isMenuOpen, isLoginOpen, isRegisterOpen, isForgotOpen, isOTPOpen, isResetOpen, isNotificationOpen, isCounterModalOpen, isTOSModalOpen, isDataModalOpen]); 

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
        setIsTOSModalOpen(false);
        setIsDataModalOpen(false);
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
                            openTOS={() => setIsTOSModalOpen(true)}
                            openData={() => setIsDataModalOpen(true)}
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
                    <Route path="transactions" element={<MyTransactions />} />
                    <Route path="view-listing" element={<ViewListing />} />
                    <Route path="manage-offer" element={<ManageOffer openCounterModal={() => setIsCounterModalOpen(true)} />} />
                    <Route path="contact-us" element={<ContactUs />} />
                    <Route path="listing-report" element={<ListingReportPage />} />
                    <Route path="escrow-tracker" element={<EscrowTrackerPage />} />
                    <Route path="review" element={<ReviewPage />} />
                    <Route path="report-user" element={<ReportUser />} />
                    <Route path="dispute" element={<LaunchDisputePage />} />
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
                onSwitchToTOS={() => setIsTOSModalOpen(true)}
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
                onSwitchToData={() => setIsDataModalOpen(true)}
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

            <TOSModal
                isOpen={isTOSModalOpen}
                onClose={() => setIsTOSModalOpen(false)}
            />

            <PrivacyModal
                isOpen={isDataModalOpen}
                onClose={() => setIsDataModalOpen(false)}
            />
            
        </BrowserRouter>
    );
}

export default App;