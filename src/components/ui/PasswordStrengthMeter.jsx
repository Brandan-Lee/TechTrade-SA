import React from "react";

const PasswordStrengthMeter = ({ password }) => {
	// 1. Logic to calculate strength (0 to 4)
	const calculateStrength = (val) => {
		if (!val) return 0;

		let score = 0;

		// Length check
		if (val.length >= 8) score++;
		// Uppercase check
		if (/[A-Z]/.test(val)) score++;
		// Number check
		if (/[0-9]/.test(val)) score++;
		// Special char check
		if (/[^A-Za-z0-9]/.test(val)) score++;
		return score;
	};

	const strength = calculateStrength(password);

	//score to UI colors and labels
	const config = [
		{ label: "Very Weak", color: "bg-slate-300" },
		{ label: "Weak", color: "bg-red-500" },
		{ label: "Fair", color: "bg-orange-500" },
		{ label: "Good", color: "bg-yellow-500" },
		{ label: "Strong", color: "bg-green-500" },
	];

	return (
		<div className="w-full space-y-2 animate-in fade-in duration-500">
			{/* 4-bar indicator */}
			<div className="flex gap-2 h-2">
				{[1, 2, 3, 4].map((step) => (
					<div
						key={step}
						className={`flex-1 h-full rounded-full transition-all duration-500 ease-out ${
							strength >= step ? config[strength].color : "bg-slate-200"
						}`}
					/>
				))}
			</div>

			{/* Label Display */}
			<div className="flex justify-start items-center">
				<span className="text-violet-600 text-[10px] font-normal uppercase tracking-wider">
					Password strength:{" "}
				</span>
				<span
					className={`ml-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
						strength > 0 ? "text-violet-800" : "text-slate-400"
					}`}
				>
					{config[strength].label}
				</span>
			</div>

			{/* Security Requirements */}
			<div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
				<ul className="space-y-1">
					<li className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-tighter font-medium">
						<div className="w-1 h-1 rounded-full bg-pink-600" />
						More than 8 Characters
					</li>
					<li className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-tighter font-medium">
						<div className="w-1 h-1 rounded-full bg-pink-600" />
						Must include both uppercase and lowercase letters.
					</li>
					<li className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-tighter font-medium">
						<div className="w-1 h-1 rounded-full bg-pink-600" />
						Must include numbers and symbols
					</li>
				</ul>
			</div>
		</div>
	);
};

export default PasswordStrengthMeter;
