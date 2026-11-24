import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Zap, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ListingCard from "@/features/marketplace/components/ListingCard";
import {
	isListingSummary,
	type ListingSummary,
} from "@/features/marketplace/types/listing";
import { useAuth } from "@/features/auth";
import { apiFetch } from "@/lib/api";

export default function FeaturedListings() {
	const { user, isLoading: isAuthLoading } = useAuth();
	const [listings, setListings] = useState<ListingSummary[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

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
					`/marketplace/get_featured_listings.php?province=${encodeURIComponent(user.province ?? "")}`,
				);
				if (response.ok) {
					const data: unknown = await response.json();
					setListings(Array.isArray(data) ? data.filter(isListingSummary) : []);
				} else {
					setMessage("We could not load the featured items right now.");
				}
			} catch {
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
			<div className="w-full bg-base-100 py-32 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs uppercase tracking-widest">
				<Loader2 className="animate-spin text-primary" size={24} />
				Loading your information...
			</div>
		);
	}

	return (
		<section className="relative w-full overflow-hidden border-y border-white/[0.06] bg-base-200 px-4 py-20 text-sm">
			<div className="max-w-[1440px] mx-auto relative z-10">
				<header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="space-y-4">
						<h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
							Featured{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
								Items
							</span>
						</h2>
						<p className="flex max-w-2xl items-center gap-1.5 text-sm leading-relaxed text-slate-400">
							<MapPin size={15} className="text-primary" aria-hidden="true" />
							{user
								? `Top-rated deals in your area: ${user.province || "South Africa"}`
								: "Popular hardware from across the marketplace"}
						</p>
					</div>

					<div className="hidden xl:flex items-center gap-8 border-l border-white/10 pl-8">
						<div>
							<span className="block text-2xl font-semibold text-white">
								{user ? listings.length : "0"}
							</span>
							<span className="text-xs font-medium text-slate-400">
								Nearby Matches
							</span>
						</div>
						<div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
							<Zap size={20} className="text-primary" />
						</div>
					</div>
				</header>

				{!user ? (
					<div className="mx-auto flex min-h-[220px] w-full max-w-2xl flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">
						<h3 className="text-base font-semibold text-white">
							Explore the marketplace
						</h3>
						<p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
							Browse current listings now. Sign in to see recommendations
							tailored to your area.
						</p>
						<Link
							to="/marketplace"
							className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-content transition-colors hover:bg-accent"
						>
							Browse listings <ArrowRight size={15} aria-hidden="true" />
						</Link>
					</div>
				) : isLoading ? (
					<div className="w-full flex py-24 flex-col items-center justify-center gap-3 text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest">
						<Loader2 className="animate-spin text-primary" size={24} />
						Finding items near you...
					</div>
				) : message ? (
					<div role="alert" className="mx-auto max-w-md rounded-2xl border border-rose-400/15 bg-rose-400/[0.05] p-12 text-center text-sm text-rose-300">
						{message}
					</div>
				) : listings.length === 0 ? (
					<div className="mx-auto max-w-md rounded-2xl border border-white/[0.07] p-16 text-center text-sm text-slate-400">
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
