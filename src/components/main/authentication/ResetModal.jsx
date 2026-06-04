import React, { useState, useEffect } from "react";
import { ShieldAlert, Eye, EyeOff } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import { apiFetch } from "../../../lib/api";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import AuthFooter from "./AuthFooter";
import CyberAlert from "../../ui/CyberAlert";
import { useAuthModalScroll } from "./AuthModalScrollContext";
import PasswordStrengthMeter from "../../ui/PasswordStrengthMeter"

export const ResetModal = ({
	isOpen,
	onClose,
	onSwitchToLogin,
	onSwitchToOTP,
	email = "",
	otpCode = "",
}) => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const scrollToTop = useAuthModalScroll();
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});

	useEffect(() => {
		if (isOpen) {
			setPassword("");
			setConfirmPassword("");
			setErrorField("");
			setAlert({ show: false, message: "", type: "error" });
		}
	}, [isOpen]);

	const triggerStatus = (message, type = "error", fieldName = "") => {
		scrollToTop?.();
		setAlert({ show: true, message, type });

		if (type === "error" && fieldName) {
			setErrorField("");
			setShakeTick((tick) => tick + 1);
			requestAnimationFrame(() => {
				setTimeout(() => setErrorField(fieldName), 0);
			});
		} else {
			setErrorField("");
		}
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });

		if (!password) {
			triggerStatus("Please enter a new password.", "error", "password");
			return;
		}
		if (password.length < 8) {
			triggerStatus(
				"Password must be at least 8 characters long.",
				"error",
				"password",
			);
			return;
		}
		if (password !== confirmPassword) {
			triggerStatus("Passwords do not match.", "error", "confirmPassword");
			return;
		}

		setIsLoading(true);

		try {
			const response = await apiFetch("/authentication/reset_password.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email.trim(),
					otp: otpCode ? otpCode.trim() : "",
					password: password,
				}),
			});

			const data = await response.json();

			if (!response.ok || data.status === "error") {
				throw new Error(data.message || "Failed to update your password.");
			}

			triggerStatus(
				"Password updated successfully! Returning to login...",
				"success",
			);

			setTimeout(() => {
				setIsLoading(false);
				onSwitchToLogin();
			}, 2500);
		} catch (error) {
			triggerStatus(error.message, "error", "password");
			setIsLoading(false);
		}
	};

	return (
		<AuthModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			onBack={otpCode ? onSwitchToOTP : onSwitchToLogin}
		>
			<div className="space-y-6 sm:space-y-8 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl">
				<div className="space-y-1.5">
					<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
						Reset{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Password
						</span>
					</h1>
					<p className="text-slate-500 text-[11px] sm:text-xs font-medium uppercase tracking-wider pt-1">
						Set a new password for your account:{" "}
						<span className="text-slate-400 font-bold">{email}</span>
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
					onSubmit={handleResetPassword}
					className="space-y-5 sm:space-y-6"
					noValidate
				>
					<div className="space-y-4">
						<AuthInput
							key={
								errorField === "password"
									? `shake-pass-${shakeTick}`
									: "normal-pass"
							}
							label="NEW PASSWORD"
							type="password"
							name="password"
							isPassword={true}
							showPassword={showPassword}
							togglePassword={() => setShowPassword(!showPassword)}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
							error={errorField === "password"}
							className={errorField === "password" ? "animate-shake" : ""}
							placeholder="••••••••••••"
							required
						/>
						<div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
							<PasswordStrengthMeter password={password} />
						</div>

						<AuthInput
							key={
								errorField === "confirmPassword"
									? `shake-conf-${shakeTick}`
									: "normal-conf"
							}
							label="CONFIRM PASSWORD"
							type="password"
							name="confirmPassword"
							isPassword={true}
							showPassword={showPassword}
							togglePassword={() => setShowPassword(!showPassword)}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={isLoading}
							error={errorField === "confirmPassword"}
							className={
								errorField === "confirmPassword" ? "animate-shake" : ""
							}
							placeholder="••••••••••••"
							required
						/>
					</div>

					<div className="space-y-4 pt-2 border-t border-white/5">
						<CyberActionButton
							label={isLoading ? "Updating..." : "Reset Password"}
							type="submit"
							isLoading={isLoading}
						/>

						<div className="flex justify-center items-center gap-2 text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-wide">
							<ShieldAlert size={11} />
							<AuthFooter
								label="Cancel"
								onClick={onSwitchToLogin}
								className="hover:text-fuchsia-400 transition-colors focus:outline-none"
							/>
						</div>
					</div>
				</form>
			</div>
		</AuthModalWrapper>
	);
};

export default ResetModal;
