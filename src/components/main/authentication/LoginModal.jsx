import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import CyberAlert from "../../ui/CyberAlert";
import { useAuthModalScroll } from "./AuthModalScrollContext";
import { apiFetch } from "../../../lib/api";

const LoginModal = ({
	isOpen,
	onClose,
	purpose = "login",
	onSwitchToForgot,
	onSwitchToRegister,
	onSwitchToOTP,
	onLoginSuccess,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const scrollToTop = useAuthModalScroll();
	const [alert, setAlert] = useState({
		show: false,
		message: "",
		type: "error",
	});

	const navigate = useNavigate();
	const isFromAdmin = purpose === "admin";

	useEffect(() => {
		if (isOpen) {
			setFormData({ email: "", password: "", rememberMe: false });
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

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setAlert({ show: false, message: "", type: "error" });
		if (errorField === name || errorField === "credentials") {
			setErrorField("");
		}

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });

		if (!formData.email.trim()) {
			triggerStatus("Please enter your email address.", "error", "email");
			return;
		}
		if (!formData.password) {
			triggerStatus("Please enter your password.", "error", "password");
			return;
		}

		setIsLoading(true);

		try {
			const response = await apiFetch("/authentication/login.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					purpose: isFromAdmin ? "admin" : "login",
				}),
			});

			const data = await response.json();

			if (!response.ok || data.status === "error") {
				throw new Error(data.message || "Invalid email or password.");
			}

			if (data.status === "pending_otp") {
				triggerStatus("Verifying your identity...", "success");
				setTimeout(() => {
					setIsLoading(false);
					onSwitchToOTP(formData.email.trim(), purpose);
				}, 2000);
			} else if (
				data.status === "success" &&
				(data.user?.roleId === 4 || data.user?.roleId === 3)
			) {
				triggerStatus(
					"Login successful. Redirecting to your dashboard.",
					"success",
				);
				setTimeout(() => {
					setIsLoading(false);
					onClose();
					if (onLoginSuccess) {
						onLoginSuccess(data, isFromAdmin);
					}
				}, 2000);
			} else {
				triggerStatus("Login successful!", "success");
				setTimeout(() => {
					setIsLoading(false);
					onClose();
				}, 2000);
			}
		} catch (err) {
			triggerStatus(err.message, "error", "credentials");
			setIsLoading(false);
		}
	};

	return (
		<AuthModalWrapper isOpen={isOpen} onClose={onClose} onBack={onClose}>
			<div className="space-y-10 py-4 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl text-xs sm:text-sm md:text-base lg:text-lg">
				<header className="space-y-2">
					<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						{isFromAdmin ? "Staff" : "User"}{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Login
						</span>
					</h1>
				</header>

				{alert.show && (
					<CyberAlert
						type={alert.type}
						message={alert.message}
						onClose={() => setAlert({ ...alert, show: false })}
					/>
				)}

				<form onSubmit={handleLogin} className="space-y-6" noValidate>
					<AuthInput
						key={
							errorField === "email" || errorField === "credentials"
								? `shake-email-${shakeTick}`
								: "normal-email"
						}
						label="EMAIL ADDRESS"
						type="email"
						name="email"
						placeholder="user@example.com"
						value={formData.email}
						onChange={handleInputChange}
						disabled={isLoading}
						error={errorField === "email" || errorField === "credentials"}
						className={
							errorField === "email" || errorField === "credentials"
								? "animate-shake"
								: ""
						}
						required
					/>

					<div className="space-y-3">
						<AuthInput
							key={
								errorField === "password" || errorField === "credentials"
									? `shake-pass-${shakeTick}`
									: "normal-pass"
							}
							label="PASSWORD"
							type="password"
							name="password"
							isPassword={true}
							showPassword={showPassword}
							togglePassword={() => setShowPassword(!showPassword)}
							value={formData.password}
							onChange={handleInputChange}
							disabled={isLoading}
							error={errorField === "password" || errorField === "credentials"}
							className={
								errorField === "password" || errorField === "credentials"
									? "animate-shake"
									: ""
							}
							required
						/>

						{!isFromAdmin && (
							<div className="flex justify-between items-center">
								<label className="flex items-center gap-2 cursor-pointer group">
									<input
										type="checkbox"
										disabled={isLoading}
										className="accent-fuchsia-500 bg-slate-800 border-slate-600 rounded"
										checked={formData.rememberMe}
										onChange={(e) =>
											setFormData({ ...formData, rememberMe: e.target.checked })
										}
									/>
									<span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest group-hover:text-fuchsia-400 transition-colors">
										Remember Me
									</span>
								</label>

								<button
									type="button"
									onClick={onSwitchToForgot}
									className="text-slate-500 text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest hover:text-fuchsia-400 transition-all flex items-center gap-2"
								>
									<Lock size={10} /> FORGOT PASSWORD?
								</button>
							</div>
						)}
					</div>

					<CyberActionButton
						label={isLoading ? "Please wait..." : "LOGIN"}
						type="submit"
						isLoading={isLoading}
					/>
				</form>

				{!isFromAdmin && (
					<footer className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
						<div className="flex flex-col items-center gap-2">
							<span className="text-slate-600 text-xs sm:text-sm md:text-base font-black uppercase tracking-widest">
								New to TechTrade?
							</span>
							<button
								type="button"
								onClick={onSwitchToRegister}
								className="group relative px-6 py-2"
							>
								<span className="relative z-10 text-violet-400 font-black uppercase text-[10px] sm:text-xs md:text-sm tracking-[0.3em] group-hover:text-fuchsia-400 transition-colors">
									REGISTER NOW
								</span>
							</button>
						</div>
					</footer>
				)}
			</div>
		</AuthModalWrapper>
	);
};

export default LoginModal;
