import React, { useEffect, useRef, useState } from "react";
import { RefreshCw, Terminal, HelpCircle } from "lucide-react";
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
			triggerStatus("PLEASE ENTER THE FULL 4-DIGIT CODE.", "error", "otp");
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
				throw new Error(data.message || "Verification failed.");
			}

			if (isResetFlow) {
				triggerStatus("CODE VERIFIED!", "success");
				setTimeout(() => {
					setIsLoading(false);
					onSwitchToReset(email.trim(), codeString.trim());
				}, 2000);
			} else if (purpose === "login" || purpose === "admin") {
				triggerStatus("LOGIN VERIFIED!", "success");
				setTimeout(() => {
					setIsLoading(false);
					onClose();
					if (onLoginSuccess) onLoginSuccess(data, isFromAdmin);
				}, 2000);
			}
		} catch (error) {
			triggerStatus(error.message.toUpperCase(), "error", "otp");
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
			if (!response.ok) throw new Error("Failed to resend.");
			setOtp(["", "", "", ""]);
			setTimer(60);
			triggerStatus("CODE RETRANSMITTED.", "success");
		} catch (error) {
			triggerStatus(error.message.toUpperCase(), "error", "otp");
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
			<div className="space-y-6 sm:space-y-8 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl">
				<div className="space-y-1.5">
					<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
						{isFromAdmin ? "Staff" : "OTP"}{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Verification
						</span>
					</h1>
					<p className="text-slate-500 text-sm font-medium uppercase tracking-wider pt-1">
						Enter the code sent to{" "}
						<span className="text-slate-300 font-bold">{email}</span>
					</p>
				</div>

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
								className="w-16 h-16 text-center text-2xl font-black rounded-lg bg-[#121214] border border-white/10 text-white focus:border-fuchsia-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							/>
						))}
					</fieldset>

					<div className="flex justify-between items-center bg-black/30 p-4 rounded-lg border border-white/5">
						<span className="text-slate-500 text-sm font-bold uppercase tracking-widest">
							Expires:{" "}
							<span className="text-fuchsia-400">
								00:{timer < 10 ? `0${timer}` : timer}s
							</span>
						</span>
						<button
							type="button"
							disabled={isResendDisabled}
							onClick={handleResend}
							className={`font-black uppercase tracking-widest transition-all ${
								isResendDisabled
									? "text-slate-600 cursor-not-allowed opacity-40 pointer-events-none"
									: "text-fuchsia-400 hover:text-fuchsia-300 cursor-pointer"
							}`}
						>
							RESEND
						</button>
					</div>

					<CyberActionButton
						label={isLoading ? "PROCESSING..." : "VERIFY CODE"}
						type="submit"
						isLoading={isLoading}
					/>

					<AuthFooter
						label="CANCEL"
						onClick={onSwitchToLogin}
						className="hover:text-fuchsia-400 text-xs text-center block w-full transition-colors font-bold tracking-wider"
					/>
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
