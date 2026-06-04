import React from "react";

export const ProtocolSection = ({ title, icon, children }) => (
	<section
		className="flex flex-col gap-3.5 w-full font-mono select-none selection:bg-fuchsia-500/30 text-xs sm:text-sm md:text-base lg:text-lg"
		aria-labelledby={`protocol-header-${title?.replace(/\s+/g, "-").toLowerCase()}`}
	>
		<div className="flex items-center gap-2.5 pb-2 border-b border-purple-500/10">
			{icon && (
				<div
					className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-purple-950/30 border border-purple-500/30 flex justify-center items-center shrink-0 text-fuchsia-400 shadow-[0_0_8px_rgba(168,85,247,0.08)]"
					aria-hidden="true"
				>
					{icon}
				</div>
			)}

			<h1
				id={`protocol-header-${title?.replace(/\s+/g, "-").toLowerCase()}`}
				className="text-white text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.2em]"
			>
				{title}
			</h1>
		</div>

		<div className="space-y-3 sm:space-y-4 text-slate-300 text-[10px] sm:text-xs md:text-sm leading-relaxed tracking-wide font-medium">
			{children}
		</div>
	</section>
);
