import React from "react";
import { motion } from "framer-motion";
import { Cpu, Terminal, Zap, Activity } from "lucide-react";
import ListingCard from "../../ListingCard.jsx";

export default function FeaturedListings() {
	const listings = [
		{
			title: "NVIDIA RTX 4090 Founders Edition",
			price: "R28,500",
			seller: "Maxwell Chen",
			location: "Gauteng",
			status: "Available Now",
			condition: "Like New",
			image: "https://placehold.co/600x400/2e1065/ffffff?text=RTX+4090",
		},
		{
			title: "AMD Ryzen 9 7950X3D Processor",
			price: "R9,200",
			seller: "Sarah van der Berg",
			location: "Western Cape",
			status: "Offer Received",
			condition: "New",
			image: "https://placehold.co/600x400/2e1065/ffffff?text=Ryzen+9",
		},
		{
			title: "Samsung 990 PRO 4TB NVMe Gen4",
			price: "R7,200",
			seller: "Amara Okonkwo",
			location: "KwaZulu-Natal",
			status: "Payment Pending",
			condition: "New",
			image: "https://placehold.co/600x400/2e1065/ffffff?text=Samsung+990",
		},
		{
			title: "Intel Core i9-14900K Raptor Lake",
			price: "R8,800",
			seller: "Sarah van der Berg",
			location: "Western Cape",
			status: "Available Now",
			condition: "New",
			image: "https://placehold.co/600x400/2e1065/ffffff?text=i9-14900K",
		},
	];

	// Framer Motion Variants for staggered entry
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1, // Each card appears 0.1s after the previous
			},
		},
	};

	const cardVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	};

	return (
		<section className="w-full bg-[#050505] py-20 px-4 relative overflow-hidden border-y border-fuchsia-500/10">
			{/* Background Tech Decor */}
			<div className="absolute top-0 right-0 p-8 opacity-20 hidden lg:block">
				<Terminal size={300} className="text-fuchsia-500/10" />
			</div>

			<div className="max-w-[1440px] mx-auto relative z-10">
				{/* Header Section */}
				<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div className="space-y-4">
						<div className="flex items-center gap-2 bg-fuchsia-500/10 w-max px-3 py-1 rounded-full border border-fuchsia-500/20">
							<Activity size={14} className="text-fuchsia-500 animate-pulse" />
							<span className="text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-400">
								Live Marketplace Feed
							</span>
						</div>

						<h2 className="text-white text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
							Featured{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500">
								Hardware
							</span>
						</h2>

						<p className="max-w-2xl text-slate-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
							Hand-picked premium hardware deals in your area
						</p>
					</div>

					{/* Stats Counter (Purely visual but adds "System" feel) */}
					<div className="hidden xl:flex items-center gap-8 border-l border-white/10 pl-8">
						<div>
							<span className="block text-white font-mono text-2xl font-black">
								2.4k
							</span>
							<span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
								Active Nodes
							</span>
						</div>
						<div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
							<Zap size={20} className="text-fuchsia-500" />
						</div>
					</div>
				</div>

				{/* Grid with Staggered Animation */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
				>
					{listings.map((item, index) => (
						<motion.div key={index} variants={cardVariants}>
							{/* Assuming ListingCard will be styled to match the Dark Cyberpunk theme */}
							<ListingCard {...item} isFeatured={true} />
						</motion.div>
					))}
				</motion.div>

				{/* Bottom Decorative Line */}
				<div className="mt-20 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent flex justify-center">
					<div className="bg-[#050505] px-4 -mt-2">
						<Cpu size={16} className="text-fuchsia-900" />
					</div>
				</div>
			</div>
		</section>
	);
}
