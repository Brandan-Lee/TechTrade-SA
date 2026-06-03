import React, { useState, useEffect } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	useNavigate,
	useLocation,
} from "react-router-dom";
import "./App.css";

import { AuthProvider, useAuth } from "./components/AuthContext";

// Layout & Navigation
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ScrollToTop from "./components/main/common/ScrollToTop";
import AdminInterceptors from "./components/AdminInterceptors";

// Main Pages
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
import WhatsAppTTLPage from "./pages/main/WhatsAppTTLPage";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";

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
import UserRoleManagement from "./pages/admin/UserRoleManagement";
import EscrowVault from "./pages/admin/EscrowVault";
import HardwareDatabase from "./pages/admin/HardwareDatabase";
import UserSupport from "./pages/admin/UserSupport";
import NukeSuite from "./pages/admin/NukeSuite";
import HardwareEditForm from "./pages/admin/HardwareEditForm";
import HardwareCreateForm from "./pages/admin/HardwareCreateForm";

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const { loginContext, isLoading, user } = useAuth();

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isForgotOpen, setIsForgotOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [registerMode, setRegisterMode] = useState("create");
	const [isOTPOpen, setIsOTPOpen] = useState(false);
	const [isResetOpen, setIsResetOpen] = useState(false);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
	const [counterOfferId, setCounterOfferId] = useState(null);
	const [transactionId, setTransactionId] = useState(null);
	const [isTOSModalOpen, setIsTOSModalOpen] = useState(false);
	const [isDataModalOpen, setIsDataModalOpen] = useState(false);

	const [authEmail, setAuthEmail] = useState("");
	const [authOTP, setAuthOTP] = useState("");
	const [authPurpose, setAuthPurpose] = useState("login");

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
		setRegisterMode("create");
		setIsRegisterOpen(true);
	};

	const switchToEditProfile = () => {
		closeAllModals();
		setRegisterMode("edit");
		setIsRegisterOpen(true);
	};

	const closeRegisterModal = () => {
		setIsRegisterOpen(false);
		setRegisterMode("create");
		if (location.pathname === "/profile/edit") {
			navigate(user ? `/profile/${user.id}` : "/profile", { replace: true });
		}
	};

	// Profile Guard Effect
	useEffect(() => {
		if (location.pathname !== "/profile/edit") return;
		if (isLoading) return;
		if (!user) {
			navigate("/", { replace: true });
			return;
		}
		switchToEditProfile();
	}, [location.pathname, user, isLoading]);

	useEffect(() => {
		if (location.state?.fromAdmin) {
			setAuthPurpose("admin");
			setIsLoginOpen(true);

			navigate(location.pathname, { replace: true, state: {} });
		}
	}, [location.pathname, location.state, navigate]);

	const switchToLogin = () => {
		closeAllModals();
		setIsLoginOpen(true);
	};
	const switchToForgot = () => {
		closeAllModals();
		setIsForgotOpen(true);
	};
	const switchToOTP = (emailValue = "", purposeValue = "login") => {
		closeAllModals();
		setAuthEmail(emailValue);
		setAuthPurpose(purposeValue);
		setIsOTPOpen(true);
	};
	const switchToReset = (emailValue = "", otpValue = "") => {
		closeAllModals();
		setAuthOTP(otpValue);
		if (emailValue) setAuthEmail(emailValue);
		setIsResetOpen(true);
	};

	if (isLoading) {
		return (
			<div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0c0c0e] font-mono gap-4">
				<div className="w-12 h-12 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
				<p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
					Initializing Security Session...
				</p>
			</div>
		);
	}

	return (
		<>
			<ScrollToTop />
			<Routes>
				<Route
					path="/"
					element={
						<MainLayout
							openLogin={() => {
								setAuthPurpose("login");
								setIsLoginOpen(true);
							}}
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
					<Route path="profile/edit" element={<Profile />} />
					<Route path="profile/:userId" element={<Profile />} />
					<Route path="profile" element={<Profile />} />
					<Route path="offers" element={<MyOffers />} />
					<Route path="transactions" element={<MyTransactions />} />
					<Route path="view-listing/:id" element={<ViewListing />} />
					<Route
						path="manage-offer/:offerId"
						element={
							<ManageOffer
								openCounterModal={(id) => {
									setCounterOfferId(id);
									setIsCounterModalOpen(true);
								}}
							/>
						}
					/>
					<Route path="contact-us" element={<ContactUs />} />
					<Route
						path="listing-report/:listingId"
						element={<ListingReportPage />}
					/>
					<Route
						path="escrow-tracker/:transactionId"
						element={<EscrowTrackerPage />}
					/>
					<Route path="review/:userId" element={<ReviewPage />} />
					<Route path="report-user/:userId" element={<ReportUser />} />
					<Route
						path="dispute/:transactionId"
						element={<LaunchDisputePage />}
					/>
					<Route
						path="whatsapp-ttl/:transactionId"
						element={<WhatsAppTTLPage />}
					/>
				</Route>

				<Route path="/admin" element={<AdminInterceptors />}>
					<Route element={<AdminLayout />}>
						<Route index element={<AdminDashboard />} />
						<Route path="user-roles" element={<UserRoleManagement />} />
						<Route path="escrow-vault" element={<EscrowVault />} />

						<Route path="hardware-database" element={<HardwareDatabase />} />
						<Route
							path="hardware-database/edit/:category/:id"
							element={<HardwareEditForm />}
						/>
						<Route
							path="hardware-database/create"
							element={<HardwareCreateForm />}
						/>

						<Route path="user-support" element={<UserSupport />} />
						<Route path="nuke-suite" element={<NukeSuite />} />
					</Route>
				</Route>
			</Routes>

			<LoginModal
				isOpen={isLoginOpen}
				onClose={() => {
					setIsLoginOpen(false);
					setAuthPurpose("login");
				}}
				onSwitchToRegister={switchToRegister}
				onSwitchToForgot={switchToForgot}
				onSwitchToOTP={switchToOTP}
				purpose={authPurpose}
				onLoginSuccess={(data) => {
					loginContext(data.user);
					closeAllModals();

					const isAdmin = ["3", "4"].includes(String(data.user.roleId));

					if (isAdmin) {
						navigate("/admin", {
							replace: true,
							state: { standardLogin: true },
						});
					} else {
						navigate("/", { replace: true });
					}
				}}
			/>

			<RegisterModal
				isOpen={isRegisterOpen}
				mode={registerMode}
				onClose={closeRegisterModal}
				onSwitchToLogin={switchToLogin}
				onSwitchToTOS={() => setIsTOSModalOpen(true)}
			/>

			<ForgotModal
				isOpen={isForgotOpen}
				onClose={() => setIsForgotOpen(false)}
				onSwitchToLogin={switchToLogin}
				onSwitchToOTP={(email) => switchToOTP(email, "reset")}
				onSwitchToReset={switchToReset}
				onSwitchTReset={switchToReset}
			/>

			<OTPModal
				isOpen={isOTPOpen}
				onClose={() => {
					setIsOTPOpen(false);
					navigate(".", { replace: true });
				}}
				email={authEmail}
				purpose={authPurpose}
				onSwitchToForgot={switchToForgot}
				onSwitchToReset={switchToReset}
				onSwitchToLogin={switchToLogin}
				onSwitchToData={() => setIsDataModalOpen(true)}
				onLoginSuccess={(data) => {
					loginContext(data.user);
					closeAllModals();
					const isAdmin = ["3", "4"].includes(String(data.user.roleId));
					navigate(isAdmin ? "/admin" : "/", { replace: true });
				}}
			/>

			<ResetModal
				isOpen={isResetOpen}
				onClose={() => setIsResetOpen(false)}
				onSwitchToOTP={() => switchToOTP(authEmail, "reset")}
				onSwitchToLogin={switchToLogin}
				email={authEmail}
				otpCode={authOTP}
			/>

			<NotificationModal
				isOpen={isNotificationOpen}
				onClose={() => setIsNotificationOpen(false)}
				onCounterAccept={(id) => {
					setTransactionId(id);
					closeAllModals();
					navigate(`/whatsapp-ttl/${id}`);
				}}
			/>

			<CounterOfferModal
				isOpen={isCounterModalOpen}
				onClose={() => {
					setIsCounterModalOpen(false);
					setCounterOfferId(null);
				}}
				offerId={counterOfferId}
				onSuccess={() => {
					setIsCounterModalOpen(false);
					navigate("/offers");
				}}
			/>
			<TOSModal
				isOpen={isTOSModalOpen}
				onClose={() => setIsTOSModalOpen(false)}
			/>
			<PrivacyModal
				isOpen={isDataModalOpen}
				onClose={() => setIsDataModalOpen(false)}
			/>
		</>
	);
}

export default function RootAppWrapper() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	);
}
