import React, { useEffect, useRef, useState } from "react";
import { RefreshCw, Terminal, HelpCircle } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import CyberActionButton from "../../ui/CyberActionButton";
import AuthFooter from "./AuthFooter";
import CyberAlert from "../../ui/CyberAlert";

export const OTPModal = ({
	isOpen,
	onClose,
	purpose = "login",
	email = "",
	onSwitchToReset,
	onSwitchToLogin,
	onSwitchToForgot,
	onSwitchToData,
	onLoginSuccess,
}) => {
	const [otp, setOtp] = useState(["", "", "", ""]);
	const [timer, setTimer] = useState(60);
	const [isLoading, setIsLoading] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});

	const inputRefs = [useRef(), useRef(), useRef(), useRef()];

	useEffect(() => {
		if (isOpen) {
			setOtp(["", "", "", ""]);
			setTimer(60);
			setErrorField("");
			setAlert({ show: false, message: "", type: "error" });
			setTimeout(() => inputRefs[0].current?.focus(), 100);
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const interval = setInterval(() => {
			setTimer((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(interval);
	}, [isOpen]);

	const triggerStatus = (message, type = "error", fieldName = "") => {
		setAlert({ show: true, message, type });

		if (type === "error" && fieldName) {
			setErrorField("");
			setShakeTick((tick) => tick + 1);
			requestAnimationFrame(() => setErrorField(fieldName));
		} else {
			setErrorField("");
		}
	};

	const handleChange = (index, value) => {
		if (isNaN(value)) return;

		setAlert({ show: false, message: "", type: "error" });
		setErrorField("");

		const newOtp = [...otp];
		newOtp[index] = value.substring(value.length - 1);
		setOtp(newOtp);

		if (value && index < 3) {
			inputRefs[index + 1].current.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			setAlert({ show: false, message: "", type: "error" });
			setErrorField("");
			inputRefs[index - 1].current.focus();
		}
	};

	const handleVerify = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });

		const codeString = otp.join("");
		if (codeString.length < 4) {
			triggerStatus("PLEASE ENTER THE FULL 4-DIGIT CODE.", "error", "otp");
			return;
		}

		setIsLoading(true);

		try {
			const cleanLoginUrl =
				"http://localhost/techtrade_api/authentication/verify_login_otp.php";
			const cleanResetUrl =
				"http://localhost/techtrade_api/authentication/verify_reset_otp.php";

			const endpoint = purpose === "login" ? cleanLoginUrl : cleanResetUrl;

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					email: email.trim(),
					otp: codeString.trim(),
				}),
			});

			if (response.status === 404) {
				throw new Error(
					"ENDPOINT ROUTE NOT FOUND ON SERVER. VALIDATE .PHP FILENAME MATCHES.",
				);
			}

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Verification failed.");
			}

			if (purpose === "login") {
				triggerStatus("LOGIN VERIFIED!", "success");

				setTimeout(() => {
					setIsLoading(false);
					if (onLoginSuccess) onLoginSuccess(data);
					onClose();
				}, 2000);
			} else {
				triggerStatus("CODE VERIFIED! Redirecting...", "success");

				setTimeout(() => {
					setIsLoading(false);
					onSwitchToReset(email.trim(), codeString.trim());
				}, 2000);
			}
		} catch (error) {
			triggerStatus(error.message.toUpperCase(), "error", "otp");
			setIsLoading(false);
		}
	};

	const handleResend = async () => {
		if (timer > 0 || isLoading) return;
		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });

		try {
			const endpoint =
				"http://localhost/techtrade_api/authentication/resend_otp.php";

			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, purpose }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to re-transmit token.");
			}

			setOtp(["", "", "", ""]);
			setTimeout(() => inputRefs[0].current?.focus(), 50);

			triggerStatus(
				"A FRESH VERIFICATION CODE HAS BEEN TRANSMITTED.",
				"success",
			);
			setTimer(60);
		} catch (error) {
			triggerStatus(error.message.toUpperCase(), "error", "otp");
		}
	};

	return (
		<AuthModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			onBack={purpose === "login" ? onSwitchToLogin : onSwitchToForgot}
		>
			<div className="space-y-6 sm:space-y-8 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl selection:bg-fuchsia-500/30">
				<div className="space-y-1.5">
					<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
						OTP{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Verification
						</span>
					</h1>
					<p className="text-slate-500 sm:text-xs md:text-sm font-medium leading-normal uppercase tracking-wider pt-1">
						Please enter the 4-digit code sent to{" "}
						<span className="text-slate-300 font-bold">
							{email || "your email"}
						</span>{" "}
						to complete verification.
					</p>
				</div>

				{alert.show && (
					<CyberAlert
						type={alert.type}
						message={alert.message}
						onClose={() => setAlert({ ...alert, show: false })}
					/>
				)}

				<form
					onSubmit={handleVerify}
					className="space-y-6 sm:space-y-8"
					noValidate
				>
					<fieldset
						key={errorField === "otp" ? `shake-otp-${shakeTick}` : "normal-otp"}
						className={`flex justify-center gap-2 sm:gap-4 ${errorField === "otp" ? "animate-shake" : ""}`}
					>
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
								className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-center text-xl sm:text-2xl font-black rounded-lg bg-[#121214] text-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 focus:outline-none transition-all placeholder:text-slate-800 disabled:opacity-40 border ${
									errorField === "otp"
										? "border-rose-500 bg-rose-500/[0.02]"
										: "border-white/10"
								}`}
							/>
						))}
					</fieldset>

					<div className="flex justify-between items-center bg-black/30 p-3 sm:p-4 rounded-lg border border-white/5">
						<div className="sm:text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
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
							className={`text-sm md:text-base font-black uppercase tracking-widest flex items-center gap-1.5 py-1 px-2.5 rounded border transition-all ${
								timer > 0 || isLoading
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

					<div className="space-y-4 pt-2 border-t border-white/5">
						<CyberActionButton
							label={isLoading ? "Processing OTP Code" : "VERIFY CODE"}
							type="submit"
							isLoading={isLoading}
							className="w-full text-xs sm:text-sm tracking-widest font-black"
						/>

						<AuthFooter
							label="CANCEL"
							onClick={onSwitchToLogin}
							className="hover:text-fuchsia-400 text-xs text-center block w-full transition-colors font-bold tracking-wider"
						/>
					</div>
				</form>

				<div className="pt-2 flex justify-center items-center gap-1 sm:text-xs md:text-sm text-slate-600 font-bold uppercase tracking-wide">
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
