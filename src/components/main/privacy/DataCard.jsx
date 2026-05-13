import React from "react";

const DataCard = ({
	label,
	title,
	description,
	badge,
	gradient,
	type = "toggle",
}) => (
	<div
		className={`w-full p-4 rounded-lg border border-white/20 text white ${gradient}`}
	>
		<div className="flex justify-between items-start mb-4">
			<div className="flex flex-col gap-2">
				<span className="w-fit px-2 py-1 bg-pink-600/50 rounded text-[10px] font-bold tracking-widest uppercase">
					{label}
				</span>

				<h3 className="text-sm font-bold font-inter leading-tight">{title}</h3>
			</div>

			{type === "toggle" ? (
				<input
					type="checkbox"
					className="toggle toggle-secondary toggle-sm"
					defaultChecked
				/>
			) : (
				<span className="text-pink-300 text-xs font-semibold">{badge}</span>
			)}
		</div>

		<p className="text-xs font-medium font-inter leading-5 opacity-90">
			{description}
		</p>
	</div>
);

export default DataCard;
