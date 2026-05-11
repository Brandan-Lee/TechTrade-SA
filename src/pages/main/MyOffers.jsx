import React from "react";
import { motion } from "framer-motion";
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
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen bg-neutral-100 font-['Inter']"
		>
			<header className="w-full px-6 md:px-12 py-8">
				<h2 className="text-purple-600 text-3xl font-black uppercase tracking-tighter">
					My Offers
				</h2>
			</header>

			<div className="max-w-4xl mx-auto px-6 pb-20 flex flex-col gap-6">
				{offers.length > 0 ? (
					offers.map((offer) => <IncomingOfferCard key={offer.id} {...offer} />)
				) : (
					<div className="py-20 text-center flex flex-col items-center gap-4">
						<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
							<Search size={24} className="text-gray-400" />
						</div>
						<p className="text-gray-500 font-medium italic">
							No offers found matching your criteria.
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
}
