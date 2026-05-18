import { Clock, ShieldCheck, Star, Terminal } from "lucide-react";
import React from "react";
import CyberActionButton from "../../ui/CyberActionButton";
import { useNavigate } from "react-router-dom";

export default function IncomingOfferCard({
	product,
	offerAmount,
	originalPrice,
	buyer,
	message,
	timeAgo,
}) {
	const navigate = useNavigate();

	const handleManage = (e) => {
		e.stopPropagation();
		navigate(`/manage-offer`);
	};

	return (
		<article className="w-full bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-4 md:p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-fuchsia-500/30 transition-all duration-300 relative overflow-hidden group">
			{/* Top Border Terminal Tagline Accent */}
			<div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />

			{/* Main Interactive Grid Layout */}
			<div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-stretch">
				{/* 1. PRODUCT INFO SECTION */}
				<div className="flex gap-4 w-full lg:w-1/4 lg:max-w-[220px] shrink-0 items-center lg:items-start">
					<div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 bg-black rounded-lg border border-white/5 overflow-hidden">
						<img
							src={product.image || "https://placehold.co/80"}
							alt={`${product.brand} ${product.model}`}
							className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-500"
						/>
					</div>
					<div className="min-w-0 flex flex-col justify-center lg:justify-start lg:pt-1">
						<h3 className="text-white text-xs md:text-sm font-mono font-black tracking-wider uppercase truncate">
							{product.brand}
						</h3>
						<p className="text-slate-400 text-[11px] md:text-xs font-mono truncate mb-1">
							{product.model}
						</p>
						<span className="text-slate-500 line-through font-mono text-[10px] md:text-xs tracking-tight">
							{originalPrice}
						</span>
					</div>
				</div>

				{/* 2. BUYER PROFILE & ENCRYPTED MESSAGE BLOCK */}
				<div className="flex-1 w-full flex flex-col gap-3 justify-between bg-white/[0.01] border border-white/5 lg:border-none lg:bg-transparent rounded-xl p-3 lg:p-0">
					<div className="flex items-center gap-3">
						<div className="relative shrink-0">
							<img
								src={buyer.avatar || "https://placehold.co/48"}
								alt={`Operator ${buyer.name}`}
								className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-fuchsia-500/40 p-[2px] bg-black"
							/>
							<div className="absolute -bottom-0.5 -right-0.5 bg-black border border-fuchsia-500 rounded-full p-1 shadow-md shadow-fuchsia-500/20 text-fuchsia-400">
								<ShieldCheck size={8} />
							</div>
						</div>

						<div className="font-mono">
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-white text-xs md:text-sm font-bold tracking-wide">
									{buyer.name}
								</span>
								<span className="text-fuchsia-500/40 text-xs tracking-widest">
									//
								</span>
								<div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">
									<Star size={10} fill="currentColor" />
									<span className="text-amber-400 font-bold text-[9px] md:text-[10px] uppercase tracking-wider">
										Verified Trader
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Encrypted Sub-Terminal Message Container */}
					<div className="bg-black/50 rounded-lg p-3 border border-white/5 relative">
						<div className="absolute top-1 right-2 text-[8px] font-mono text-fuchsia-500/30 tracking-widest hidden md:block">
							MSG_FEED_IN
						</div>
						<p className="text-slate-300 text-xs font-mono leading-relaxed pl-3 border-l border-fuchsia-500/40">
							"{message}"
						</p>
					</div>
				</div>

				{/* 3. OFFER VALUATION & ACTIONS SIDEBAR */}
				<div className="w-full lg:w-44 flex flex-col sm:flex-row lg:flex-col justify-between lg:justify-between items-center lg:items-stretch gap-4 shrink-0 pt-3 lg:pt-0 border-t border-white/5 lg:border-t-0 lg:border-l lg:border-white/5 lg:pl-5">
					{/* Telemetry Valuation Output */}
					<div className="text-left lg:text-right w-full sm:w-auto lg:w-full font-mono">
						<div className="text-[9px] text-fuchsia-500/60 font-black uppercase tracking-[0.2em] mb-0.5">
							INCOMING OFFER
						</div>
						<div className="text-fuchsia-400 text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-none">
							{offerAmount}
						</div>
						<div className="flex items-center justify-start lg:justify-end gap-1 text-slate-500 text-[10px] md:text-xs mt-1.5">
							<Clock size={10} className="text-fuchsia-500/50" />
							<span>{timeAgo}</span>
						</div>
					</div>

					{/* Unified Interactive Control Triggers */}
					<div className="w-full sm:w-40 lg:w-full shrink-0">
						<CyberActionButton
							onClick={handleManage}
							label="MANAGE"
							className="w-full text-xs"
						/>
					</div>
				</div>
			</div>
		</article>
	);
}
