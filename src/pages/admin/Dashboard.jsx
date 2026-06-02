import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { DashBoardCard } from "../../components/admin/dashboard/DashBoardCard";
import {
	Users,
	Shield,
	Key,
	Layers,
	Cpu,
	Box,
	Radio,
	HardDrive,
	Disc,
	ShoppingBag,
	Landmark,
	Percent,
	MessageSquare,
	FileText,
	AlertOctagon,
	Layout,
	Activity,
} from "lucide-react";

export default function DashBoard() {
	const [data, setData] = useState({
		totalUsers: "...",
		avgTrustScore: "...",
		currentSessions: "...",
		pendingOTPs: "...",
		totalCategories: "...",
		totalHardwareCount: "...",
		totalGPUs: "...",
		totalCPUs: "...",
		totalMotherboards: "...",
		totalPSUs: "...",
		totalRAM: "...",
		totalAIOs: "...",
		totalAirCoolers: "...",
		totalCaseFans: "...",
		totalSSDs: "...",
		totalHDDs: "...",
		totalPCCases: "...",
		totalListings: "...",
		totalOffers: "...",
		totalTransactions: "...",
		totalEscrowValue: "...",
		totalDisputes: "...",
		totalReviewReports: "...",
		totalUserReports: "...",
		totalListingReports: "...",
		totalUserBuilds: "...",
		totalIncomingMessages: "...",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [
					userRes,
					trustRes,
					sessionsRes,
					otpsRes,
					categoriesRes,
					hardwareRes,
					gpusRes,
					cpusRes,
					motherboardsRes,
					psusRes,
					ramRes,
					aioRes,
					airCoolersRes,
					caseFansRes,
					ssdsRes,
					hddsRes,
					pcCasesRes,
					listingsRes,
					offersRes,
					transactionsRes,
					paymentsRes,
					disputesRes,
					reviewReportsRes,
					userReportsRes,
					listingReportsRes,
					userBuildsRes,
					incomingMessagesRes,
				] = await Promise.all([
					apiFetch("/user/get_total_users.php"),
					apiFetch("/user/get_avg_trust.php"),
					apiFetch("/admin/get_total_sessions.php"),
					apiFetch("/admin/get_active_otps.php"),
					apiFetch(
						"/hardware_intelligence/categories/get_total_categories.php",
					),
					apiFetch("/hardware_intelligence/hardware/get_total_hardware.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_gpus.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_cpus.php"),
					apiFetch(
						"/hardware_intelligence/hardware/get_total_motherboards.php",
					),
					apiFetch("/hardware_intelligence/hardware/get_total_psus.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_memory.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_aios.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_air_coolers.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_case_fans.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_ssds.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_hdds.php"),
					apiFetch("/hardware_intelligence/hardware/get_total_pc_cases.php"),
					apiFetch("/listings/get_listing_count.php"),
					apiFetch("/offers/get_total_offers.php"),
					apiFetch("/transactions/get_total_transactions.php"),
					apiFetch("/payments/get_escrow_payments.php"),
					apiFetch("/transactions/get_total_disputes.php"),
					apiFetch("/reports/get_total_review_reports.php"),
					apiFetch("/reports/get_total_user_reports.php"),
					apiFetch("/reports/get_total_listing_reports.php"),
					apiFetch("/build_doctor/get_total_user_builds.php"),
					apiFetch("/support/get_total_support_messages.php"),
				]);

				const users = await userRes.json();
				const trust = await trustRes.json();
				const sessions = await sessionsRes.json();
				const otps = await otpsRes.json();
				const categories = await categoriesRes.json();
				const hardware = await hardwareRes.json();
				const gpus = await gpusRes.json();
				const cpus = await cpusRes.json();
				const motherboards = await motherboardsRes.json();
				const psus = await psusRes.json();
				const ram = await ramRes.json();
				const aio = await aioRes.json();
				const listings = await listingsRes.json();
				const payments = await paymentsRes.json();
				const airCoolers = await airCoolersRes.json();
				const caseFans = await caseFansRes.json();
				const ssds = await ssdsRes.json();
				const hdds = await hddsRes.json();
				const pcCases = await pcCasesRes.json();
				const offers = await offersRes.json();
				const transactions = await transactionsRes.json();
				const disputes = await disputesRes.json();
				const reviewReports = await reviewReportsRes.json();
				const userReports = await userReportsRes.json();
				const listingReports = await listingReportsRes.json();
				const userBuilds = await userBuildsRes.json();
				const incomingMessages = await incomingMessagesRes.json();

				const formattedEscrow = payments.total_amount_cents
					? `R ${(payments.total_amount_cents / 100).toLocaleString()}`
					: "R 0";

				setData({
					totalUsers: users.total_users ?? 0,
					avgTrustScore: trust.percentage ? `${trust.percentage}%` : "0%",
					currentSessions: sessions.total_active_sessions ?? 0,
					pendingOTPs: otps.active_otps ?? 0,
					totalCategories: categories.total_categories ?? 0,
					totalHardwareCount: hardware.total_hardware ?? 0,
					totalGPUs: gpus.total_gpus ?? 0,
					totalCPUs: cpus.total_cpus ?? cpus.total_cpubs ?? 0,
					totalMotherboards: motherboards.total_motherboards ?? 0,
					totalPSUs: psus.total_psus ?? 0,
					totalRAM: ram.total_memory ?? 0,
					totalAIOs: aio.total_aios ?? 0,
					totalListings: listings.count ?? 0,
					totalEscrowValue: formattedEscrow,
					totalAirCoolers: airCoolers.total_air_coolers ?? 0,
					totalCaseFans: caseFans.total_case_fans ?? 0,
					totalSSDs: ssds.total_ssds ?? 0,
					totalHDDs: hdds.total_hdds ?? 0,
					totalPCCases: pcCases.total_pc_cases ?? 0,
					totalOffers: offers.total_active_offers ?? 0,
					totalTransactions: transactions.active_transactions ?? 0,
					totalDisputes: disputes.active_disputes ?? 0,
					totalReviewReports: reviewReports.active_reports ?? 0,
					totalUserReports: userReports.active_user_reports ?? 0,
					totalListingReports: listingReports.active_listing_reports ?? 0,
					totalUserBuilds: userBuilds.total_builds ?? 0,
					totalIncomingMessages: incomingMessages.active_support_messages ?? 0,
				});
			} catch (error) {
				console.error("Failed to load dashboard stats:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="bg-[#07050e] p-4 sm:p-8 text-white font-mono selection:bg-purple-500 selection:text-black">
			{/* Structural Semantic Header */}
			<header className="border-b border-purple-500/20 pb-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						TechTrade ZA{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Stats
						</span>
					</h1>
				</div>
				<div>
					<Link
						to="/"
						className="lg:hidden btn btn-sm btn-outline border-purple-500/40 hover:border-purple-400 hover:bg-purple-900/20 text-purple-400 text-xs sm:text-sm normal-case transition-all duration-300"
					>
						&larr; Return to Front
					</Link>
				</div>
			</header>

			{/* Main Dashboard Layout */}
			<main className="space-y-10">
				{/* SECTION 1: MARKETPLACE OPERATIONS */}
				<section aria-labelledby="sec-marketplace">
					<h2
						id="sec-marketplace"
						className="text-sm sm:text-base font-bold text-cyan-400 mb-4 tracking-widest uppercase border-l-2 border-cyan-500 pl-2"
					>
						Marketplace Activity & Sales
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						<DashBoardCard
							label="Total Escrow in Vault"
							value={data.totalEscrowValue}
							icon={Landmark}
							colorClass="text-emerald-400"
						/>
						<DashBoardCard
							label="Total Active Listings"
							value={data.totalListings}
							icon={ShoppingBag}
							colorClass="text-cyan-400"
						/>
						<DashBoardCard
							label="Total Active Transactions"
							value={data.totalTransactions}
							icon={Activity}
							colorClass="text-indigo-400"
						/>
						<DashBoardCard
							label="Total Offers Active"
							value={data.totalOffers}
							icon={FileText}
							colorClass="text-blue-400"
						/>
					</div>
				</section>

				{/* SECTION 2: IDENTITY & SECURITY */}
				<section aria-labelledby="sec-community">
					<h2
						id="sec-community"
						className="text-sm sm:text-base font-bold text-purple-400 mb-4 tracking-widest uppercase border-l-2 border-purple-500 pl-2"
					>
						User Profiles & Security
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						<DashBoardCard
							label="Total Members"
							value={data.totalUsers}
							icon={Users}
							colorClass="text-purple-400"
						/>
						<DashBoardCard
							label="Avg Member Rating"
							value={data.avgTrustScore}
							icon={Percent}
							colorClass="text-fuchsia-400"
						/>
						<DashBoardCard
							label="Total Active Signed-In Devices"
							value={data.currentSessions}
							icon={Shield}
							colorClass="text-purple-500"
						/>
						<DashBoardCard
							label="Total Active OTP Codes"
							value={data.pendingOTPs}
							icon={Key}
							colorClass="text-pink-500"
						/>
					</div>
				</section>

				{/* SECTION 3: REVIEWS & MODERATION INCIDENTS */}
				<section aria-labelledby="sec-moderation">
					<h2
						id="sec-moderation"
						className="text-sm sm:text-base font-bold text-pink-500 mb-4 tracking-widest uppercase border-l-2 border-pink-500 pl-2"
					>
						Complaints & Help Desk Desk
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						<DashBoardCard
							label="Total Active Order Disputes"
							value={data.totalDisputes}
							icon={AlertOctagon}
							colorClass="text-red-500 font-bold animate-pulse"
						/>
						<DashBoardCard
							label="Total Flagged User Profiles"
							value={data.totalUserReports}
							icon={Users}
							colorClass="text-orange-400"
						/>
						<DashBoardCard
							label="Total Flagged Listings"
							value={data.totalListingReports}
							icon={ShoppingBag}
							colorClass="text-amber-500"
						/>
						<DashBoardCard
							label="Total Flagged Reviews"
							value={data.totalReviewReports}
							icon={FileText}
							colorClass="text-yellow-500"
						/>
						<DashBoardCard
							label="Help Messages Received"
							value={data.totalIncomingMessages}
							icon={MessageSquare}
							colorClass="text-teal-400"
						/>
						<DashBoardCard
							label="Total Custom User Builds"
							value={data.totalUserBuilds}
							icon={Layout}
							colorClass="text-sky-400"
						/>
					</div>
				</section>

				{/* SECTION 4: HARDWARE DATABASE CATALOGUE */}
				<section aria-labelledby="sec-hardware">
					<h2
						id="sec-hardware"
						className="text-sm sm:text-base font-bold text-amber-400 mb-4 tracking-widest uppercase border-l-2 border-amber-500 pl-2"
					>
						Hardware Catalogue Directory
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						<DashBoardCard
							label="Total Hardware Stored in Database"
							value={data.totalHardwareCount}
							icon={Layers}
							colorClass="text-amber-400"
						/>
						<DashBoardCard
							label="Total Categories"
							value={data.totalCategories}
							icon={Box}
							colorClass="text-yellow-500"
						/>
						<DashBoardCard
							label="Graphics Cards"
							value={data.totalGPUs}
							icon={Cpu}
							colorClass="text-orange-500"
						/>
						<DashBoardCard
							label="Processors"
							value={data.totalCPUs}
							icon={Cpu}
							colorClass="text-red-400"
						/>
						<DashBoardCard
							label="Motherboards"
							value={data.totalMotherboards}
							icon={Radio}
							colorClass="text-amber-500"
						/>
						<DashBoardCard
							label="Power Supply Units"
							value={data.totalPSUs}
							icon={Shield}
							colorClass="text-yellow-600"
						/>
						<DashBoardCard
							label="System Memory sticks"
							value={data.totalRAM}
							icon={Layers}
							colorClass="text-lime-400"
						/>
						<DashBoardCard
							label="Liquid System Coolers"
							value={data.totalAIOs}
							icon={Disc}
							colorClass="text-cyan-400"
						/>
						<DashBoardCard
							label="Air System Coolers"
							value={data.totalAirCoolers}
							icon={Disc}
							colorClass="text-blue-300"
						/>
						<DashBoardCard
							label="Case Cooling Fans"
							value={data.totalCaseFans}
							icon={Radio}
							colorClass="text-teal-300"
						/>
						<DashBoardCard
							label="Fast Micro Storage Drives"
							value={data.totalSSDs}
							icon={HardDrive}
							colorClass="text-emerald-400"
						/>
						<DashBoardCard
							label="Standard Mechanical Disk Drives"
							value={data.totalHDDs}
							icon={HardDrive}
							colorClass="text-green-500"
						/>
						<DashBoardCard
							label="Computer Outer Cases"
							value={data.totalPCCases}
							icon={Box}
							colorClass="text-amber-600"
						/>
					</div>
				</section>
			</main>
		</div>
	);
}
