import React from "react";
import { ShieldCheck, ChevronRight, Activity, Zap } from "lucide-react";
import TrustedSellerCard from "../../TrustedSellerCard";

export default function TrustedSellers() {
	const sellers = [
		{
			name: "David Nkosi",
			tier: "Elite Tier",
			rating: "4.8",
			reviews: "692",
			sales: "289",
			specialty: "Build Specialist",
			image: "https://i.pravatar.cc/150?u=1",
		},
		{
			name: "Amara Okonkwo",
			tier: "Elite Tier",
			rating: "4.9",
			reviews: "956",
			sales: "413",
			specialty: "Storage Pro",
			image: "https://i.pravatar.cc/150?u=2",
		},
		{
			name: "Maxwell Chen",
			tier: "Elite Tier",
			rating: "4.9",
			reviews: "847",
			sales: "342",
			specialty: "GPU Specialist",
			image: "https://i.pravatar.cc/150?u=3",
		},
		{
			name: "Sarah v.d. Berg",
			tier: "Master Tier",
			rating: "5.0",
			reviews: "1204",
			sales: "521",
			specialty: "Custom Builds",
			image: "https://i.pravatar.cc/150?u=4",
		},
	];

	return (
		<section className="w-full bg-[#050505] relative py-16 px-4 overflow-hidden">
			{/* Cyberpunk Grid Overlay */}
			<div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

			{/* Ambient Purple Glow */}
			<div className="absolute -top-24 -left-24 w-96 h-96 bg-fuchsia-600/10 blur-[120px] rounded-full"></div>

			<div className="max-w-[1440px] mx-auto relative z-10">
				{/* Header Section */}
				<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
					<div className="space-y-2">
						<h2 className="text-white text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
							Trusted{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
								Sellers
							</span>
						</h2>

						<p className="text-slate-400 text-sm md:text-base font-medium max-w-md uppercase tracking-tight">
							<span className="text-white">Elite Verified Traders</span>
						</p>
					</div>

					{/* Interaction Hint for UX */}
					<div className="flex items-center gap-4 group cursor-pointer">
						<span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest group-hover:text-fuchsia-400 transition-colors">
							Swipe to Scan Registry
						</span>
						<div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white group-hover:border-fuchsia-500 transition-all">
							<ChevronRight
								size={18}
								className="group-hover:translate-x-0.5 transition-transform"
							/>
						</div>
					</div>
				</div>

				{/* Scrollable Container */}
				<div className="relative">
					{/* Visual fade-out effect for scroll affordance */}
					<div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none hidden md:block"></div>

					<div className="flex overflow-x-auto gap-6 pb-12 no-scrollbar snap-x snap-mandatory touch-pan-x">
						{sellers.map((seller, index) => (
							<div
								key={index}
								className="snap-center md:snap-start min-w-[300px] md:min-w-[340px] transition-transform duration-300 hover:-translate-y-2"
							>
								{/* We assume TrustedSellerCard handles its internal cyberpunk styling */}
								<TrustedSellerCard {...seller} />
							</div>
						))}

						{/* Final "View All" Card for UX completion */}
						<div className="snap-center md:snap-start min-w-[200px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/5 group hover:border-fuchsia-500/50 transition-all cursor-pointer">
							<div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
								<Zap
									size={24}
									className="text-slate-500 group-hover:text-fuchsia-400"
								/>
							</div>
							<span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
								Full Registry
							</span>
						</div>
					</div>
				</div>
			</div>

			<style
				dangerouslySetInnerHTML={{
					__html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `,
				}}
			/>
		</section>
	);
}
