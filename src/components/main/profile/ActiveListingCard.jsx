import React from "react";
import { Eye, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActiveListingCard = ({ title, price, condition, time, views, image }) => {
	const navigate = useNavigate();

	const handleViewListing = () => {
		navigate(`/view-listing`);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleViewListing();
		}
	};

	return (
		<div
			onClick={handleViewListing}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			role="button"
			aria-label={`View listing details for ${title}`}
			className="w-full p-3 md:p-4 bg-[#0c0c0e]/90 border border-white/10 rounded-xl flex gap-4 transition-all duration-300 outline-none
                hover:border-fuchsia-500/40 hover:bg-[#121216]/90 hover:shadow-[0_0_25px_rgba(217,70,239,0.05)]
                focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
		>
			{/* Component Image Uplink Shell */}
			<div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 bg-black rounded-lg border border-white/5 overflow-hidden group">
				<img
					src={image || "https://placehold.co/200"} // Fallback handler included
					alt={`Hardware image for ${title}`}
					className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500"
				/>
			</div>

			{/* Core Metadata Packet Grid */}
			<div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
				<div>
					{/* Header Spec Tagline */}
					<div className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-fuchsia-500/70 uppercase mb-0.5">
						<Terminal size={8} />
						<span>Active Listing</span>
					</div>
					{/* Hardware Title Block */}
					<h3 className="text-white font-mono font-bold text-xs md:text-sm lg:text-base leading-snug line-clamp-1 group-hover:text-fuchsia-400 transition-colors">
						{title}
					</h3>
				</div>

				{/* Pricing & Condition Badges */}
				<div className="flex items-center gap-2.5 my-1.5 flex-wrap">
					<span className="text-fuchsia-400 font-mono font-black text-base md:text-lg tracking-tight">
						R {price}
					</span>
					<span className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] md:text-[10px] font-mono font-bold rounded uppercase tracking-widest">
						{condition}
					</span>
				</div>

				{/* Ledger Telemetry Info Bottom */}
				<div className="flex justify-between items-center text-slate-500 text-[10px] md:text-xs font-mono uppercase tracking-wider pt-1 border-t border-white/5">
					<span className="truncate max-w-[150px] md:max-w-none">{time}</span>
					<div className="flex items-center gap-1 font-bold text-slate-400 shrink-0">
						<Eye size={12} className="text-fuchsia-500/50" />
						<span>{views} Total Views</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ActiveListingCard;
