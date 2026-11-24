import React from "react";

export const StrikeCard = ({
	title,
	description,
	variant = "warning",
	icon,
}) => {
	const variantStyles = {
		warning: {
			container:
				"border-amber-500/30 shadow-[inset_0_0_12px_rgba(245,158,11,0.02)]",
			title: "text-amber-400",
			icon: "text-amber-400 bg-amber-950/30 border-amber-500/30",
			aria: "polite",
		},
		danger: {
			container:
				"border-red-500/30 shadow-[inset_0_0_12px_rgba(239,68,68,0.02)]",
			title: "text-red-400",
			icon: "text-red-400 bg-red-950/30 border-red-500/30",
			aria: "assertive",
		},
		critical: {
			container:
				"border-secondary/40 bg-gradient-to-r from-[#160a21] to-[#0d0915] shadow-[0_0_15px_rgba(167,139,250,0.05)]",
			title: "text-secondary font-black animate-pulse",
			icon: "text-secondary bg-secondary-content/40 border-secondary/40",
			aria: "assertive",
		},
	};

	const currentStyle = variantStyles[variant] || variantStyles.warning;

	return (
		<article
			role="alert"
			aria-live={currentStyle.aria}
			className={`w-full p-4 rounded-lg border bg-base-100 text-slate-300 font-mono flex gap-3.5 items-start transition-all duration-300 selection:bg-red-500/30 text-sm ${currentStyle.container}`}
		>
			{icon && (
				<div
					className={`w-8 h-8 rounded border flex justify-center items-center shrink-0 shadow-sm ${currentStyle.icon}`}
					aria-hidden="true"
				>
					{React.cloneElement(icon, { size: 14, className: "shrink-0" })}
				</div>
			)}

			<div className="flex flex-col gap-1 min-w-0">
				<h1
					className={`text-xs sm:text-sm md:text-base font-black uppercase tracking-[0.15em] leading-tight ${currentStyle.title}`}
				>
					{title}
				</h1>

				<p className="text-slate-400 text-[10px] sm:text-xs md:text-sm leading-relaxed tracking-wide font-medium">
					{description}
				</p>
			</div>
		</article>
	);
};
