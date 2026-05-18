import React from "react";
import { ShieldCheck, Terminal, AlertCircle } from "lucide-react";

const PasswordStrengthMeter = ({ password = "" }) => {
	// 1. Calculate explicit criteria states
	const checks = {
		length: password.length >= 8,
		uppercase: /[A-Z]/.test(password),
		number: /[0-9]/.test(password),
		symbol: /[^A-Za-z0-9]/.test(password),
	};

	// Calculate total validation integrity score (0 to 4)
	const strength = Object.values(checks).filter(Boolean).length;

	// Score definitions tailored to a high-contrast cyber tactical HUD
	const config = [
		{
			label: "Very Weak",
			color: "bg-red-500/20 border border-red-500 text-red-400",
		},
		{
			label: "Weak",
			color: "bg-orange-500/20 border border-orange-500 text-orange-400",
		},
		{
			label: "Fair",
			color: "bg-yellow-500/20 border border-yellow-500 text-yellow-400",
		},
		{
			label: "Good",
			color: "bg-emerald-500/20 border border-emerald-500 text-emerald-400",
		},
		{
			label: "Strong",
			color: "bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-400",
		},
	];

	const currentLevel = config[strength];

	return (
		<div className="w-full space-y-4 font-mono select-none animate-in fade-in duration-300">
			{/* Real-time Metric Readout Header Block */}
			<div
				className="flex justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider"
				aria-live="polite"
				aria-atomic="true"
			>
				<div className="text-slate-500 flex items-center gap-1.5">
					<Terminal size={12} className="text-fuchsia-500" />
					<span> Password strength: </span>
				</div>
				<span
					className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest transition-all duration-300 ${currentLevel.color}`}
				>
					{currentLevel.label}
				</span>
			</div>

			{/* Segmented 4-Bar Data Channel Grid */}
			<div className="flex gap-1.5 h-1.5" aria-hidden="true">
				{[1, 2, 3, 4].map((step) => {
					const isActive = strength >= step;
					let barColor = "bg-white/5 border border-white/5";

					if (isActive) {
						if (strength === 1)
							barColor = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]";
						else if (strength === 2)
							barColor = "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]";
						else if (strength === 3)
							barColor =
								"bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]";
						else
							barColor =
								"bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.5)]";
					}

					return (
						<div
							key={step}
							className={`flex-1 h-full rounded-sm transition-all duration-500 ease-out ${barColor}`}
						/>
					);
				})}
			</div>

			{/* Live Security Parameter Diagnostic Checklist */}
			<div className="border-t border-white/5 pt-3">
				<ul className="space-y-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide">
					<li
						className={`flex items-center gap-2 transition-colors duration-300 ${checks.length ? "text-emerald-400" : "text-slate-600"}`}
					>
						{checks.length ? (
							<ShieldCheck size={12} />
						) : (
							<AlertCircle size={12} />
						)}
						<span>More than 8 Characters</span>
					</li>
					<li
						className={`flex items-center gap-2 transition-colors duration-300 ${checks.uppercase ? "text-emerald-400" : "text-slate-600"}`}
					>
						{checks.uppercase ? (
							<ShieldCheck size={12} />
						) : (
							<AlertCircle size={12} />
						)}
						<span> Must include both uppercase and lowercase letters.</span>
					</li>
					<li
						className={`flex items-center gap-2 transition-colors duration-300 ${checks.number && checks.symbol ? "text-emerald-400" : "text-slate-600"}`}
					>
						{checks.number && checks.symbol ? (
							<ShieldCheck size={12} />
						) : (
							<AlertCircle size={12} />
						)}
						<span>Must include numbers and symbols</span>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default PasswordStrengthMeter;
