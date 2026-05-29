import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	AlertCircle,
	ArrowLeft,
	Clock,
	MapPin,
	MessageSquare,
	ShieldCheck,
	Star,
	Loader2,
} from "lucide-react";
import CyberActionButton from "../../components/ui/CyberActionButton";
import AlternateButton from "../../components/ui/AlternateButton";
import { apiFetch, mediaUrl } from "../../lib/api";

const ManageOffer = ({ openCounterModal }) => {
	const { offerId } = useParams();
	const navigate = useNavigate();

	const [offerData, setOfferData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchOfferDetails() {
			try {
				setIsLoading(true);
				setError(null);

				const response = await apiFetch(
					`/marketplace/get_offer_details.php?offer_id=${offerId}`,
					{
						method: "GET",
					},
				);
				const resData = await response.json();

				if (!response.ok) {
					throw new Error(
						resData.error || "Failed to retrieve offer information.",
					);
				}

				if (isMounted && resData.data) {
					setOfferData(resData.data);
				}
			} catch (err) {
				if (isMounted) {
					setError(
						err.message ||
							"An unexpected error occurred while loading parameters.",
					);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		if (offerId) {
			fetchOfferDetails();
		} else {
			setError("Invalid offer identification provided.");
			setIsLoading(false);
		}

		return () => {
			isMounted = false;
		};
	}, [offerId]);

	const handleAcceptOffer = async () => {
		if (isProcessing) return;

		const userConfirmed = window.confirm(
			"Are you absolutely sure you want to accept this offer? This will commit the listing and cancel all other competing buyer offers.",
		);
		if (!userConfirmed) return;

		try {
			setIsProcessing(true);
			setError(null);

			const response = await apiFetch("/marketplace/accept_offer.php", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ offer_id: parseInt(offerId, 10) }),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.error || "Failed to process option action state update.",
				);
			}

			alert("Offer has been accepted. Listing status is updated!");
			navigate(`/whatsapp-ttl/${result.transactionId}`);
		} catch (err) {
			setError(
				err.message ||
					"An action error stopped execution components step path parameters.",
			);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleDeclineOffer = async () => {
		if (isProcessing) return;

		const userConfirmed = window.confirm(
			"Are you sure you want to decline this offer? This action is permanent.",
		);
		if (!userConfirmed) return;

		try {
			setIsProcessing(true);
			setError(null);

			const response = await apiFetch("/marketplace/decline_offer.php", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ offer_id: parseInt(offerId, 10) }),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to decline the offer.");
			}

			alert("Offer has been declined successfully.");
			navigate(-1);
		} catch (err) {
			setError(
				err.message || "An action error occurred while declining the offer.",
			);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleViewListing = (e) => {
		e.stopPropagation();
		navigate(`/view-listing/${offerData.listingId}`);
	};

	const formatCurrency = (cents) => {
		if (!cents) return "R 0";
		const rands = cents / 100;
		return new Intl.NumberFormat("en-ZA", {
			style: "currency",
			currency: "ZAR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		})
			.format(rands)
			.replace("ZAR", "R");
	};

	const getTimeAgo = (dateString) => {
		if (!dateString) return "Recently";
		const now = new Date();
		const past = new Date(dateString.replace(/-/g, "/"));
		const diffMs = now - past;

		const diffMins = Math.floor(diffMs / 60000);
		if (diffMins < 60) return `${diffMins}m ago`;

		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours}h ago`;

		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays}d ago`;
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#07050e] flex flex-col items-center justify-center gap-3 font-mono">
				<Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
				<p className="text-xs uppercase tracking-widest text-slate-500 font-bold animate-pulse">
					Retrieving Offer Summary...
				</p>
			</div>
		);
	}

	if (error || !offerData) {
		return (
			<div className="min-h-screen bg-[#07050e] flex flex-col items-center justify-center p-6 font-mono">
				<div className="py-8 border border-red-500/20 bg-red-950/10 rounded-2xl text-center max-w-xl w-full p-6 font-bold">
					<p className="text-red-400 text-xs uppercase tracking-wider mb-4">
						Error: {error || "No data available"}
					</p>
					<button
						onClick={() => navigate(-1)}
						className="text-xs text-purple-400 underline hover:text-purple-300"
					>
						Return back
					</button>
				</div>
			</div>
		);
	}

	const displayImage = offerData.listingImage
		? mediaUrl(offerData.listingImage)
		: "https://placehold.co/150x150?text=NO_IMAGE";

	const buyerAvatar = offerData.buyer.avatar
		? mediaUrl(offerData.buyer.avatar)
		: `https://ui-avatars.com/api/?name=${encodeURIComponent(offerData.buyer.name || "Buyer")}&background=581c87&color=fff`;

	return (
		<div className="bg-[#07050e] text-slate-300 font-mono pb-16 selection:bg-fuchsia-500/30 select-none">
			<div className="w-full max-w-5xl mx-auto pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8">
				<button
					onClick={() => navigate(-1)}
					className="group flex items-center gap-2 text-purple-400 hover:text-fuchsia-400 transition-colors duration-200 mb-6 text-xs sm:text-sm font-bold tracking-wider uppercase"
				>
					<ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
					<span>Back to Offers</span>
				</button>

				<h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black tracking-wider uppercase mb-8 border-b border-purple-500/10 pb-4 flex items-center gap-3">
					<span
						className="w-2 h-6 bg-fuchsia-500 rounded-sm"
						aria-hidden="true"
					/>
					Review Offer
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
					<div className="md:col-span-5 flex flex-col gap-6">
						<div className="p-4 sm:p-5 bg-[#0d091a] border border-purple-500/20 rounded-xl shadow-lg relative overflow-hidden group">
							<div
								className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"
								aria-hidden="true"
							/>
							<div className="flex items-center gap-4 relative z-10">
								<img
									src={displayImage}
									alt={`Product thumbnail for ${offerData.itemTitle}`}
									className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-purple-500/30 group-hover:border-fuchsia-500/50 transition-colors duration-300"
								/>
								<div className="min-w-0">
									<h2 className="text-white text-sm sm:text-base lg:text-lg font-black tracking-wide truncate">
										{offerData.itemTitle}
									</h2>
									<div className="flex items-center flex-wrap gap-2.5 mt-1.5">
										<span className="text-slate-500 text-xs line-through font-medium">
											{formatCurrency(offerData.originalPrice)}
										</span>
										<span className="bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold text-purple-400 uppercase tracking-widest">
											New Offer
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="p-6 bg-[#0d091a] border border-purple-500/20 rounded-xl shadow-lg flex flex-col items-center text-center relative group">
							<div className="relative mb-4">
								<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-b from-purple-500 to-fuchsia-500 shadow-md shadow-fuchsia-500/10">
									<img
										src={buyerAvatar}
										alt={`Profile avatar for ${offerData.buyer.name}`}
										className="w-full h-full rounded-full object-cover border-2 border-[#0d091a]"
									/>
								</div>
								<div
									className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-[#130a24] border border-emerald-500/40 rounded-full flex items-center justify-center shadow-lg"
									title="Identity Verified"
								>
									<ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
								</div>
							</div>

							<h3 className="text-white text-base sm:text-lg font-black tracking-wide mb-1">
								{offerData.buyer.name}
							</h3>

							<div className="flex items-center gap-2 mb-4">
								<div
									className="flex text-amber-400"
									aria-label={`Buyer rating: ${offerData.buyer.rating}`}
								>
									<Star
										className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current"
										aria-hidden="true"
									/>
								</div>
								<span className="text-slate-400 text-xs font-semibold">
									{offerData.buyer.rating} ({offerData.buyer.reviews} reviews)
								</span>
							</div>

							<div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">
								<span
									className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"
									aria-hidden="true"
								/>
								Verified Buyer
							</div>

							<div className="w-full pt-4 border-t border-purple-500/10 flex items-center justify-between text-xs text-slate-400 px-2">
								<div className="flex items-center gap-1">
									<MapPin
										size={12}
										className="text-purple-400"
										aria-hidden="true"
									/>
									<span className="font-medium">
										{offerData.buyer.location}
									</span>
								</div>
								<div className="text-right">
									<span className="opacity-60 text-[11px]">
										Joined {offerData.buyer.memberSince}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="md:col-span-7 flex flex-col gap-6">
						<div className="p-6 sm:p-8 bg-[#0a0615] border-2 border-purple-500/30 rounded-xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
							<div
								className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"
								aria-hidden="true"
							/>

							<span className="text-purple-400 text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-80">
								Offered Amount
							</span>

							<div className="text-fuchsia-400 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight my-1 drop-shadow-[0_0_12px_rgba(217,70,239,0.2)]">
								{formatCurrency(offerData.offerPrice)}
							</div>

							<div className="flex items-center gap-1.5 text-slate-500 text-[11px] sm:text-xs mt-2">
								<Clock
									className="w-3 h-3 text-purple-500/60"
									aria-hidden="true"
								/>
								<span>Received {getTimeAgo(offerData.timeReceived)}</span>
							</div>
						</div>

						<div className="w-full p-4 bg-[#0d091a] border border-purple-500/10 rounded-xl flex gap-3.5 shadow-md">
							<div
								className="w-8 h-8 rounded bg-purple-950/40 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-400"
								aria-hidden="true"
							>
								<MessageSquare size={14} />
							</div>
							<div className="min-w-0">
								<span className="text-slate-500 text-[10px] sm:text-xs font-black uppercase tracking-widest block mb-1">
									Message from Buyer
								</span>
								<p className="text-slate-300 text-xs sm:text-sm font-medium italic leading-relaxed">
									&ldquo;{offerData.buyer.note}&rdquo;
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-4 mt-2">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<CyberActionButton
									label={isProcessing ? "PROCESSING..." : "ACCEPT OFFER"}
									disabled={isProcessing}
									onClick={handleAcceptOffer}
									className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
								/>
								<AlternateButton
									label="SEND COUNTER OFFER"
									disabled={isProcessing}
									onClick={() => !isProcessing && openCounterModal(offerId)}
									className="border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/10 disabled:opacity-40"
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<AlternateButton
									onClick={handleViewListing}
									disabled={isProcessing}
									label="VIEW ORIGINAL LISTING"
									className="border-purple-500/20 text-slate-400 hover:text-white disabled:opacity-40"
								/>
								<CyberActionButton
									label={isProcessing ? "PROCESSING..." : "DECLINE OFFER"}
									disabled={isProcessing}
									onClick={handleDeclineOffer}
									className="bg-[#170a11] border border-rose-500/30 text-rose-400 hover:bg-rose-950/30 disabled:opacity-40"
								/>
							</div>

							<div className="p-4 bg-[#140b18] rounded-xl border border-fuchsia-500/20 flex gap-3.5 shadow-inner mt-4">
								<AlertCircle
									className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5 animate-pulse"
									aria-hidden="true"
								/>
								<p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed font-medium">
									Accepting this offer will secure the item for this transaction
									and safely move the funds into our{" "}
									<strong className="text-fuchsia-400 font-bold">
										Secure Escrow System
									</strong>{" "}
									while a protected chat window is opened.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageOffer;
