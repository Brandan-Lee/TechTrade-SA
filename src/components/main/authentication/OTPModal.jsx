import React, { useEffect, useRef, useState } from "react";
import { RefreshCw, KeyRound, Terminal, HelpCircle } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import CyberActionButton from "../../ui/CyberActionButton";
import AuthFooter from "./AuthFooter";

export const OTPModal = ({
	isOpen,
	onClose,
	onSwitchToReset,
	onSwitchToLogin,
	onSwitchToForgot,
	onSwitchToData,
}) => {
	const [otp, setOtp] = useState(["", "", "", ""]);
	const [timer, setTimer] = useState(60);
	const [isLoading, setIsLoading] = useState(false);
	const inputRefs = [useRef(), useRef(), useRef(), useRef()];

	// --- Secure Token Countdown Counter Lifecycle ---
	useEffect(() => {
		if (!isOpen) return;
		const interval = setInterval(() => {
			setTimer((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(interval);
	}, [isOpen]);

	// --- Segmented Field Parsing System ---
	const handleChange = (index, value) => {
		if (isNaN(value)) return;
		const newOtp = [...otp];
		newOtp[index] = value.substring(value.length - 1);
		setOtp(newOtp);

		// Advance cursor pipeline to adjacent input track
		if (value && index < 3) {
			inputRefs[index + 1].current.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs[index - 1].current.focus();
		}
	};

	const handleVerify = async (e) => {
		e.preventDefault();
		const codeString = otp.join("");
		if (codeString.length < 4) return;

		setIsLoading(true);
		try {
			// Pipeline payload securely to auth matrix
			// await api.verifyOTP(codeString);

			// Advance view architecture state forward on success
			onSwitchToReset();
		} catch (error) {
			console.error("TOKEN_DECRYPTION_EXCEPTION:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResend = () => {
		if (timer > 0) return;
		// Re-transmit cryptographic stream down link channels
		setTimer(60);
	};

	return (
		<AuthModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			onBack={onSwitchToForgot}
		>
			<div className="space-y-6 sm:space-y-8 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl selection:bg-fuchsia-500/30">
				{/* Visual Anchor Terminal Top Header */}
				<div className="space-y-1.5">
					<h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
						OTP Verification
					</h1>
					<p className="text-slate-500 text-[11px] sm:text-xs font-medium leading-normal uppercase tracking-wider pt-1">
						Please enter the 4-digit code sent to your registered email to complete verification.
					</p>
				</div>

				{/* Secure Recovery Gateway Form */}
				<form onSubmit={handleVerify} className="space-y-6 sm:space-y-8">
					{/* Character Array Input Matrix Fieldset */}
					<fieldset className="flex justify-center gap-2 sm:gap-4">
						<legend className="sr-only">Enter 4-digit verification code</legend>
						{otp.map((digit, index) => (
							<input
								key={index}
								ref={inputRefs[index]}
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								maxLength="1"
								aria-label={`Digit ${index + 1} of 4`}
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								disabled={isLoading}
								className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-center text-xl sm:text-2xl font-black rounded-lg border border-white/10 bg-[#121214] text-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none transition-all placeholder:text-slate-800 disabled:opacity-40"
							/>
						))}
					</fieldset>

					{/* Cryptographic Key Expiration Monitor Box */}
					<div className="flex justify-between items-center bg-black/30 p-3 sm:p-4 rounded-lg border border-white/5">
						<div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
							<Terminal size={12} className="text-fuchsia-500" />
							<span>Expires in:</span>
							<span className="text-fuchsia-400 font-black tabular-nums">
								00:{timer < 10 ? `0${timer}` : timer}s
							</span>
						</div>
						<button
							type="button"
							disabled={timer > 0 || isLoading}
							onClick={handleResend}
							className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 py-1 px-2.5 rounded border transition-all ${
								timer > 0
									? "text-slate-700 border-transparent cursor-not-allowed"
									: "text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/[0.02] hover:border-fuchsia-500/50 hover:bg-fuchsia-500/[0.05]"
							} focus:outline-none focus:ring-1 focus:ring-fuchsia-500`}
						>
							<RefreshCw
								className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
							/>
							<span>RESEND</span>
						</button>
					</div>

					{/* Operational Executable Stack Buttons */}
					<div className="space-y-4 pt-2 border-t border-white/5">
						<CyberActionButton
							label={
								isLoading ? "" : "VERIFY CODE"
							}
							type="submit"
							isLoading={isLoading}
							className="w-full text-xs sm:text-sm tracking-widest font-black"
                            onClick={onSwitchToReset}
						/>

						<AuthFooter
							label="CANCEL"
							onClick={onSwitchToLogin}
							className="hover:text-fuchsia-400 text-xs text-center block w-full transition-colors font-bold tracking-wider"
						/>
					</div>
				</form>

				{/* Sub-node Informational Diagnostic Footer */}
				<div className="pt-2 flex justify-center items-center gap-1 text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-wide">
					<HelpCircle size={12} className="text-slate-700" />
					<span>Wondering how we use this code for verification?</span>
					<button
						type="button"
						onClick={onSwitchToData}
						className="text-fuchsia-500/60 hover:text-fuchsia-400 transition-colors underline ml-0.5 focus:outline-none"
					>
						Know here
					</button>
				</div>
			</div>
		</AuthModalWrapper>
	);
};

export default OTPModal;
