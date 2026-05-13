import React from "react";

export const StrikeCard = ({
	title,
	description,
	variant = "warning",
	icon,
}) => {
	const styles = {
		warning: "bg-amber-500 border-amber-600/20",
		danger: "bg-red-500 border-white/20",
		critical: "bg-red-900 border-white/40",
	};

	return (
		<div
			className={`w-full p-4 rounded-xl border ${styles[variant]} shadow-md flex gap-4 items-start`}
		>
			{icon && (
				<div className="text-white shrink-0 mt-0.5">
					{React.cloneElement(icon, { size: 20 })}
				</div>
			)}

			<div className="flex flex-col">
				<h5 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">
					{title}
				</h5>

				<p className="text-white/90 text-xs leading-5">{description}</p>
			</div>
		</div>
	);
};
