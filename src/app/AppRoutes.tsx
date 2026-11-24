import { lazy, Suspense, type Dispatch, type SetStateAction } from "react";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout";
import { AdminInterceptors, AdminLayout } from "@/features/admin";
import AppLoading from "@/app/AppLoading";

const Home = lazy(() => import("@/pages/marketplace/Home"));
const About = lazy(() => import("@/pages/about/About"));
const Market = lazy(() => import("@/pages/marketplace/Market"));
const SellGear = lazy(() => import("@/pages/marketplace/SellGear"));
const BuildDoctor = lazy(() => import("@/pages/hardware/BuildDoctor"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const ContactUs = lazy(() => import("@/pages/support/ContactUs"));
const ListingReportPage = lazy(() => import("@/pages/reports/ListingReport"));
const EscrowTrackerPage = lazy(
	() => import("@/pages/transactions/EscrowTrackerPage"),
);
const ReviewPage = lazy(() => import("@/pages/profile/ReviewPage"));
const ReportUser = lazy(() => import("@/pages/reports/ReportUser"));
const LaunchDisputePage = lazy(
	() => import("@/pages/transactions/LaunchDispute"),
);
const MyOffers = lazy(() => import("@/pages/offers/MyOffers"));
const MyTransactions = lazy(
	() => import("@/pages/transactions/MyTransactions"),
);
const ViewListing = lazy(() => import("@/pages/marketplace/ViewListing"));
const ManageOffer = lazy(() => import("@/pages/offers/ManageOffer"));
const WhatsAppTTLPage = lazy(
	() => import("@/pages/transactions/WhatsAppTTLPage"),
);
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const UserRoleManagement = lazy(
	() => import("@/pages/admin/UserRoleManagement"),
);
const EscrowVault = lazy(() => import("@/pages/admin/EscrowVault"));
const HardwareDatabase = lazy(() => import("@/pages/admin/HardwareDatabase"));
const UserSupport = lazy(() => import("@/pages/admin/UserSupport"));
const NukeSuite = lazy(() => import("@/pages/admin/NukeSuite"));
const HardwareEditForm = lazy(() => import("@/pages/admin/HardwareEditForm"));
const HardwareCreateForm = lazy(
	() => import("@/pages/admin/HardwareCreateForm"),
);

interface AppRoutesProps {
	openLogin: () => void;
	switchToLogin: () => void;
	openNotifications: () => void;
	openTOS: () => void;
	openData: () => void;
	openCounterModal: (offerId: string | number) => void;
	isMenuOpen: boolean;
	setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AppRoutes({
	openLogin,
	switchToLogin,
	openNotifications,
	openTOS,
	openData,
	openCounterModal,
	isMenuOpen,
	setIsMenuOpen,
}: AppRoutesProps) {
	return (
		<Suspense fallback={<AppLoading />}>
			<Routes>
				<Route
					path="/"
					element={
						<MainLayout
							openLogin={openLogin}
							isMenuOpen={isMenuOpen}
							setIsMenuOpen={setIsMenuOpen}
							openNotifications={openNotifications}
							openTOS={openTOS}
							openData={openData}
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
							<ManageOffer openCounterModal={openCounterModal} />
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
		</Suspense>
	);
}
