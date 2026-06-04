import React, { useEffect, useRef, useState } from "react";
import { HelpCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModalWrapper from "./AuthModalWrapper";
import CyberActionButton from "../../ui/CyberActionButton";
import AuthFooter from "./AuthFooter";
import CyberAlert from "../../ui/CyberAlert";
import { apiFetch } from "../../../lib/api";

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

	const location = useLocation();
	const isFromAdmin = purpose === "admin";
	const inputRefs = [useRef(), useRef(), useRef(), useRef()];
	const navigate = useNavigate();

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
		if (value && index < 3) inputRefs[index + 1].current.focus();
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs[index - 1].current.focus();
		}
	};

	const handleVerify = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		const codeString = otp.join("");
		if (codeString.length < 4) {
			triggerStatus("Please enter the full 4-digit code.", "error", "otp");
			return;
		}

		setIsLoading(true);
		const isResetFlow = purpose === "reset";

		try {
			const response = isResetFlow
				? await apiFetch("/authentication/verify_reset_otp.php", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: email.trim(),
							otp: codeString.trim(),
						}),
					})
				: await apiFetch("/authentication/verify_login_otp.php", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: email.trim(),
							otp: codeString.trim(),
							purpose: purpose === "admin" ? "login" : purpose,
							rememberMe: true,
						}),
					});

			const data = await response.json();
			if (!response.ok || data.status === "error") {
				throw new Error(
					data.message || "Verification failed. Please try again.",
				);
			}

			if (isResetFlow) {
				triggerStatus("Code verified successfully!", "success");
				setTimeout(() => {
					setIsLoading(false);
					onSwitchToReset(email.trim(), codeString.trim());
				}, 2000);
			} else if (purpose === "login" || purpose === "admin") {
				triggerStatus("Login verified!", "success");
				setTimeout(() => {
					setIsLoading(false);
					onClose();
					if (onLoginSuccess) onLoginSuccess(data, isFromAdmin);
				}, 2000);
			}
		} catch (error) {
			triggerStatus(error.message, "error", "otp");
			setIsLoading(false);
		}
	};

	const handleResend = async () => {
		if (timer > 0 || isLoading) return;
		try {
			const response = await apiFetch("/authentication/resend_otp.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					purpose: purpose === "admin" ? "login" : purpose,
				}),
			});
			if (!response.ok) throw new Error("Could not resend code.");
			setOtp(["", "", "", ""]);
			setTimer(60);
			triggerStatus("A new code has been sent.", "success");
		} catch (error) {
			triggerStatus(error.message, "error", "otp");
		}
	};

	const isResendDisabled = timer > 0 || isLoading;

	return (
		<AuthModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			onBack={
				purpose === "login" || purpose === "admin"
					? onSwitchToLogin
					: onSwitchToForgot
			}
		>
			<div className="space-y-6 sm:space-y-8 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl text-xs sm:text-sm md:text-base lg:text-lg">
				<header className="space-y-1.5">
					<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						{isFromAdmin ? "Staff" : "Verification"}{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Code
						</span>
					</h1>
					<p className="text-slate-500 text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider pt-1">
						Enter the code sent to{" "}
						<span className="text-slate-300 font-bold">{email}</span>
					</p>
				</header>

				{alert.show && (
					<CyberAlert
						{...alert}
						onClose={() => setAlert({ ...alert, show: false })}
					/>
				)}

				<form onSubmit={handleVerify} className="space-y-6" noValidate>
					<fieldset className="flex justify-center gap-2 sm:gap-4">
						{otp.map((digit, index) => (
							<input
								key={index}
								ref={inputRefs[index]}
								type="text"
								maxLength="1"
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								disabled={isLoading}
								className="w-16 h-16 text-center text-xl sm:text-2xl font-black rounded-lg bg-[#121214] border border-white/10 text-white focus:border-fuchsia-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							/>
						))}
					</fieldset>

					<div className="flex justify-between items-center bg-black/30 p-4 rounded-lg border border-white/5">
						<span className="text-slate-500 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest">
							Expires in:{" "}
							<span className="text-fuchsia-400">
								00:{timer < 10 ? `0${timer}` : timer}
							</span>
						</span>
						<button
							type="button"
							disabled={isResendDisabled}
							onClick={handleResend}
							className={`text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest transition-all ${
								isResendDisabled
									? "text-slate-600 cursor-not-allowed opacity-40 pointer-events-none"
									: "text-fuchsia-400 hover:text-fuchsia-300 cursor-pointer"
							}`}
						>
							Resend Code
						</button>
					</div>

					<CyberActionButton
						label={isLoading ? "Processing..." : "Verify Code"}
						type="submit"
						isLoading={isLoading}
					/>

					<AuthFooter
						label="Cancel"
						onClick={onSwitchToLogin}
						className="hover:text-fuchsia-400 text-[10px] sm:text-xs md:text-sm text-center block w-full transition-colors font-bold tracking-wider"
					/>
				</form>

				<footer className="pt-2 flex justify-center items-center gap-1 text-[10px] sm:text-xs md:text-sm text-slate-600 font-bold uppercase tracking-wide">
					<HelpCircle size={12} className="text-slate-700" />
					<span>Need help with this code?</span>
					<button
						type="button"
						onClick={onSwitchToData}
						className="text-fuchsia-500/60 hover:text-fuchsia-400 transition-colors underline ml-0.5 focus:outline-none"
					>
						Learn more
					</button>
				</footer>
			</div>
		</AuthModalWrapper>
	);
};

export default OTPModal;
