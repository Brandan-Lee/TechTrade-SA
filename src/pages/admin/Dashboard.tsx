import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { DashBoardCard } from "@/features/admin";
import { formatZarFromCents } from "@/utils/currency";
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
					? formatZarFromCents(payments.total_amount_cents, {
							minimumFractionDigits: 0,
						})
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
				console.error("Failed to load dashboard statistics:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="bg-base-100 p-4 sm:p-6 md:p-8 text-white selection:bg-primary selection:text-primary-content">
			<header className="border-b border-purple-500/20 pb-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						TechTrade ZA{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-violet-500">
							Stats
						</span>
					</h1>
				</div>
			</header>

			<main className="space-y-8 md:space-y-10">
				<section aria-labelledby="sec-marketplace">
					<h2
						id="sec-marketplace"
						className="text-xs sm:text-sm md:text-base font-bold text-primary mb-4 tracking-widest uppercase border-l-2 border-primary pl-2"
					>
						Marketplace Activity & Sales
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						<DashBoardCard
							label="Total Escrow in Vault"
							value={data.totalEscrowValue}
							icon={Landmark}
							colorClass="text-emerald-400 text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Active Listings"
							value={data.totalListings}
							icon={ShoppingBag}
							colorClass="text-primary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Active Transactions"
							value={data.totalTransactions}
							icon={Activity}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Offers Active"
							value={data.totalOffers}
							icon={FileText}
							colorClass="text-accent text-sm sm:text-base md:text-lg"
						/>
					</div>
				</section>
				<section aria-labelledby="sec-community">
					<h2
						id="sec-community"
						className="text-xs sm:text-sm md:text-base font-bold text-secondary mb-4 tracking-widest uppercase border-l-2 border-secondary pl-2"
					>
						User Profiles & Security
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						<DashBoardCard
							label="Total Members"
							value={data.totalUsers}
							icon={Users}
							colorClass="text-primary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Avg Member Rating"
							value={data.avgTrustScore}
							icon={Percent}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Active Signed-In Devices"
							value={data.currentSessions}
							icon={Shield}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Active Verification Codes"
							value={data.pendingOTPs}
							icon={Key}
							colorClass="text-accent text-sm sm:text-base md:text-lg"
						/>
					</div>
				</section>

				<section aria-labelledby="sec-moderation">
					<h2
						id="sec-moderation"
						className="text-xs sm:text-sm md:text-base font-bold text-accent mb-4 tracking-widest uppercase border-l-2 border-accent pl-2"
					>
						Complaints & Help Desk
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						<DashBoardCard
							label="Total Active Order Disputes"
							value={data.totalDisputes}
							icon={AlertOctagon}
							colorClass="text-red-500 font-bold animate-pulse text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Flagged User Profiles"
							value={data.totalUserReports}
							icon={Users}
							colorClass="text-rose-400 text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Flagged Listings"
							value={data.totalListingReports}
							icon={ShoppingBag}
							colorClass="text-rose-300 text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Flagged Reviews"
							value={data.totalReviewReports}
							icon={FileText}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Help Messages Received"
							value={data.totalIncomingMessages}
							icon={MessageSquare}
							colorClass="text-accent text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Custom User Builds"
							value={data.totalUserBuilds}
							icon={Layout}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
					</div>
				</section>
				<section aria-labelledby="sec-hardware">
					<h2
						id="sec-hardware"
						className="text-xs sm:text-sm md:text-base font-bold text-primary mb-4 tracking-widest uppercase border-l-2 border-primary pl-2"
					>
						Hardware Catalogue Directory
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
						<DashBoardCard
							label="Total Hardware Stored in Database"
							value={data.totalHardwareCount}
							icon={Layers}
							colorClass="text-primary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Total Categories"
							value={data.totalCategories}
							icon={Box}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Graphics Cards"
							value={data.totalGPUs}
							icon={Cpu}
							colorClass="text-accent text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Processors"
							value={data.totalCPUs}
							icon={Cpu}
							colorClass="text-primary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Motherboards"
							value={data.totalMotherboards}
							icon={Radio}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Power Supply Units"
							value={data.totalPSUs}
							icon={Shield}
							colorClass="text-accent text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="System Memory Sticks"
							value={data.totalRAM}
							icon={Layers}
							colorClass="text-primary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Liquid System Coolers"
							value={data.totalAIOs}
							icon={Disc}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Air System Coolers"
							value={data.totalAirCoolers}
							icon={Disc}
							colorClass="text-accent text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Case Cooling Fans"
							value={data.totalCaseFans}
							icon={Radio}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Solid State Drives"
							value={data.totalSSDs}
							icon={HardDrive}
							colorClass="text-primary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Hard Disk Drives"
							value={data.totalHDDs}
							icon={HardDrive}
							colorClass="text-secondary text-sm sm:text-base md:text-lg"
						/>
						<DashBoardCard
							label="Computer PC Cases"
							value={data.totalPCCases}
							icon={Box}
							colorClass="text-accent text-sm sm:text-base md:text-lg"
						/>
					</div>
				</section>
			</main>
		</div>
	);
}
