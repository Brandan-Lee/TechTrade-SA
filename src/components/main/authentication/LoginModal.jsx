import React, { useState, useEffect, useRef } from "react";
import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import CyberAlert from "../../ui/CyberAlert";
import { useAuthModalScroll } from "./AuthModalScrollContext";

const LoginModal = ({
	isOpen,
	onClose,
	onSwitchToForgot,
	onSwitchToRegister,
	onSwitchToOTP,
}) => {
	const location = useLocation();
	const navigate = useNavigate();

	// 🚀 FIX: Track whether this specific open instance came from the admin panel using local state
	const [isFromAdmin, setIsFromAdmin] = useState(false);

	useEffect(() => {
		if (isOpen) {
			// 1. Check if the router currently contains the admin redirect instruction flag
			if (location.state?.fromAdmin === true) {
				setIsFromAdmin(true);

				// 2. Clear the browser history state immediately after saving it locally.
				// This stops it from sticking around if the user refreshes or closes the modal.
				navigate(".", { replace: true, state: {} });
			}
		} else {
			// Reset the local state back to false when the modal closes completely
			setIsFromAdmin(false);
		}
	}, [isOpen, location.state, navigate]);

	return (
		<AuthModalWrapper isOpen={isOpen} onClose={onClose} onBack={onClose}>
			<LoginModalContent
				onSwitchToForgot={onSwitchToForgot}
				onSwitchToRegister={onSwitchToRegister}
				onSwitchToOTP={onSwitchToOTP}
				isFromAdmin={isFromAdmin}
			/>
		</AuthModalWrapper>
	);
};

const LoginModalContent = ({
	onSwitchToForgot,
	onSwitchToRegister,
	onSwitchToOTP,
	isFromAdmin,
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

	const triggerStatus = (message, type = "error", fieldName = "") => {
		scrollToTop?.();
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
			triggerStatus("Email field cannot be empty.", "error", "email");
			return;
		}
		if (!formData.password) {
			triggerStatus("Password field cannot be empty.", "error", "password");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(
				"http://localhost/techtrade_api/authentication/login.php",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
					credentials: "include",
				},
			);

			const data = await response.json();

			if (response.ok) {
				triggerStatus("Authentication successful. Redirecting...", "success");
				setTimeout(() => {
					onSwitchToOTP(formData.email.trim(), isFromAdmin ? "admin" : "login");
				}, 2000);
			} else {
				const fieldTarget = data.field || "credentials";
				triggerStatus(
					data.message || "Authentication failed.",
					"error",
					fieldTarget,
				);
				setIsLoading(false);
			}
		} catch (err) {
			triggerStatus(
				"Connection to the TechTrade network failed.",
				"error",
				"credentials",
			);
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-10 py-4">
			<div className="space-y-2">
				<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
					{isFromAdmin ? "Staff" : "User"}{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
						Login
					</span>
				</h1>
			</div>

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
					label="EMAIL"
					type="email"
					name="email"
					placeholder="user@network.com"
					value={formData.email}
					onChange={handleInputChange}
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
									className="accent-fuchsia-500 bg-slate-800 border-slate-600 rounded"
									checked={formData.rememberMe}
									onChange={(e) =>
										setFormData({ ...formData, rememberMe: e.target.checked })
									}
								/>
								<span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest group-hover:text-fuchsia-400 transition-colors">
									Remember Me
								</span>
							</label>

							<button
								type="button"
								onClick={onSwitchToForgot}
								className="text-slate-500 text-xs md:text-sm font-black uppercase tracking-widest hover:text-fuchsia-400 transition-all flex items-center gap-2"
							>
								<Lock size={10} /> FORGOT PASSWORD?
							</button>
						</div>
					)}
				</div>

				<CyberActionButton
					label={isLoading ? "SUBMITTING LOGIN" : "LOGIN"}
					type="submit"
					isLoading={isLoading}
				/>
			</form>

			{!isFromAdmin && (
				<div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-2">
						<span className="text-slate-600 text-sm md:text-base font-black uppercase tracking-widest">
							New to TechTrade?
						</span>
						<button
							type="button"
							onClick={onSwitchToRegister}
							className="group relative px-6 py-2"
						>
							<span className="relative z-10 text-violet-400 font-black uppercase text-xs md:text-sm tracking-[0.3em] group-hover:text-fuchsia-400 transition-colors">
								REGISTER NOW
							</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default LoginModal;
