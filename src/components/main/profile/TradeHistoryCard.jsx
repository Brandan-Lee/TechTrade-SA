import React from "react";
import { Terminal, ArrowUpRight } from "lucide-react";

export default function TradeHistoryCard({
	title,
	buyer,
	date,
	price,
	status,
}) {
	const isCompleted = status?.toUpperCase() === "COMPLETED";

	const statusConfig = isCompleted
		? {
				border: "border-emerald-500/30",
				bg: "bg-emerald-500/10",
				text: "text-emerald-400",
				glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
			}
		: {
				border: "border-amber-500/30",
				bg: "bg-amber-500/10",
				text: "text-amber-400",
				glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]",
			};

	return (
		<article
			className={`w-full min-h-[100px] p-4 bg-[#0c0c0e]/90 border border-white/10 rounded-xl flex flex-col justify-between gap-3 transition-all duration-300 relative overflow-hidden group hover:border-fuchsia-500/30 hover:bg-[#121216]/90 ${statusConfig.glow}`}
		>
			{/* Context Left Border Tag Decal */}
			<div
				className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-300 ${isCompleted ? "bg-emerald-500/30 group-hover:bg-emerald-500" : "bg-amber-500/30 group-hover:bg-amber-500"}`}
			/>

			{/* Top Row: Core Meta Packet */}
			<div className="flex flex-row justify-between items-start gap-4">
				<div className="min-w-0 flex-1">
					{/* Diagnostic Pathing Header */}
					<div className="flex items-center gap-1 font-mono text-[9px] tracking-widest text-slate-500 uppercase mb-0.5">
						<Terminal size={8} className="text-fuchsia-500/40" />
						<span>Trade History Card</span>
					</div>
					{/* Listing Title */}
					<h3 className="text-white font-mono font-bold text-xs md:text-sm lg:text-base leading-tight truncate group-hover:text-fuchsia-400 transition-colors">
						{title}
					</h3>
				</div>

				{/* System Status Node Tag */}
				<span
					className={`shrink-0 px-2.5 py-0.5 border ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text} rounded text-[10px] md:text-xs font-mono font-black tracking-widest uppercase`}
				>
					{status}
				</span>
			</div>

			{/* Bottom Row: Financials and Transmission Tracking */}
			<div className="flex justify-between items-end gap-2 pt-2 border-t border-white/5 font-mono">
				<div className="flex flex-col min-w-0">
					{/* Buyer Field */}
					<p className="text-slate-400 text-[11px] md:text-xs leading-none truncate">
						TARGET_OP:{" "}
						<span className="text-fuchsia-400 font-bold group-hover:text-fuchsia-300 transition-colors">
							{buyer}
						</span>
					</p>

					{/* Date Field & Vital Network Activity Beacon */}
					<div className="flex items-center gap-2 mt-1.5">
						<p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-wider">
							{date}
						</p>
						{!isCompleted && (
							<span className="relative flex h-1.5 w-1.5" aria-hidden="true">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
								<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
							</span>
						)}
					</div>
				</div>

				{/* Pricing Delta Value Matrix */}
				<div className="text-white font-black text-sm md:text-base lg:text-lg tracking-tight flex items-center gap-0.5 text-right shrink-0">
					<span>{price}</span>
					<ArrowUpRight
						size={12}
						className="text-fuchsia-500/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
					/>
				</div>
			</div>
		</article>
	);
}
