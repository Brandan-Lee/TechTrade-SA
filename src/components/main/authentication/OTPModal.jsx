import { ArrowLeft, RefreshCw, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import AuthHeader from "./AuthHeader";

export const OTPModal = ({
	isOpen,
	onClose,
	onSwitchToReset,
	onSwitchToLogin,
	onSwitchToForgot,
}) => {
	const [otp, setOtp] = useState(["", "", "", ""]);
	const [timer, setTimer] = useState(60);
	const inputRefs = [useRef(), useRef(), useRef(), useRef()];
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

	// Update layout mode on window resize
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 1024);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Countdown Timer logic
	useEffect(() => {
		if (!isOpen) return;

		const interval = setInterval(() => {
			setTimer((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => clearInterval(interval);
	}, [isOpen]);

	const handleChange = (index, value) => {
		if (isNaN(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value.substring(value.length - 1);
		setOtp(newOtp);

		if (value && index < 3) {
			inputRefs[index + 1].current.focus();
		}
	};

	// Handle Backspace
	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs[index - 1].current.focus();
		}
	};

	if (!isOpen) return null;

	if (isMobile) {
		return (
			<div className="fixed inset-0 z-[200] bg-neutral-100 flex flex-col animate-in slide-in-from-bottom duration-300">
				{/* Mobile Header: Branding Takeover */}
				<div className="relative">
					<button
						onClick={onSwitchToForgot}
						className="absolute top-6 left-6 z-[210] text-white/80 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
					>
						<ArrowLeft className="w-4 h-4" /> Back
					</button>

					<AuthHeader />
				</div>

				{/* Mobile Form */}
				<div className="flex-grow p-6 overflow-y-auto flex flex-col">
					<div className="space-y-8 w-full max-w-sm mx-auto">
						{/* Title and Instructions */}
						<div className="space-y-2">
							<h1 className="text-purple-600 text-5xl font-black uppercase tracking-tighter">
								OTP Verification
							</h1>
							<p className="text-gray-600 text-xs font-normal font-['Inter'] leading-tight mt-2 px-4">
								Please enter the OTP (One Time Password) sent to your registered
								email/phone number to complete your verification.
							</p>
						</div>

						{/* OTP Inputs */}
						<div className="flex justify-center gap-2 py-4">
							{otp.map((digit, index) => (
								<input
									key={index}
									ref={inputRefs[index]}
									type="text"
									maxLength="1"
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className="w-14 h-14 text-center text-xl font-bold rounded-[10px] border-2 border-violet-600 focus:border-pink-600 focus:outline-none text-violet-800"
								/>
							))}
						</div>

						{/* Timer and Resend */}
						<div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border-slate-100 bg-white focus:border-pink-600 focus:ring-1 focus:ring-pink-600 focus:outline-none text-violet-800 transition-all">
							<div className="text-sm font-['Inter']">
								<span className="text-gray-600">Remaining time:</span>
								<span className="text-pink-600 font-bold">
									00:{timer < 10 ? `0${timer}` : timer}s
								</span>
							</div>

							<button
								onClick={() => setTimer(60)}
								className="text-violet-800 text-xs font-medium hover:underline flex items-center gap-1"
							>
								<RefreshCw className="w-3 h-3" /> Resend
							</button>
						</div>

						{/* Action Buttons */}
						<div className="space-y-4">
							<button
								onClick={onSwitchToReset}
								className="w-full h-16 bg-gradient-to-r from-violet-800 to-purple-600 rounded-2xl outline outline-2 outline-pink-600 text-white font-black text-lg shadow-xl shadow-purple-500/20"
							>
								Verify
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
								Cancel
							</button>
						</div>

						{/* Footer Info */}
						<div className="text-center pt-4">
							<p className="text-gray-400 text-['Inter'] uppercase font-medium">
								Wondering how we use this code?
								<button className="text-violet-800 font-bold ml-1 underline">
									Know Here.
								</button>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// LAYOUT B: MODAL (Desktop)
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
								OTP Verifcation
							</h2>
							<p className="text-gray-600 text-xs font-normal font-['Inter'] leading-tight mt-2">
								Please enter the OTP (One Time Password) sent to your registered
								email/phone number to complete your verification.
							</p>
						</div>

						{/* OTP Inputs */}
						<div className="flex justify-between items-center gap-2">
							{otp.map((digit, index) => (
								<input
									key={index}
									ref={inputRefs[index]}
									type="text"
									maxLength="1"
									value={digit}
									onChange={(e) => handleChange(index, e.target.value)}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className="w-14 h-14 text-center text-xl font-bold rounded-[10px] border-2 border-violet-600 focus:border-pink-600 focus:outline-none text-violet-800"
								/>
							))}
						</div>

						{/* Timer and Resend */}
						<div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border-slate-100 bg-white focus:border-pink-600 focus:ring-1 focus:ring-pink-600 focus:outline-none text-violet-800 transition-all">
							<div className="px-3 py-1 rounded-full">
								<span className="text-gray-600">Remaining time:</span>
								<span className="text-pink-600 font-bold">
									00:{timer < 10 ? `0${timer}` : timer}s
								</span>
							</div>

							<button
								onClick={() => setTimer(60)}
								className="text-violet-800 text-xs font-medium hover:underline flex items-center gap-1"
							>
								<RefreshCw className="w-3 h-3" /> Resend
							</button>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3 pt-4">
							<button
								onClick={onSwitchToReset}
								className="w-full h-12 bg-gradient-to-r from-violet-800 to-purple-600 rounded-xl outline outline-2 outline-pink-600 text-white font-black tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-200"
							>
								Verify
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
								Cancel
							</button>
						</div>

						<p className="text-center text-[10px] text-gray-400">
							Wondering how we use this code?
							<button className="text-violet-800 underline font-bold ml-1">
								Know Here?
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OTPModal;
