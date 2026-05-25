import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Terminal, Zap, Lock, Loader2, MapPin } from "lucide-react";
import ListingCard from "../../ListingCard.jsx";
import { useAuth } from "../../AuthContext.jsx";
import { apiFetch } from "../../../lib/api";

export default function FeaturedListings() {
	const { user, isLoading: isAuthLoading } = useAuth();
	const [listings, setListings] = useState([]);
	const [isListingsLoading, setIsListingsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!user) {
			setListings([]);
			return;
		}

		const fetchLocalFeatured = async () => {
			setIsListingsLoading(true);
			setError(null);
			try {
				const response = await apiFetch(
					`/marketplace/get_featured_listings.php?province=${encodeURIComponent(user.province)}`,
				);
				if (response.ok) {
					const data = await response.json();
					setListings(Array.isArray(data) ? data : []);
				} else {
					setError("Unable to load featured hardware listings at this time.");
				}
			} catch (err) {
				console.error("Connection error:", err);
				setError("A network connection error occurred. Please try again.");
			} finally {
				setIsListingsLoading(false);
			}
		};

		fetchLocalFeatured();
	}, [user]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const cardVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	};

	if (isAuthLoading) {
		return (
			<div className="w-full bg-[#050505] py-32 flex flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
				<Loader2 className="animate-spin text-fuchsia-500" size={24} />
				Loading profile details...
			</div>
		);
	}

	return (
		<section className="w-full bg-[#050505] py-20 px-4 relative overflow-hidden border-y border-fuchsia-500/10">
			<div className="absolute top-0 right-0 p-8 opacity-20 hidden lg:block">
				<Terminal size={300} className="text-fuchsia-500/10" />
			</div>

			<div className="max-w-[1440px] mx-auto relative z-10">
				{/* Header */}
				<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="space-y-4">
						<h2 className="text-white text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
							Featured{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500">
								Hardware
							</span>
						</h2>
						<p className="max-w-2xl text-slate-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em] leading-relaxed flex items-center gap-1.5">
							<MapPin size={14} className="text-fuchsia-500 animate-pulse" />
							{user
								? `Hand-picked premium deals in your area: ${user.province}`
								: "Premium localized marketplace hardware"}
						</p>
					</div>

					<div className="hidden xl:flex items-center gap-8 border-l border-white/10 pl-8">
						<div>
							<span className="block text-white font-mono text-2xl font-black">
								{user ? listings.length : "0"}
							</span>
							<span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
								Local Matches
							</span>
						</div>
						<div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
							<Zap size={20} className="text-fuchsia-500" />
						</div>
					</div>
				</div>

				{/* Guest User Information View */}
				{!user ? (
					<div className="w-full min-h-[220px] border border-dashed border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto transition-colors">
						<div className="w-14 h-14 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-4 shadow-[0_0_15px_rgba(240,70,250,0.1)]">
							<Lock size={24} />
						</div>
						<h3 className="text-slate-200 text-base font-black uppercase tracking-tight mb-2">
							Feature Locked
						</h3>
						<p className="text-slate-500 text-xs font-mono max-w-sm uppercase tracking-wide leading-relaxed">
							This feature is only available when you are logged in.
						</p>
					</div>
				) : isListingsLoading ? (
					<div className="w-full flex py-24 flex-col items-center justify-center gap-3 text-slate-500 font-mono text-xs uppercase tracking-widest">
						<Loader2 className="animate-spin text-fuchsia-500" size={24} />
						Searching local listings...
					</div>
				) : error ? (
					<div className="text-center font-mono text-xs text-red-400 p-12 border border-red-500/10 rounded-2xl bg-red-500/5 max-w-md mx-auto uppercase">
						{error}
					</div>
				) : listings.length === 0 ? (
					<div className="text-center font-mono text-xs text-slate-500 p-16 border border-white/5 rounded-2xl max-w-md mx-auto uppercase tracking-wider">
						No featured items found in your location.
					</div>
				) : (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
					>
						{listings.map((item) => (
							<motion.div key={item.id} variants={cardVariants}>
								<ListingCard {...item} isFeatured={true} />
							</motion.div>
						))}
					</motion.div>
				)}

				<div className="mt-20 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent flex justify-center">
					<div className="bg-[#050505] px-4 -mt-2">
						<Cpu size={16} className="text-fuchsia-900" />
					</div>
				</div>
			</div>
		</section>
	);
}