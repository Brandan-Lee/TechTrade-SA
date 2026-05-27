import {
	Calendar1,
	MapPin,
	Quote,
	ShieldCheck,
	Trophy,
	Loader2,
	AlertTriangle,
	User,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import StatCard from "../../components/main/profile/StatCard";
import CyberActionButton from "../../components/ui/CyberActionButton";
import ActiveListingCard from "../../components/main/profile/ActiveListingCard";
import ReviewCard from "../../components/main/profile/ReviewCard";
import TradeHistoryCard from "../../components/main/profile/TradeHistoryCard";
import { useAuth } from "../../components/AuthContext";
import { apiFetch } from "../../lib/api";

export default function Profile() {
	const { userId: routeUserId } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const { user: authUser, isLoading: authLoading, logout } = useAuth();

	const isEditRoute = location.pathname === "/profile/edit";

	const [activeTab, setActiveTab] = useState("active");
	const [profile, setProfile] = useState(null);
	const [listings, setListings] = useState([]);
	const [reviews, setReviews] = useState([]);
	const [trades, setTrades] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const profileUserId = isEditRoute
		? authUser
			? String(authUser.id)
			: null
		: routeUserId || (authUser ? String(authUser.id) : null);
	const isOwnProfile =
		authUser && profileUserId && String(authUser.id) === String(profileUserId);

	const isSeller =
		profile?.reg_type === "seller" || profile?.reg_type === "both";
	const isBuyer = profile?.reg_type === "buyer";

	const loadTrades = async () => {
		try {
			const response = await apiFetch(
				`/marketplace/get_user_trades.php?id=${encodeURIComponent(profileUserId)}`,
			);
			const data = await response.json();
			if (response.ok) setTrades(data.trades || []);
		} catch (err) {
			console.error("Failed to load trades", err);
		}
	};

	useEffect(() => {
		if (authLoading) return;
		if (!profileUserId) {
			setLoading(false);
			setError(
				"Log in to view your profile, or open a seller profile from a listing.",
			);
			return;
		}

		const loadProfile = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await apiFetch(
					`/marketplace/get_user_profile.php?id=${encodeURIComponent(profileUserId)}`,
				);
				const data = await response.json();
				if (!response.ok)
					throw new Error(data.error || "Could not load this profile.");

				setProfile(data.user);
				setListings(Array.isArray(data.listings) ? data.listings : []);
				setReviews(Array.isArray(data.reviews) ? data.reviews : []);
				setActiveTab(data.user.reg_type === "buyer" ? "history" : "active");
			} catch (err) {
				setProfile(null);
				setError(err.message || "Failed to load profile.");
			} finally {
				setLoading(false);
			}
		};
		loadProfile();
	}, [profileUserId, authLoading]);

	useEffect(() => {
		if (isEditRoute || authLoading) return;
		if (!routeUserId && authUser) {
			navigate(`/profile/${authUser.id}`, { replace: true });
		}
	}, [routeUserId, authUser, authLoading, navigate, isEditRoute]);

	const renderRegistrationBadge = () => {
		if (!profile?.reg_type) return null;

		const badges = {
			buyer: {
				label: "BUYER",
				classes:
					"border-cyan-500/30 bg-cyan-500/[0.04] text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]",
			},
			seller: {
				label: "SELLER",
				classes:
					"border-fuchsia-500/30 bg-fuchsia-500/[0.04] text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.1)]",
			},
			both: {
				label: "BOTH SELLER AND BUYER",
				classes:
					"border-violet-500/40 bg-violet-500/[0.05] text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]",
			},
		};

		const design = badges[profile.reg_type] || badges.buyer;

		return (
			<div
				className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase font-mono tracking-widest ${design.classes}`}
			>
				<User size={10} />
				<span>{design.label}</span>
			</div>
		);
	};

	const handleDeleteProfile = async () => {
		const confirmed = window.confirm(
			"CRITICAL WARNING:\n\nAre you sure you want to delete this profile? This action is permanent and will withdraw all active listings from circulation.",
		);

		if (!confirmed) return;

		setIsDeleting(true);
		try {
			const response = await apiFetch("/authentication/delete_user.php", {
				method: "POST",
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					data.message || "Network system rejected profile removal execution.",
				);
			}

			alert(data.message || "Account successfully wiped.");

			if (typeof logout === "function") {
				await logout();
			}
			navigate("/marketplace", { replace: true });
		} catch (err) {
			console.error("Account termination workflow fault:", err);
			alert(`TERMINATION FAULT: ${err.message}`);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleReport = () => {
		navigate(`/report-user/${profile.id}`, { state: { profile } });
	};

	const avatarSrc =
		profile?.avatar ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "User")}&background=581c87&color=fff`;

	if (loading) {
		return (
			<div className="min-h-screen bg-[#050506] flex items-center justify-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
				<Loader2 className="animate-spin text-fuchsia-500" size={24} />
				Loading profile...
			</div>
		);
	}

	if (error || !profile) {
		return (
			<div className="min-h-screen bg-[#050506] flex items-center justify-center p-4 font-mono">
				<div className="max-w-md w-full border border-red-500/10 bg-red-500/5 p-6 rounded-2xl text-center">
					<AlertTriangle size={32} className="mx-auto text-red-500 mb-3" />
					<p className="text-red-400 text-sm mb-4">
						{error || "Profile unavailable."}
					</p>
					<Link
						to="/marketplace"
						className="text-fuchsia-400 text-xs uppercase tracking-widest hover:underline"
					>
						Return to marketplace
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[#050506] text-slate-300 pb-12 relative overflow-hidden">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

			<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
				User{" "}
				<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
					Profile
				</span>
			</h1>

			<section className="w-full bg-[#0c0c0e]/80 border-b border-white/5 pt-14 pb-16 px-4 flex flex-col items-center relative z-10 backdrop-blur-md">
				<div className="relative">
					<div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-xl animate-pulse" />
					<div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-fuchsia-500/40 p-1 bg-black shadow-[0_0_30px_rgba(217,70,239,0.15)]">
						<img
							src={avatarSrc}
							alt={profile.fullName}
							className="w-full h-full rounded-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500"
						/>
					</div>
					<div className="absolute bottom-1 right-1 bg-black border border-fuchsia-500 p-2 rounded-full shadow-lg shadow-fuchsia-500/20 text-fuchsia-400">
						<ShieldCheck size={16} />
					</div>
				</div>

				<div className="mt-6 text-center space-y-2.5">
					<h1 className="text-white text-xl md:text-2xl lg:text-3xl font-black uppercase font-mono tracking-tight leading-none">
						{profile.fullName}
					</h1>

					<div className="flex flex-col items-center gap-2">
						{renderRegistrationBadge()}
						<div className="flex items-center justify-center gap-1 text-slate-500 font-mono text-xs uppercase tracking-widest">
							<MapPin size={12} className="text-fuchsia-500/60" />
							<span>{profile.province}</span>
						</div>
					</div>
				</div>

				<div className="mt-8 w-full max-w-sm bg-black border border-white/10 p-3.5 rounded-xl shadow-2xl flex items-center justify-between font-mono relative overflow-hidden">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-lg flex items-center justify-center text-fuchsia-400">
							<Trophy size={16} />
						</div>
						<div>
							<p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
								Trust Integrity
							</p>
							<p className="text-base font-black text-white tracking-tight">
								{profile.trust_score} / 5.0
							</p>
						</div>
					</div>
					<div className="bg-fuchsia-500/10 border border-fuchsia-500/30 px-2.5 py-1 rounded text-fuchsia-400 font-bold text-[10px] md:text-xs tracking-wider">
						{profile.trade_count} TRADES
					</div>
				</div>
			</section>

			<main className="max-w-4xl w-full mx-auto px-4 mt-8 flex flex-col gap-8 relative z-10">
				<div className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
					<div
						className="flex bg-black border-b border-white/5 font-mono"
						role="tablist"
					>
						{isSeller && (
							<>
								<button
									onClick={() => setActiveTab("active")}
									className={`flex-1 py-4 font-black text-xs md:text-sm uppercase transition-all ${activeTab === "active" ? "text-fuchsia-400 bg-white/[0.02] border-b-2 border-fuchsia-500" : "text-slate-600"}`}
								>
									Active Listings
								</button>
								<button
									onClick={() => {
										setActiveTab("history");
										if (trades.length === 0) loadTrades();
									}}
									className={`flex-1 py-4 font-black text-xs md:text-sm uppercase transition-all ${activeTab === "history" ? "text-fuchsia-400 bg-white/[0.02] border-b-2 border-fuchsia-500" : "text-slate-600"}`}
								>
									Trade History
								</button>
							</>
						)}

						{isBuyer && (
							<button
								onClick={() => {
									setActiveTab("history");
									if (trades.length === 0) loadTrades();
								}}
								className={`flex-1 py-4 font-black text-xs md:text-sm uppercase transition-all ${activeTab === "history" ? "text-fuchsia-400 bg-white/[0.02] border-b-2 border-fuchsia-500" : "text-slate-600"}`}
							>
								Trade History
							</button>
						)}
					</div>

					<div className="p-4 md:p-6 flex flex-col gap-4 bg-transparent">
						{activeTab === "active" &&
							isSeller &&
							(listings.length > 0 ? (
								listings.map((item) => (
									<ActiveListingCard key={item.id} {...item} />
								))
							) : (
								<p className="text-center text-slate-500 text-xs py-8">
									No active listings.
								</p>
							))}
						{activeTab === "history" && isBuyer && (
							<div className="space-y-4">
								{trades.length > 0 ? (
									trades.map((t) => <TradeHistoryCard key={t.id} {...t} />)
								) : (
									<p className="text-center text-slate-500 text-xs py-8">
										No trade history found.
									</p>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Profile Action Buttons */}
				{!isOwnProfile && (
					<div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
						<button
							onClick={handleReport}
							className="flex-1 h-12 rounded-xl border border-rose-500/20 bg-rose-500/[0.03] text-rose-400 hover:bg-rose-500 hover:text-white font-mono font-black text-xs uppercase tracking-widest transition-all"
						>
							Report This User
						</button>
						<button
							onClick={() => navigate(`/review/user/${profile.id}`)}
							className="flex-1 h-12 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/[0.03] text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white font-mono font-black text-xs uppercase tracking-widest transition-all"
						>
							Leave A Review
						</button>
					</div>
				)}

				{isOwnProfile && (
					<div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-white/5 pt-6">
						<div className="w-full max-w-xs">
							<CyberActionButton
								label="EDIT PROFILE"
								className="w-full"
								onClick={() => navigate("/profile/edit")}
							/>
						</div>

						<button
							type="button"
							disabled={isDeleting}
							aria-label="Permanently terminate this network identity profile account link"
							className="w-full max-w-xs h-12 md:h-14 rounded-xl border border-rose-500/30 bg-rose-500/[0.02] 
                text-rose-400 font-mono font-black text-xs tracking-widest hover:bg-rose-500 
                hover:text-white hover:border-rose-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.25)] transition-all 
                duration-300 uppercase active:scale-95 outline-none focus:ring-1 focus:ring-rose-500/40
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							onClick={handleDeleteProfile}
						>
							{isDeleting ? (
								<>
									<Loader2 className="animate-spin text-white" size={14} />
									<span>SHREDDING DATA...</span>
								</>
							) : (
								<span>Delete Profile</span>
							)}
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
