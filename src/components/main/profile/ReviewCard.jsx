import { Quote, Star, Terminal, AlertTriangle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ReviewCard = ({ id, reviewer, rating, comment, date, onReport }) => {
	const userName = reviewer?.name || "Anonymous Peer";

	const userInitials = userName
		.split(" ")
		.filter(Boolean)
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<Link
			to={`/profile/${reviewer?.id}`}
			className="w-full block bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-4 md:p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-fuchsia-500/30 transition-all duration-300 relative overflow-hidden group"
		>
			{/* Top Border Corner Accent Decal */}
			<div className="absolute top-0 right-0 w-8 h-[1px] bg-fuchsia-500/40" />
			<div className="absolute top-0 right-0 w-[1px] h-2 bg-fuchsia-500/40" />

			<div className="flex justify-between items-start mb-4 gap-4">
				<div className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity group/link">
					{reviewer?.avatar ? (
						<img
							src={reviewer.avatar}
							alt={userName}
							className="w-9 h-9 md:w-10 md:h-10 rounded-lg border border-fuchsia-500/20 object-cover grayscale brightness-95 shrink-0 group-hover/link:border-fuchsia-500/50"
						/>
					) : (
						<div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-mono font-black text-xs md:text-sm tracking-wider shrink-0 shadow-[inset_0_0_10px_rgba(217,70,239,0.05)] group-hover/link:border-fuchsia-500/50">
							{userInitials}
						</div>
					)}

					<div className="min-w-0 font-mono">
						<p className="text-white text-xs md:text-sm font-black uppercase tracking-wide truncate group-hover/link:text-fuchsia-400">
							{userName}
						</p>
						<div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">
							<Terminal size={8} className="text-fuchsia-500/40" />
							<span>{date}</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{onReport && (
						<button
							type="button"
							onClick={(e) => {
								// CRITICAL: Stop the event from bubbling up to the outer parent Link component
								e.preventDefault();
								e.stopPropagation();
								onReport(id);
							}}
							title="Report this review data transmission"
							className="p-1.5 rounded bg-rose-500/5 border border-rose-500/10 text-rose-500/50 hover:text-rose-400 hover:border-rose-500/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 relative z-20"
						>
							<AlertTriangle size={12} />
						</button>
					)}

					<div className="flex items-center gap-1 bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded">
						<Star size={12} className="text-amber-500 fill-amber-500" />
						<span className="text-amber-400 font-mono text-xs font-black tracking-tight">
							{rating}.0
						</span>
					</div>
				</div>
			</div>

			<div className="relative mt-2">
				<Quote className="absolute -top-1 -left-1 w-3.5 h-3.5 text-fuchsia-500/20 pointer-events-none" />
				<p className="text-slate-300 text-xs md:text-sm font-mono leading-relaxed pl-4 relative z-10">
					"{comment}"
				</p>
			</div>
		</Link>
	);
};

export default ReviewCard;
