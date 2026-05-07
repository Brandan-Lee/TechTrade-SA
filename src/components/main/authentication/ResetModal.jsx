import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import AuthHeader from "./AuthHeader";

export const ResetModal = ({
	isOpen,
	onClose,
	onSwitchToOTP,
	onSwitchToLogin,
}) => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

	// Update layout mode on window resize
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 1024);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const calculateStrength = (val) => {
		if (val.length === 0) return 0;

		let score = 0;
		//Minimum Length
		if (val.length >= 8) score++;
		//Has Uppercase
		if (/[A-Z]/.test(val)) score++;
		//Has Number
		if (/[0-9]/.test(val)) score++;
		//Has Special Character
		if (/[^A-Za-z0-9]/.test(val)) score++;

		return score;
	};

	const strength = calculateStrength(password);
	const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];

	//Determine the colors based on the password strenght level
	const getStepColor = (step) => {
		if (strength >= step) {
			if (strength <= 1) return "bg-red-500";
			if (strength <= 2) return "bg-yellow-500";

			return "bg-green-500";
		}

		//Default color
		return "bg-gray-300";
	};

	if (!isOpen) return null;

	if (isMobile) {
		return (
			<div className="fixed inset-0 z-[200] bg-neutral-100 flex flex-col animate-in slide-in-from-bottom duration-300">
				{/* Mobile Header: Branding Takeover */}
				<div className="relative">
					<button
						onClick={onSwitchToOTP}
						className="absolute top-6 left-6 z-[210] text-white/80 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
					>
						<ArrowLeft className="w-4 h-4" /> Back
					</button>

					<AuthHeader />
				</div>

				{/* Mobile Form: */}
				<div className="flex-grow overflow-y-auto p-6 space-y-8">
					<div className="w-full max-w-sm mx-auto">
						<h1 className="text-purple-600 text-5xl font-black uppercase tracking-tighter">
							Reset Password
						</h1>

						<div className="space-y-6">
							{/* New Password Field */}
							<div className="space-y-2">
								<label
									htmlFor=""
									className="text-violet-600 text-xs font-medium font-['Inter']"
								>
									New Password:
								</label>

								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full h-12 px-4 bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all text-gray-900"
									/>
									<button
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-3 text-gray-500"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>

								{/* Password Strength Meter */}
								<div className="w-full space-y-2 mt-2">
									{/* Visual Bars */}
									<div className="flex gap-2 h-2">
										{[1, 2, 3, 4].map((step) => (
											<div
												key={step}
												className={`flex-1 rounded-full transition-all duration-500 ${getStepColor(step)}`}
											/>
										))}
									</div>
								</div>

								{/* Strength Label */}
								<div className="flex justify-between items-center">
									<span className="text-violet-600 text-sm font-normal font-['Inter']">
										Password Strength:
										<span className="font-bold ml-1">
											{strengthLabels[strength]}
										</span>
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

							{/* Confirm Password Field */}
							<div className="space-y-2">
								<label
									htmlFor=""
									className="text-violet-600 text-xs font-medium font-['Inter']"
								>
									Confirm Password
								</label>

								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="w-full h-12 px-4 bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all text-gray-900"
									/>
									<button
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-3 text-gray-500"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="space-y-4">
								<button className="w-full h-16 bg-gradient-to-r from-violet-800 to-purple-600 rounded-2xl outline outline-2 outline-pink-600 text-white font-black text-lg shadow-xl shadow-purple-500/20">
									Update Password
								</button>

								<div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
									<span className="text-slate-400 text-xs font-bold uppercase">
										OR
									</span>
								</div>

								<button
									onClick={onSwitchToLogin}
									className="w-full h-16 bg-gradient-to-r from-violet-800 to-purple-600 rounded-2xl outline outline-2 outline-pink-600 text-white font-black text-lg shadow-xl shadow-purple-500/20"
								>
									Back to Login
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Modal (Desktop)
	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-violet-950/60 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="relative flex w-[1024px] h-[768px] bg-neutral-100 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
				{/* Left Column */}
				<div className="w-1/2 h-full relative border-r-4 border-pink-600 flex flex-col items-stretch">
					<div className="flex-grow flex flex-col h-full overflow-hidden">
						<AuthHeader />
					</div>
				</div>

				{/* Right Column */}
				<div className="w-1/2 h-full p-16 flex flex-col justify-center relative bg-white">
					<button
						onClick={onClose}
						className="absolute top-8 right-8 text-pink-600 hover:text-violet-600 transition-colors"
					>
						<X size={24} />
					</button>

					<div className="space-y-8">
						<div>
							<h2 className="text-purple-600 text-4xl font-black uppercase tracking-tighter">
								Reset Password
							</h2>
						</div>

						{/* New Password Field */}
						<div className="space-y-2">
							<label
								htmlFor=""
								className="text-violet-600 text-xs font-medium font-['Inter']"
							>
								New Password:
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full h-12 px-4 bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all text-gray-900"
								/>
								<button
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-3 text-gray-500"
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>

							{/* Password Strength Meter */}
							<div className="w-full space-y-2 mt-2">
								{/* Visual Bars */}
								<div className="flex gap-2 h-2">
									{[1, 2, 3, 4].map((step) => (
										<div
											key={step}
											className={`flex-1 rounded-full transition-all duration-500 ${getStepColor(step)}`}
										/>
									))}
								</div>
							</div>

							{/* Strength Label */}
							<div className="flex justify-between items-center">
								<span className="text-violet-600 text-sm font-normal font-['Inter']">
									Password Strength:
									<span className="font-bold ml-1">
										{strengthLabels[strength]}
									</span>
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

						{/* Confirm Password Field */}
						<div className="space-y-2">
							<label
								htmlFor=""
								className="text-violet-600 text-xs font-medium font-['Inter']"
							>
								Confirm Password:
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full h-12 px-4 bg-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all text-gray-900"
								/>
								<button
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-3 text-gray-500"
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3 pt-4">
						<button className="w-full h-12 bg-gradient-to-r from-violet-800 to-purple-600 rounded-xl outline outline-2 outline-pink-600 text-white font-black tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-200">
							Update Password
						</button>

						<div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100">
							<span className="text-slate-400 text-xs font-bold uppercase">
								OR
							</span>
						</div>

						<button
							onClick={onSwitchToLogin}
							className="w-full h-12 bg-gradient-to-r from-violet-800 to-purple-600 rounded-xl outline outline-2 outline-pink-600 text-white font-black tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-200"
						>
							Back to Login
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetModal;
