import React from "react";

export const ProtocolSection = ({ title, icon, children }) => (
	<div className="flex flex-col gap-4 w-full">
		<div className="flex items-center gap-3">
			<div className="text-purple-700">{icon}</div>

			<h3 className="text-slate-800 text-lg font-extrabold uppercase tracking-tight italic">
				{title}
			</h3>
		</div>

		<div className="space-y-4 text-slate-600 text-sm leading-6">{children}</div>
	</div>
);
