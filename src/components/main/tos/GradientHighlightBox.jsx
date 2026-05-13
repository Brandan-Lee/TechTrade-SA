import React from "react";

export const GradientHighlightBox = ({ title, children, icon }) => (
	<div className="w-full p-6 bg-gradient-to-r from-violet-800 via-purple-600 to-violet-800 rounded-2xl border border-pink-600 shadow-xl">
		<div className="flex gap-3">
			<div className="text-white shrink-0">{icon}</div>

			<div className="flex flex-col gap-2">
				<h4 className="text-white text-sm font-black uppercase tracking-widest">
					{title}
				</h4>

				<div className="text-white/90 text-xs leading-5">{children}</div>
			</div>
		</div>
	</div>
);
