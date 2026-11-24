import { Clock, ArrowUpRight } from "lucide-react";
import React from "react";

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
			}
		: {
				border: "border-amber-500/30",
				bg: "bg-amber-500/10",
				text: "text-amber-400",
			};

	return (
		<article
			className={`w-full min-h-[100px] p-4 bg-base-200/90 border border-white/10 rounded-xl flex flex-col justify-between gap-3 transition-all duration-300 relative overflow-hidden group hover:border-secondary/30 hover:bg-base-300/90 text-sm`}
		>
			<div
				className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-300 ${isCompleted ? "bg-emerald-500/30 group-hover:bg-emerald-500" : "bg-amber-500/30 group-hover:bg-amber-500"}`}
			/>

			<div className="flex flex-row justify-between items-start gap-4">
				<div className="min-w-0 flex-1">
					<h1 className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight truncate group-hover:text-secondary transition-colors">
						{title}
					</h1>
				</div>

				<span
					className={`shrink-0 px-2.5 py-0.5 border ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text} rounded text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest`}
				>
					{status}
				</span>
			</div>

			<div className="flex justify-between items-end gap-2 pt-2 border-t border-white/5">
				<div className="flex flex-col min-w-0">
					<p className="text-slate-400 text-[10px] sm:text-[11px] md:text-xs leading-none truncate">
						Buyer:{" "}
						<span className="text-secondary font-bold group-hover:text-secondary transition-colors">
							{buyer}
						</span>
					</p>

					<div className="flex items-center gap-2 mt-1.5">
						<p className="text-slate-500 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
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

				<div className="text-white font-black text-sm flex items-center gap-0.5 text-right shrink-0">
					<span>{price}</span>
					<ArrowUpRight
						size={12}
						className="text-secondary/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
					/>
				</div>
			</div>
		</article>
	);
}
