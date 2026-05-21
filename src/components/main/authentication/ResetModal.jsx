import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import { apiFetch } from "../../../lib/api";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import PasswordStrengthMeter from "../../ui/PasswordStrengthMeter";
import AuthFooter from "./AuthFooter";
import CyberAlert from "../../ui/CyberAlert";

export const ResetModal = ({
	isOpen,
	onClose,
	onSwitchToOTP,
	onSwitchToLogin,
	email = "",
	otpCode = "",
}) => {
	const [newShowPassword, newSetShowPassword] = useState(false);
	const [confirmShowPassword, confirmSetShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});

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

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setAlert({ show: false, message: "", type: "error" });
		if (errorField === name) {
			setErrorField("");
		}

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const calculateStrength = (password) => {
		const checks = {
			length: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			lowercase: /[a-z]/.test(password),
			number: /[0-9]/.test(password),
			symbol: /[^A-Za-z0-9]/.test(password),
		};
		return Object.values(checks).filter(Boolean).length;
	};

	const handleReset = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });

		if (!email || !otpCode) {
			triggerStatus(
				"SESSION ERROR: Missing validation context tokens. Please restart process.",
				"error",
				"password",
			);
			return;
		}

		if (!formData.password) {
			triggerStatus("Password field cannot be empty.", "error", "password");
			return;
		}

		if (calculateStrength(formData.password) < 5) {
			triggerStatus(
				"Password is too weak. Please ensure all parameter criteria checks are met.",
				"error",
				"password",
			);
			return;
		}

		if (formData.password !== formData.confirmPassword) {
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
					otp: otpCode.trim(),
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				triggerStatus(
					"PASSWORD MODIFIED SUCCESSFULLY! REDIRECTING...",
					"success",
				);

				setTimeout(() => {
					setIsLoading(false);
					onSwitchToLogin();
				}, 2000);
			} else {
				const fieldTarget = data.field || "password";
				triggerStatus(
					data.message || "Security parameter verification failed.",
					"error",
					fieldTarget,
				);
				setIsLoading(false);
			}
		} catch (error) {
			triggerStatus(
				"CONNECTION TO THE TECHTRADE NETWORK FAILED.",
				"error",
				"password",
			);
			setIsLoading(false);
		}
	};

	return (
		<AuthModalWrapper isOpen={isOpen} onClose={onClose} onBack={onSwitchToOTP}>
			<div className="space-y-6 sm:space-y-8 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl selection:bg-fuchsia-500/30">
				<div className="space-y-1.5">
					<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
						Reset{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Password
						</span>
					</h1>
					<p className="text-slate-500 md:text-sm sm:text-xs font-medium leading-normal uppercase tracking-wider pt-1">
						Please enter a new password. It must meet all mandatory diagnostic
						security parameters.
					</p>
				</div>

				{alert.show && (
					<CyberAlert
						type={alert.type}
						message={alert.message}
						onClose={() => setAlert({ ...alert, show: false })}
					/>
				)}

				<form onSubmit={handleReset} className="space-y-5" noValidate>
					<div className="space-y-2.5">
						<AuthInput
							key={
								errorField === "password"
									? `shake-pw-${shakeTick}`
									: "normal-pw"
							}
							label="New Password"
							type={newShowPassword ? "text" : "password"}
							name="password"
							isPassword={true}
							value={formData.password}
							onChange={handleInputChange}
							showPassword={newShowPassword}
							togglePassword={() => newSetShowPassword(!newShowPassword)}
							disabled={isLoading}
							error={errorField === "password"}
							className={errorField === "password" ? "animate-shake" : ""}
							required
						/>

						<div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
							<PasswordStrengthMeter password={formData.password} />
						</div>
					</div>

					<AuthInput
						key={
							errorField === "confirmPassword"
								? `shake-cpw-${shakeTick}`
								: "normal-cpw"
						}
						label="Confirm Password"
						type={confirmShowPassword ? "text" : "password"}
						name="confirmPassword"
						isPassword={true}
						value={formData.confirmPassword}
						onChange={handleInputChange}
						showPassword={confirmShowPassword}
						togglePassword={() => confirmSetShowPassword(!confirmShowPassword)}
						disabled={isLoading}
						error={errorField === "confirmPassword"}
						className={errorField === "confirmPassword" ? "animate-shake" : ""}
						required
					/>

					<div className="space-y-4 pt-4 border-t border-white/5">
						<CyberActionButton
							label={isLoading ? "DISPATCHING CHANGES" : "UPDATE PASSWORD"}
							type="submit"
							isLoading={isLoading}
							className="w-full text-xs sm:text-sm tracking-widest font-black"
						/>

						<div className="flex justify-center items-center gap-1.5 text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-wide">
							<ShieldCheck size={11} className="text-slate-700" />
							<AuthFooter
								label="BACK TO LOGIN"
								onClick={onSwitchToLogin}
								className="hover:text-fuchsia-400 transition-colors focus:outline-none focus:underline"
							/>
						</div>
					</div>
				</form>
			</div>
		</AuthModalWrapper>
	);
};

export default ResetModal;
