import React from "react";
import { motion } from "framer-motion";
import { Terminal, ShieldAlert } from "lucide-react";
import IncomingOfferCard from "../../components/main/profile/IncomingOfferCard";

export default function MyOffers() {
	const offers = [
		{
			id: 1,
			product: {
				brand: "ASUS ROG STRIX",
				model: "RTX 4090 24GB",
				image: "https://placehold.co/200",
			},
			originalPrice: "R 28,900",
			offerAmount: "R 26,000",
			buyer: { name: "Sarah K.", avatar: "https://placehold.co/48" },
			message: "Urgent need for gaming rig build. Can pay immediately.",
			timeAgo: "5h ago",
		},
		{
			id: 2,
			product: {
				brand: "AMD RYZEN",
				model: "9 7950X CPU",
				image: "https://placehold.co/200",
			},
			originalPrice: "R 10,500",
			offerAmount: "R 9,200",
			buyer: { name: "Jason V.", avatar: "https://placehold.co/48" },
			message: "Is the seal still intact? Ready to collect today.",
			timeAgo: "1d ago",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="min-h-screen bg-[#050506] text-slate-300 pb-20 relative overflow-hidden font-mono selection:bg-fuchsia-500/30 selection:text-white"
		>
			{/* Ambient System Cyber Grid Backdrop Matrix */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
			<div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

			{/* DASHBOARD TERMINAL HEADER */}
			<header className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-6 border-b border-white/5 relative z-10">
				<h1 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight">
					INCOMING OFFERS
				</h1>
			</header>

			{/* DATA TRANSACTION PACKET LAYER */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-8 flex flex-col gap-6 relative z-10">
				{offers.length > 0 ? (
					<div className="space-y-4">
						{offers.map((offer) => (
							<motion.div
								key={offer.id}
								layout
								initial={{ opacity: 0, scale: 0.98 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.2 }}
							>
								<IncomingOfferCard {...offer} />
							</motion.div>
						))}
					</div>
				) : (
					<div className="py-20 border border-dashed border-white/10 rounded-2xl bg-[#0c0c0e]/40 backdrop-blur-sm text-center flex flex-col items-center justify-center p-6 max-w-xl mx-auto mt-12 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
						<div className="w-12 h-12 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-400/80 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
							<ShieldAlert size={20} />
						</div>
						<h2 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
							NO INCOMING OFFERS HAS BEEN FOUND
						</h2>
					</div>
				)}
			</main>
		</motion.div>
	);
}
