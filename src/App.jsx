import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Layout & Navigation
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ScrollToTop from "./components/main/common/ScrollToTop";

// Pages
import Home from "./pages/main/Home";
import About from "./pages/main/About";
import Market from "./pages/main/Market";
import SellGear from "./pages/main/SellGear";
import BuildDoctor from "./pages/main/BuildDoctor";
import Profile from "./pages/main/Profile";
import ContactUs from "./pages/main/ContactUs";
import ListingReportPage from "./pages/main/ListingReport";
import EscrowTrackerPage from "./pages/main/EscrowTrackerPage";
import ReviewPage from "./pages/main/ReviewPage";
import ReportUser from "./pages/main/ReportUser";
import LaunchDisputePage from "./pages/main/LaunchDispute";
import MyOffers from "./pages/main/MyOffers";
import MyTransactions from "./pages/main/MyTransactions";
import ViewListing from "./pages/main/ViewListing";
import ManageOffer from "./pages/main/ManageOffer";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
// NOTE: If you create standalone files for these later, swap these out for real imports!
const UserRoleManagement = () => <div className="text-neutral-100"><h1 className="text-2xl font-bold">👥 User Role Management</h1><p className="text-neutral-400 mt-1 text-sm">Update permissions matrices and staff access levels.</p></div>;
const TechDatabase = () => <div className="text-neutral-100"><h1 className="text-2xl font-bold">💻 Tech Database</h1><p className="text-neutral-400 mt-1 text-sm">Manage hardware specification blueprints and component metadata data nodes.</p></div>;
const AdminMessages = () => <div className="text-neutral-100"><h1 className="text-2xl font-bold">💬 Support Messages</h1><p className="text-neutral-400 mt-1 text-sm">Inbound inquiries, system notifications, and internal escalation chat channels.</p></div>;
const ReportedUsers = () => <div className="text-neutral-100"><h1 className="text-2xl font-bold">🚫 Reported Users Queue</h1><p className="text-neutral-400 mt-1 text-sm">Review profile safety flags, malicious user conduct reports, and bans.</p></div>;
const ReportedListings = () => <div className="text-neutral-100"><h1 className="text-2xl font-bold">⚠️ Reported Listings Queue</h1><p className="text-neutral-400 mt-1 text-sm">Investigate counterfeit claims, broken pricing specs, or forbidden hardware sales.</p></div>;
const NukeSuite = () => <div className="p-6 bg-error/10 border border-error/20 rounded-2xl text-error"><h1 className="text-2xl font-black uppercase tracking-wider">☢️ High Command Nuke Suite</h1><p className="text-neutral-300 mt-2 text-sm font-medium">Warning: Global instance purges, system blacklists, and server emergency lockdown overrides live here.</p></div>;

// Auth Modals
import LoginModal from "./components/main/authentication/LoginModal";
import RegisterModal from "./components/main/authentication/RegisterModal";
import ForgotModal from "./components/main/authentication/ForgotModal";
import OTPModal from "./components/main/authentication/OTPModal";
import ResetModal from "./components/main/authentication/ResetModal";
import NotificationModal from "./components/main/Notifications/NotificationModal";
import CounterOfferModal from "./components/main/Notifications/CounterOfferModal";
import TOSModal from "./components/main/tos/TOSModal";
import PrivacyModal from "./components/main/privacy/PrivacyModal";
import WhatsAppTTLPage from "./pages/main/WhatsAppTTLPage";

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
        return (
            isMenuOpen ||
            isLoginOpen ||
            isRegisterOpen ||
            isForgotOpen ||
            isOTPOpen ||
            isResetOpen ||
            isNotificationOpen ||
            isCounterModalOpen ||
            isTOSModalOpen ||
            isDataModalOpen
        );
    }, [
        isMenuOpen,
        isLoginOpen,
        isRegisterOpen,
        isForgotOpen,
        isOTPOpen,
        isResetOpen,
        isNotificationOpen,
        isCounterModalOpen,
        isTOSModalOpen,
        isDataModalOpen,
    ]);

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
                {/* --- Public App Routes (Wrapped in Global Customer Layout) --- */}
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
                    <Route
                        path="manage-offer"
                        element={
                            <ManageOffer
                                openCounterModal={() => setIsCounterModalOpen(true)}
                            />
                        }
                    />
                    <Route path="contact-us" element={<ContactUs />} />
                    <Route path="listing-report" element={<ListingReportPage />} />
                    <Route path="escrow-tracker" element={<EscrowTrackerPage />} />
                    <Route path="review" element={<ReviewPage />} />
                    <Route path="report-user" element={<ReportUser />} />
                    <Route path="dispute" element={<LaunchDisputePage />} />
                    <Route path="whatsapp-ttl" element={<WhatsAppTTLPage />} />
                </Route>

                {/* --- Fully Functional Responsive Admin Layout Section --- */}
                <Route 
                    path="/admin" 
                    element={<AdminLayout />}
                >
                    {/* Main Dashboard Panel Route */}
                    <Route index element={<AdminDashboard />} />

                    {/* Subroutes Mapping directly to your Cyberpunk Sidebar Items */}
                    <Route path="roles" element={<UserRoleManagement />} />
                    <Route path="database" element={<TechDatabase />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="reported-users" element={<ReportedUsers />} />
                    <Route path="reported-listings" element={<ReportedListings />} />
                    <Route path="nuke" element={<NukeSuite />} />
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