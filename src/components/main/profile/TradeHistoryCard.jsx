import React from "react";

export default function TradeHistoryCard({
	title,
	buyer,
	date,
	price,
	status,
}) {
	const isCompleted = status.toUpperCase() === "COMPLETED";

	const statusStyles = isCompleted
		? "from-emerald-500 to-emerald-600 shadow-emerald-900/20"
		: "from-amber-400 to-orange-500 shadow-orange-900/20";

	return (
		<div className="w-full min-h-[112px] p-4 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-xl border border-pink-600 flex flex-col justify-between gap-3 transition-all hover:translate-y-[-2px] hover:shadow-xl group">
			{/* Top Row */}
			<div className="flex flex-row justify-between items-center gap-2">
				<h3 className="text-white text-sm md:text-base font-bold leading-tight truncate">
					{title}
				</h3>

				<span
					className={`shrink-0 px-3 py-1 bg-gradient-to-br ${statusStyles} rounded-full text-white text-sm md:text-base font-black tracking-widest uppercase shadow-lg`}
				>
					{status}
				</span>
			</div>

			{/* Bottom Row */}
			<div className="flex justify-between items-end">
				<div className="flex flex-col">
					<p className="text-white text-xs md:text-sm font-medium leading-5">
						Buyer:{" "}
						<span className="text-pink-400 font-bold group-hover:text-pink-300 transition-colors">
							{buyer}
						</span>
					</p>
					<div className="flex items-center gap-2">
						<p className="text-white/60 text-sm md:text-base font-medium uppercase tracking-tighter">
							{date}
						</p>
						{/* Small indicator for In Progress */}
						{!isCompleted && (
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
							</span>
						)}
					</div>
				</div>

				<div className="text-pink-500 text-lg md:text-xl font-black leading-none italic drop-shadow-md">
					{price}
				</div>
			</div>
		</div>
	);
}
