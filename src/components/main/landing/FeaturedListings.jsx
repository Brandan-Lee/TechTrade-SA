import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Zap, Lock, Loader2, Star } from "lucide-react";
import ListingCard from "../market/ListingCard";
import { useAuth } from "../../AuthContext.jsx";
import { apiFetch } from "../../../lib/api";

export default function FeaturedListings() {
	const { user, isLoading: isAuthLoading } = useAuth();
	const [listings, setListings] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState(null);

	useEffect(() => {
		if (!user) {
			setListings([]);
			return;
		}

		const getNearbyItems = async () => {
			setIsLoading(true);
			setMessage(null);
			try {
				const response = await apiFetch(
					`/marketplace/get_featured_listings.php?province=${encodeURIComponent(user.province)}`,
				);
				if (response.ok) {
					const data = await response.json();
					setListings(Array.isArray(data) ? data : []);
				} else {
					setMessage("We could not load the featured items right now.");
				}
			} catch (err) {
				setMessage("There was a connection issue. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		getNearbyItems();
	}, [user]);

	const containerSettings = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const cardSettings = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	};

	if (isAuthLoading) {
		return (
			<div className="w-full bg-[#050505] py-32 flex flex-col items-center justify-center gap-3 text-slate-500 text-xs uppercase tracking-widest">
				<Loader2 className="animate-spin text-fuchsia-500" size={24} />
				Loading your information...
			</div>
		);
	}

	return (
		<section className="w-full bg-[#050505] py-20 px-4 relative overflow-hidden border-y border-fuchsia-500/10">
			<div className="max-w-[1440px] mx-auto relative z-10">
				{/* Header */}
				<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="space-y-4">
						<h2 className="text-white text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
							Featured{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500">
								Items
							</span>
						</h2>
						<p className="max-w-2xl text-slate-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em] leading-relaxed flex items-center gap-1.5">
							<MapPin size={14} className="text-fuchsia-500 animate-pulse" />
							{user
								? `Top-rated deals in your area: ${user.province}`
								: "Premium marketplace items"}
						</p>
					</div>

					<div className="hidden xl:flex items-center gap-8 border-l border-white/10 pl-8">
						<div>
							<span className="block text-white text-2xl font-black">
								{user ? listings.length : "0"}
							</span>
							<span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
								Nearby Matches
							</span>
						</div>
						<div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
							<Zap size={20} className="text-fuchsia-500" />
						</div>
					</div>
				</div>

				{/* User View State */}
				{!user ? (
					<div className="w-full min-h-[220px] border border-dashed border-white/10 bg-white/[0.02] rounded-3xl flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
						<div className="w-14 h-14 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-4">
							<Lock size={24} />
						</div>
						<h3 className="text-slate-200 text-base font-black uppercase tracking-tight mb-2">
							Login Required
						</h3>
						<p className="text-slate-500 text-xs max-w-sm uppercase tracking-wide leading-relaxed">
							Please sign in to view items featured in your area.
						</p>
					</div>
				) : isLoading ? (
					<div className="w-full flex py-24 flex-col items-center justify-center gap-3 text-slate-500 text-xs uppercase tracking-widest">
						<Loader2 className="animate-spin text-fuchsia-500" size={24} />
						Finding items near you...
					</div>
				) : message ? (
					<div className="text-center text-xs text-red-400 p-12 border border-red-500/10 rounded-2xl bg-red-500/5 max-w-md mx-auto uppercase">
						{message}
					</div>
				) : listings.length === 0 ? (
					<div className="text-center text-xs text-slate-500 p-16 border border-white/5 rounded-2xl max-w-md mx-auto uppercase tracking-wider">
						No featured items currently available in your area.
					</div>
				) : (
					<motion.div
						variants={containerSettings}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
					>
						{listings.map((item) => (
							<motion.div key={item.id} variants={cardSettings}>
								<ListingCard {...item} isFeatured={true} />
							</motion.div>
						))}
					</motion.div>
				)}
			</div>
		</section>
	);
}
