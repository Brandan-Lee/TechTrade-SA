import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Loader2, Tag } from "lucide-react";
import { IncomingOfferCard } from "@/features/profile";
import { apiFetch, mediaUrl } from "@/lib/api";
import { formatZarFromCents } from "@/utils/currency";

export default function MyOffers() {
	const [groupedOffers, setGroupedOffers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchAndGroupOffers() {
			try {
				setIsLoading(true);
				setError(null);

				const response = await apiFetch("/offers/get_incoming_offers.php", {
					method: "GET",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data.error || "Failed to load offers from the server.",
					);
				}

				if (isMounted && data.offers) {
					const groups = data.offers.reduce((acc, offer) => {
						const id = offer.listing_id;
						if (!acc[id]) {
							acc[id] = {
								listingId: id,
								listingTitle: offer.listing_title,
								listingImage: offer.listing_image,
								originalPrice: offer.listing_price_cents,
								offersList: [],
							};
						}
						acc[id].offersList.push(offer);
						return acc;
					}, {});

					setGroupedOffers(Object.values(groups));
				}
			} catch (err) {
				if (isMounted) {
					setError(
						err.message ||
							"An unexpected error occurred while loading your offers.",
					);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		fetchAndGroupOffers();
		return () => {
			isMounted = false;
		};
	}, []);

	const formatCurrency = (cents) => {
		return formatZarFromCents(cents, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});
	};

	const getTimeAgo = (dateString) => {
		const now = new Date();
		const past = new Date(dateString.replace(/-/g, "/"));
		const diffMs = now.getTime() - past.getTime();

		const diffMins = Math.floor(diffMs / 60000);
		if (diffMins < 60) return `${diffMins}m ago`;

		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24) return `${diffHours}h ago`;

		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays}d ago`;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="bg-base-100 text-slate-300 pb-20 relative overflow-hidden font-mono selection:bg-secondary/30 selection:text-white text-xs sm:text-sm md:text-base"
		>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
			<div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

			<header className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-6 border-b border-white/5 relative z-10">
				<h1 className="text-white text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">
					Your Active Items & Offers
				</h1>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-8 relative z-10">
				{isLoading ? (
					<div className="py-20 flex flex-col items-center justify-center gap-3">
						<Loader2 className="w-8 h-8 text-secondary animate-spin" />
						<p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-bold animate-pulse">
							Loading Offers...
						</p>
					</div>
				) : error ? (
					<div className="py-12 border border-red-500/20 bg-red-950/10 rounded-2xl text-center max-w-xl mx-auto p-6 font-bold">
						<p className="text-red-400 text-[11px] sm:text-xs uppercase tracking-wider">
							Error: {error}
						</p>
					</div>
				) : groupedOffers.length > 0 ? (
					<div className="space-y-10">
						{groupedOffers.map((group) => {
							const displayImage = group.listingImage
								? mediaUrl(group.listingImage)
								: null;

							return (
								<section key={group.listingId} className="space-y-3">
									<div className="flex items-center justify-between gap-4 bg-base-200 border border-white/5 rounded-xl p-4 shadow-md">
										<div className="flex items-center gap-3 min-w-0">
											<img
												src={displayImage}
												alt={group.listingTitle}
												className="w-12 h-12 rounded object-cover border border-white/10"
											/>
											<div className="min-w-0">
												<h2 className="text-white text-xs sm:text-sm md:text-base font-bold uppercase tracking-wide truncate">
													{group.listingTitle}
												</h2>
												<p className="text-slate-500 text-[11px] sm:text-xs font-medium">
													Original Price: {formatCurrency(group.originalPrice)}
												</p>
											</div>
										</div>
										<div className="shrink-0 text-right">
											<span className="inline-flex items-center gap-1.5 bg-secondary/10 border border-secondary/20 text-secondary text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
												<Tag size={10} /> {group.offersList.length}{" "}
												{group.offersList.length === 1 ? "Offer" : "Offers"}
											</span>
										</div>
									</div>

									<div className="space-y-3 pl-2 sm:pl-6 border-l border-white/5">
										{group.offersList.map((offer) => {
											const buyerAvatar = offer.buyer_avatar
												? mediaUrl(offer.buyer_avatar)
												: `https://ui-avatars.com/api/?name=${encodeURIComponent(offer.buyer_name || "Buyer")}&background=581c87&color=fff`;

											return (
												<motion.div
													key={offer.id}
													layout
													initial={{ opacity: 0, scale: 0.99 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ duration: 0.2 }}
												>
													<IncomingOfferCard
														id={offer.id}
														offerAmount={formatCurrency(offer.amount_cents)}
														buyer={{
															name: offer.buyer_name,
															avatar: buyerAvatar,
														}}
														message={
															offer.message ||
															"No message provided by the buyer."
														}
														timeAgo={getTimeAgo(offer.created_at)}
														parent_offer_id={offer.parent_offer_id}
													/>
												</motion.div>
											);
										})}
									</div>
								</section>
							);
						})}
					</div>
				) : (
					<div className="py-20 border border-dashed border-white/10 rounded-2xl bg-base-200/40 text-center flex flex-col items-center justify-center p-6 max-w-xl mx-auto mt-12">
						<div className="w-12 h-12 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-400/80 mb-4">
							<ShieldAlert size={20} />
						</div>
						<h2 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-1">
							You have no offers yet
						</h2>
					</div>
				)}
			</main>
		</motion.div>
	);
}
