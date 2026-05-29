import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	ChevronRight,
	Clock,
	Eye,
	Info,
	MapPin,
	ShieldCheck,
	Star,
	Cpu,
	Coins,
	AlertTriangle,
	Loader2,
	Edit,
	Trash2,
	Lock,
} from "lucide-react";
import CyberActionButton from "../../components/ui/CyberActionButton";
import AuthInput from "../../components/ui/AuthInput";
import AlternateButton from "../../components/ui/AlternateButton";
import ActiveListingCard from "../../components/main/profile/ActiveListingCard";
import { apiFetch, mediaUrl } from "../../lib/api";
import { useAuth } from "../../components/AuthContext";

export default function ViewListing() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [listingData, setListingData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [offerValue, setOfferValue] = useState("");
	const [buyerNote, setBuyerNote] = useState("");
	const [activeImg, setActiveImg] = useState(0);

	const [submittingOffer, setSubmittingOffer] = useState(false);
	const [offerFeedback, setOfferFeedback] = useState({ type: "", message: "" });
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	useEffect(() => {
		if (!id) {
			setLoading(false);
			setError("No listing ID was provided.");
			return;
		}

		const fetchListingDetails = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await apiFetch(
					`/listings/get_listing.php?id=${encodeURIComponent(id)}`,
				);

				if (response.ok) {
					const data = await response.json();
					setListingData(data);
					setActiveImg(0);
				} else {
					const errData = await response.json().catch(() => ({}));
					setError(errData.error || "Unable to load listing details.");
				}
			} catch (err) {
				console.error("Connection error:", err);
				setError(
					"A network error occurred while loading the listing. Please try again.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchListingDetails();
	}, [id]);

	const formatCurrency = (cents) => {
		if (!cents) return "R0";
		return new Intl.NumberFormat("en-ZA", {
			style: "currency",
			currency: "ZAR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(cents / 100);
	};

	const formatRelativeTime = (datetimeStr) => {
		if (!datetimeStr) return "Unknown date";
		const uploadDate = new Date(datetimeStr.replace(/-/g, "/"));
		const now = new Date();
		const diffTime = Math.abs(now - uploadDate);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Uploaded today";
		if (diffDays === 1) return "Uploaded 1 day ago";
		return `Uploaded ${diffDays} days ago`;
	};

	const handleOfferSubmission = async (e) => {
		e.preventDefault();
		if (!offerValue || parseFloat(offerValue) <= 0) {
			setOfferFeedback({
				type: "error",
				message: "Please enter a valid offer amount.",
			});
			return;
		}

		setSubmittingOffer(true);
		setOfferFeedback({ type: "", message: "" });

		try {
			const response = await apiFetch("/listings/create_offer.php", {
				method: "POST",
				body: JSON.stringify({
					listing_id: parseInt(id, 10),
					amount: parseFloat(offerValue),
					message: buyerNote,
				}),
			});

			const result = await response.json().catch(() => ({}));

			if (response.ok) {
				setOfferFeedback({
					type: "success",
					message: "Your offer has been submitted successfully.",
				});
				setOfferValue("");
				setBuyerNote("");

				const refresh = await apiFetch(
					`/listings/get_listing.php?id=${encodeURIComponent(id)}`,
				);
				if (refresh.ok) {
					const refreshed = await refresh.json();
					setListingData(refreshed);
					setTimeout(() => {
						navigate(-1);
					}, 1500);
				}
			} else {
				setOfferFeedback({
					type: "error",
					message:
						result.error ||
						"Could not submit offer. Please check your details and try again.",
				});
			}
		} catch (err) {
			console.error("Offer error:", err);
			setOfferFeedback({
				type: "error",
				message: "Network timeout. Unable to communicate with the server.",
			});
		} finally {
			setSubmittingOffer(false);
		}
	};

	const handleDeleteListing = async () => {
		setIsDeleting(true);
		try {
			const response = await apiFetch(
				`/listings/delete_listing.php?id=${encodeURIComponent(id)}`,
				{
					method: "DELETE",
				},
			);

			if (response.ok) {
				navigate("/marketplace");
			} else {
				const result = await response.json().catch(() => ({}));
				alert(
					result.error || "Failed to delete the listing. Please try again.",
				);
				setIsDeleting(false);
				setShowDeleteConfirm(false);
			}
		} catch (err) {
			console.error("Delete error:", err);
			alert("A network error occurred while attempting to delete the listing.");
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	const handleViewProfile = (sellerId) => {
		navigate(`/profile/${sellerId}`);
	};

	if (loading) {
		return (
			<div className="w-full min-h-screen bg-[#050505] py-32 flex flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
				<Loader2 className="animate-spin text-fuchsia-500" size={24} />
				Loading listing details...
			</div>
		);
	}

	if (error || !listingData) {
		return (
			<div className="min-h-screen bg-[#050506] flex items-center justify-center font-mono text-red-400 p-4">
				<div className="max-w-md w-full border border-red-500/10 bg-red-500/5 p-6 rounded-2xl text-center uppercase tracking-wider">
					<AlertTriangle size={32} className="mx-auto text-red-500 mb-3" />
					<h2 className="text-white font-black text-sm mb-2">
						Listing Unavailable
					</h2>
					<p className="text-xs text-slate-500 mb-4 normal-case tracking-normal">
						{error || "The requested listing could not be found."}
					</p>
					<AlternateButton
						label="RETURN TO MARKETPLACE"
						onClick={() => navigate("/marketplace")}
						className="w-full text-xs"
					/>
				</div>
			</div>
		);
	}

	const { listing, seller, matching_assets } = listingData;

	const handleReport = () => {
		navigate(`/listing-report/${id}`, {
			state: { listingTitle: listing.title ?? "" },
		});
	};

	const isOwner = user && String(user.id) === String(listing.seller_id);
	const isStaff = user && user.roleId && [3, 4].includes(Number(user.roleId));

	const isLocked =
		listing.status === "committed" || listing.status === "completed";

	const displayImages =
		listing.images && listing.images.length > 0
			? listing.images.map((img) => mediaUrl(img))
			: ["https://placehold.co/600x600/1e1b4b/38bdf8?text=NO_IMAGE_AVAILABLE"];

	const sellerAvatar =
		seller.avatar ||
		`https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name || "Seller")}&background=581c87&color=fff`;

	return (
		<div className="min-h-screen bg-[#050506] text-slate-300 pb-20 font-mono selection:bg-fuchsia-500/30 selection:text-white relative">
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

			<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
				View{" "}
				<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
					Listing
				</span>
			</h1>

			<main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
				<div className="lg:col-span-7 flex flex-col gap-6 min-w-0">
					<section
						aria-label="Product Media Gallery"
						className="flex flex-col gap-3"
					>
						<div className="aspect-square w-full bg-[#0c0c0e] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)] border border-white/10 relative group">
							<img
								src={displayImages[activeImg]}
								alt={listing.title}
								className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102 filter brightness-90 group-hover:brightness-100"
							/>

							<div className="absolute top-4 right-4 bg-[#050506]/80 border border-white/10 backdrop-blur-md px-3 py-1 rounded text-fuchsia-400 text-xs font-black tracking-widest">
								[{activeImg + 1} // {displayImages.length}]
							</div>

							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
								{displayImages.map((_, i) => (
									<div
										key={i}
										className={`h-1 transition-all duration-300 rounded ${
											activeImg === i ? "w-6 bg-fuchsia-500" : "bg-white/20 w-2"
										}`}
									/>
								))}
							</div>
						</div>

						{displayImages.length > 1 && (
							<div className="grid grid-cols-6 gap-2">
								{displayImages.map((img, i) => (
									<button
										key={i}
										onClick={() => setActiveImg(i)}
										aria-label={`Switch main asset view image item to ${i + 1}`}
										className={`aspect-square rounded-lg overflow-hidden border transition-all bg-[#0c0c0e] ${
											activeImg === i
												? "border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.2)] scale-95"
												: "border-white/10 opacity-40 hover:opacity-100"
										}`}
									>
										<img
											src={img}
											alt="Thumbnail item row view"
											className="w-full h-full object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</section>

					<section className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden">
						<div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500/50 via-transparent to-transparent" />

						<div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
							<div>
								<h1 className="text-white text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight leading-none break-words">
									{listing.title}
								</h1>
							</div>

							<div className="sm:text-right shrink-0 flex flex-col items-start sm:items-end gap-2">
								<p className="text-fuchsia-400 text-2xl sm:text-3xl font-black tracking-tight leading-none">
									{formatCurrency(listing.price_cents)}
								</p>
								<div className="flex gap-2.5">
									<span className="inline-block px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded text-emerald-400 text-[10px] font-black tracking-wider uppercase">
										{listing.condition_grade}
									</span>
									{isLocked && (
										<span className="inline-flex items-center gap-1 px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 rounded text-amber-400 text-[10px] font-black tracking-wider uppercase">
											<Lock size={10} /> {listing.status}
										</span>
									)}
								</div>
							</div>
						</div>

						<div className="flex gap-5 mb-6 text-slate-500 border-b border-white/5 pb-4 text-xs">
							<div className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
								<Eye size={12} className="text-fuchsia-500/60" />{" "}
								<span>{listing.view_count} VIEWS</span>
							</div>
							<div className="flex items-center gap-1.5 uppercase font-bold tracking-wider">
								<Clock size={12} className="text-fuchsia-500/60" />{" "}
								<span>{formatRelativeTime(listing.published_at)}</span>
							</div>
						</div>

						<div className="space-y-2">
							<h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
								<Info size={14} className="text-fuchsia-500" /> DESCRIPTION
							</h3>
							<p className="text-slate-300 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
								{listing.description}
							</p>
						</div>
					</section>

					{listing.specs && listing.specs.length > 0 && (
						<section className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl relative">
							<div className="flex items-center gap-2 mb-4">
								<Cpu size={16} className="text-fuchsia-400" />
								<h2 className="text-white text-sm sm:text-base font-black uppercase tracking-wider">
									TECHNICAL SPECIFICATIONS
								</h2>
							</div>

							<div className="border border-white/5 rounded-lg overflow-hidden bg-black/20">
								<table className="w-full border-collapse text-left text-xs sm:text-sm">
									<tbody>
										{listing.specs.map((spec, idx) => (
											<tr
												key={idx}
												className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
											>
												<td className="p-3 font-semibold text-slate-500 uppercase tracking-wider max-w-[120px] sm:max-w-none truncate">
													{spec.label}
												</td>
												<td className="p-3 font-bold text-white text-right break-words">
													{spec.value}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</section>
					)}
				</div>

				<div className="lg:col-span-5 flex flex-col gap-6">
					{isOwner && (
						<section
							aria-label="Owner Management Actions"
							className="bg-[#0c0c0e]/90 border border-fuchsia-500/30 rounded-xl p-5 md:p-6 shadow-xl relative bg-gradient-to-b from-fuchsia-950/10 to-transparent"
						>
							<h3 className="text-white text-xs sm:text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
								Listing Management
							</h3>

							{isLocked ? (
								/* Renders a lock notice block instead of edit buttons if status is locked */
								<div className="border border-amber-500/20 bg-amber-500/[0.02] text-amber-400 p-4 rounded-lg text-center text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-2">
									<Lock size={18} className="text-amber-500" />
									<span>
										This listing is {listing.status} and cannot be modified.
									</span>
								</div>
							) : !showDeleteConfirm ? (
								<div className="flex flex-col gap-3">
									<CyberActionButton
										onClick={() =>
											navigate(`/sell?listingId=${encodeURIComponent(id)}`)
										}
										label="UPDATE LISTING"
										className="w-full"
									>
										<Edit size={16} className="mr-2" />
									</CyberActionButton>

									<button
										onClick={() => setShowDeleteConfirm(true)}
										className="w-full h-[48px] rounded-lg border border-red-500/30 text-red-400 font-mono font-bold text-xs tracking-widest uppercase hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-2"
									>
										<Trash2 size={14} />
										<span>DELETE LISTING</span>
									</button>
								</div>
							) : (
								<div className="border border-red-500/30 bg-red-950/10 rounded-lg p-4 text-center">
									<p className="text-xs text-slate-300 font-bold uppercase tracking-wide mb-3">
										Are you sure you want to remove this listing from the
										marketplace?
									</p>
									<div className="flex gap-2">
										<button
											onClick={handleDeleteListing}
											disabled={isDeleting}
											className="flex-1 h-9 rounded bg-red-600 hover:bg-red-700 font-bold text-white text-[11px] uppercase tracking-wider transition-colors disabled:opacity-50"
										>
											{isDeleting ? "DELETING..." : "YES, DELETE"}
										</button>
										<button
											onClick={() => setShowDeleteConfirm(false)}
											disabled={isDeleting}
											className="flex-1 h-9 rounded bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-slate-300 text-[11px] uppercase tracking-wider transition-colors"
										>
											CANCEL
										</button>
									</div>
								</div>
							)}
						</section>
					)}

					<section
						aria-label="Seller Profile Details"
						className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl relative"
					>
						<div className="flex items-center gap-4 mb-6">
							<div className="relative w-12 h-12 rounded-lg border border-white/10 flex justify-center items-center overflow-hidden bg-fuchsia-950 shadow-md shrink-0">
								<img
									src={sellerAvatar}
									alt={seller.name}
									className="w-full h-full object-cover filter brightness-90"
								/>
							</div>
							<div className="min-w-0">
								<h4 className="font-black text-white text-sm sm:text-base uppercase tracking-wide truncate">
									{seller.name}{" "}
									{isOwner && (
										<span className="text-[10px] text-fuchsia-400 ml-1 font-normal lowercase italic">
											(you)
										</span>
									)}
								</h4>
								<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] mt-1 font-bold text-slate-500 uppercase tracking-widest">
									<span className="flex items-center gap-1 text-fuchsia-400">
										<ShieldCheck size={10} /> VERIFIED SELLER
									</span>
									<span className="flex items-center gap-1">
										<MapPin size={10} />{" "}
										{listing.location_province?.toUpperCase() ||
											"UNKNOWN LOCATION"}
									</span>
								</div>
							</div>
						</div>

						<CyberActionButton
							onClick={() => handleViewProfile(listing.seller_id)}
							label="VIEW PROFILE"
							className="w-full"
						/>

						<div className="grid grid-cols-3 gap-1 text-center bg-black/40 border border-white/5 rounded-lg py-3 mt-4">
							<div>
								<div className="flex items-center justify-center gap-1 text-white text-sm sm:text-base font-black">
									<Star size={12} className="text-amber-400 fill-amber-400" />{" "}
									{seller.trust_score}
								</div>
								<p className="text-[8px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">
									TRUST RATING
								</p>
							</div>
							<div>
								<p className="text-white text-sm sm:text-base font-black">
									{seller.trade_count}
								</p>
								<p className="text-[8px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">
									TRADES
								</p>
							</div>
							<div>
								<p className="text-emerald-400 text-sm sm:text-base font-black">
									100%
								</p>
								<p className="text-[8px] font-bold uppercase text-slate-600 tracking-wider mt-0.5">
									FEEDBACK
								</p>
							</div>
						</div>
					</section>

					{!isOwner &&
						!isStaff &&
						(isLocked ? (
							/* Blocks offers from buyers if the item status is already locked */
							<section className="bg-[#0c0c0e]/90 border border-amber-500/20 rounded-xl p-5 text-center text-amber-500 text-xs uppercase tracking-widest font-black flex flex-col items-center gap-2">
								<Lock size={16} />
								<span>This listing is no longer accepting offers.</span>
							</section>
						) : listing.accepts_offers !== false ? (
							<section
								aria-label="Make an Offer Interface"
								className="bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-5 md:p-6 shadow-xl relative"
							>
								<div className="flex items-center gap-2 mb-4">
									<Coins size={16} className="text-fuchsia-400" />
									<h3 className="text-white text-sm sm:text-base font-black uppercase tracking-wider">
										Make an Offer
									</h3>
								</div>

								<form
									onSubmit={handleOfferSubmission}
									className="flex flex-col gap-4"
								>
									<div className="relative flex flex-col gap-1.5">
										<label
											htmlFor="offer-amount"
											className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1"
										>
											Enter Offer Amount
										</label>
										<div className="relative">
											<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-black text-sm z-10">
												R
											</span>
											<AuthInput
												id="offer-amount"
												type="number"
												value={offerValue}
												onChange={(e) => setOfferValue(e.target.value)}
												className="pl-10 font-mono text-sm"
												placeholder="0.00"
												disabled={submittingOffer}
												required
											/>
										</div>
									</div>

									<div className="flex flex-col gap-1.5">
										<label
											htmlFor="buyer-note"
											className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-1"
										>
											Message for Seller
										</label>
										<textarea
											id="buyer-note"
											className="w-full h-32 bg-[#121214] rounded-lg p-3 border border-white/10 transition-all text-white focus:outline-none focus:border-fuchsia-500/50 text-xs sm:text-sm font-mono leading-relaxed shadow-inner placeholder:text-slate-700 resize-none"
											placeholder="Add a friendly note or conditions to your offer..."
											value={buyerNote}
											onChange={(e) => setBuyerNote(e.target.value)}
											disabled={submittingOffer}
										/>
									</div>

									{offerFeedback.message && (
										<div
											className={`text-[11px] font-bold p-2.5 rounded border uppercase text-center tracking-wider ${
												offerFeedback.type === "success"
													? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
													: "bg-red-500/10 border-red-500/30 text-red-400"
											}`}
										>
											{offerFeedback.message}
										</div>
									)}

									<CyberActionButton
										type="submit"
										label={submittingOffer ? "SUBMITTING..." : "SUBMIT OFFER"}
										className="mt-2"
										disabled={submittingOffer}
									/>
								</form>
							</section>
						) : (
							<section className="bg-[#0c0c0e]/90 border border-white/5 rounded-xl p-5 text-center text-slate-500 text-xs uppercase tracking-widest font-black">
								Offers are disabled for this listing.
							</section>
						))}

					{!isOwner && (
						<nav
							aria-label="Supplementary Listing Utilities"
							className="flex flex-col gap-3"
						>
							<button
								onClick={handleReport}
								className="w-full h-[48px] rounded-lg border border-red-500/20 text-red-400 font-mono font-bold text-xs tracking-widest uppercase hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-2 outline-none focus-visible:ring-1 focus-visible:ring-red-500"
							>
								<AlertTriangle size={14} />
								<span>REPORT THIS LISTING</span>
							</button>
						</nav>
					)}

					{/* Similar Items Loop */}
					{matching_assets && matching_assets.length > 0 && (
						<section
							aria-label="Similar Listings Section"
							className="flex flex-col gap-4 mt-2"
						>
							<h3 className="text-white text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-2">
								<span className="text-slate-400">SIMILAR ITEMS</span>
							</h3>
							<div className="flex flex-col gap-3">
								{matching_assets.map((asset) => (
									<div
										key={asset.id}
										onClick={() => navigate(`/view-listing/${asset.id}`)}
										className="cursor-pointer transition-transform duration-200 active:scale-98"
									>
										<ActiveListingCard
											title={asset.title}
											price={formatCurrency(asset.price_cents).replace("R", "")}
											condition={asset.condition_grade}
											time={formatRelativeTime(asset.published_at)}
											views={asset.view_count.toString()}
											image={asset.image}
										/>
									</div>
								))}
							</div>
						</section>
					)}
				</div>
			</main>
		</div>
	);
}
