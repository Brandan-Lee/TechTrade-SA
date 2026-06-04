import React from "react";

const StatCard = ({ icon, label, value }) => (
	<article className="flex-1 min-w-[85px] sm:min-w-[120px] bg-[#0c0c0e]/90 border border-white/10 rounded-xl p-3 md:p-5 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group hover:border-fuchsia-500/30 hover:shadow-[0_0_20px_rgba(217,70,239,0.05)] text-xs sm:text-sm md:text-base lg:text-lg">
		<div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-fuchsia-500/40 group-hover:bg-fuchsia-500 group-hover:w-16 transition-all duration-300" />

		<div className="mb-2.5 p-2 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-lg text-fuchsia-400 group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/30 transition-colors shrink-0">
			{React.cloneElement(icon, { size: 16, className: "md:w-5 md:h-5" })}
		</div>

		<div className="w-full space-y-1">
			<h1 className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors truncate px-1">
				{label}
			</h1>
			<p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white tracking-tight">
				{value}
			</p>
		</div>
	</article>
);

export default StatCard;
