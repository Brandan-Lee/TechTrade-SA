import React, { useState, useEffect } from "react";
import { LayoutGrid, ShieldCheck, Banknote, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../lib/api";

export default function Stats() {
	const [data, setData] = useState({
		activeListings: "...",
		trustScore: "...",
		escrowValue: "...",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [listingsRes, trustRes, paymentsRes] = await Promise.all([
					apiFetch("/listings/get_listing_count.php"),
					apiFetch("/user/get_avg_trust.php"),
					apiFetch("/payments/get_escrow_payments.php"),
				]);

				const listings = await listingsRes.json();
				const trust = await trustRes.json();
				const payments = await paymentsRes.json();

				const formattedEscrow = payments.total_amount_cents
					? `R ${(payments.total_amount_cents / 100).toLocaleString()}`
					: "R 0";

				setData({
					activeListings: listings.count ?? 0,
					trustScore: `${trust.percentage}%` ?? "0.00",
					escrowValue: formattedEscrow,
				});
			} catch (error) {
				console.error("Failed to load dashboard stats:", error);
			}
		};

		fetchData();
	}, []);

	const stats = [
		{
			label: "Active Listings",
			value: data.activeListings,
			icon: <LayoutGrid className="w-5 h-5" />,
		},
		{
			label: "Avg Trust Score",
			value: data.trustScore,
			icon: <ShieldCheck className="w-5 h-5" />,
		},
		{
			label: "Escrow Secured",
			value: data.escrowValue,
			icon: <Banknote className="w-5 h-5" />,
		},
	];

	return (
		<section className="w-full py-16 px-4 bg-[#0a0a0c] relative overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />

			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-4">
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							whileHover={{ y: -5 }}
							transition={{ type: "spring", stiffness: 300 }}
							className="relative flex-1 group"
						>
							<div className="absolute inset-0 bg-gradient-to-b from-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

							<div className="relative h-full px-6 py-8 bg-[#121214] border border-white/10 group-hover:border-fuchsia-500/30 rounded-2xl flex flex-col items-center gap-3 shadow-2xl transition-all">
								<div className="p-3 bg-white/5 rounded-xl text-fuchsia-400 mb-2 border border-white/5 group-hover:border-fuchsia-500/50 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all">
									{stat.icon}
								</div>

								<div className="flex flex-col items-center">
									<span className="text-white text-3xl md:text-4xl font-black italic tracking-tighter leading-none">
										{stat.value}
									</span>
								</div>

								<div className="mt-2 text-slate-400 text-[11px] font-bold uppercase tracking-[0.25em] text-center border-t border-white/5 pt-4 w-full">
									{stat.label}
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
			<div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
		</section>
	);
}
