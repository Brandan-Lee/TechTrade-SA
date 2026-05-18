import { Quote, Star, Terminal } from "lucide-react";
import React from "react";

const ReviewCard = ({ user, rating, comment, date }) => {
	// Safely extract up to the first two initials for the terminal node avatar
	const userInitials = user
		? user
				.split(" ")
				.filter(Boolean)
				.map((n) => n[0])
				.slice(0, 2)
				.join("")
				.toUpperCase()
		: "OP";

	return (
		<article className="w-full bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-4 md:p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-fuchsia-500/30 transition-all duration-300 relative overflow-hidden group">
			{/* Top Border Corner Accent Decal */}
			<div className="absolute top-0 right-0 w-8 h-[1px] bg-fuchsia-500/40" />
			<div className="absolute top-0 right-0 w-[1px] h-2 bg-fuchsia-500/40" />

			{/* Top Section: Operator Info & Rating Metrics */}
			<div className="flex justify-between items-start mb-4 gap-4">
				<div className="flex items-center gap-3 min-w-0">
					{/* Cybernetic Signature Avatar Node */}
					<div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-mono font-black text-xs md:text-sm tracking-wider shrink-0 shadow-[inset_0_0_10px_rgba(217,70,239,0.05)]">
						{userInitials}
					</div>

					{/* Identity Data String */}
					<div className="min-w-0 font-mono">
						<p className="text-white text-xs md:text-sm font-black uppercase tracking-wide truncate">
							{user}
						</p>
						<div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">
							<Terminal size={8} className="text-fuchsia-500/40" />
							<span>{date}</span>
						</div>
					</div>
				</div>

				{/* Score Rating Badge Array */}
				<div className="flex items-center gap-1 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded shrink-0">
					<Star size={12} className="text-amber-500 fill-amber-500" />
					<span className="text-amber-400 font-mono text-xs font-black tracking-tight">
						{rating}.0
					</span>
				</div>
			</div>

			{/* Bottom Section: Transmission Content */}
			<div className="relative mt-2">
				{/* Visual anchor quote icon stylized as an interface element */}
				<Quote className="absolute -top-1 -left-1 w-3.5 h-3.5 text-fuchsia-500/20 pointer-events-none" />

				<p className="text-slate-300 text-xs md:text-sm font-mono leading-relaxed pl-4 relative z-10">
					"{comment}"
				</p>
			</div>
		</article>
	);
};

export default ReviewCard;
