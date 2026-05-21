import React, { useState } from "react";
import { Terminal, Cpu } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import { apiFetch } from "../../../lib/api";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import AuthFooter from "./AuthFooter";
import CyberAlert from "../../ui/CyberAlert";

export const ForgotModal = ({
	isOpen,
	onClose,
	onSwitchToOTP,
	onSwitchToLogin,
}) => {
	const [email, setEmail] = useState("");
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
		setEmail(value);
	};

	const handleRequestOTP = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		setErrorField("");
		setAlert({ show: false, message: "", type: "error" });

		if (!email.trim()) {
			triggerStatus("Email field cannot be empty.", "error", "email");
			return;
		}

		setIsLoading(true);

		try {
			const response = await apiFetch("/authentication/forgot_password.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim() }),
			});

			const data = await response.json();

			if (response.ok) {
				triggerStatus("Email Found! REDIRECTING...", "success");

				setTimeout(() => {
					setIsLoading(false);
					onSwitchToOTP(email.trim(), "reset");
				}, 2000);
			} else {
				const fieldTarget = data.field || "email";
				triggerStatus(
					data.message || "Gateway rejection.",
					"error",
					fieldTarget,
				);
				setIsLoading(false);
			}
		} catch (error) {
			triggerStatus(
				"CONNECTION TO THE TECHTRADE NETWORK FAILED.",
				"error",
				"email",
			);
			setIsLoading(false);
		}
	};

	return (
		<AuthModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			onBack={onSwitchToLogin}
		>
			<div className="space-y-6 sm:space-y-8 p-1 selection:bg-fuchsia-500/30 selection:text-white font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl">
				<div className="space-y-1.5">
					<h1 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">
						Forgot{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-500">
							Password
						</span>
					</h1>
					<p className="text-slate-500 text-[11px] sm:text-xs font-medium uppercase tracking-wider pt-1">
						Please enter the email of the account that you would like to recover
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
					onSubmit={handleRequestOTP}
					className="space-y-5 sm:space-y-6"
					noValidate
				>
					<div className="relative group flex flex-col gap-1">
						<div className="absolute top-3 right-4 pointer-events-none text-slate-700 group-focus-within:text-fuchsia-500/40 transition-colors hidden sm:block">
							<Terminal size={14} />
						</div>

						<AuthInput
							key={
								errorField === "email"
									? `shake-email-${shakeTick}`
									: "normal-email"
							}
							id="recovery-email"
							label="Email"
							type="email"
							name="email" 
							value={email}
							onChange={handleInputChange} 
							placeholder="user@network.com"
							required
							disabled={isLoading}
							error={errorField === "email"}
							className={errorField === "email" ? "animate-shake" : ""}
						/>
					</div>

					<div className="space-y-4 pt-2 border-t border-white/5">
						<CyberActionButton
							label={isLoading ? "DISPATCHING GATEWAY KEY" : "REQUEST OTP"}
							type="submit"
							isLoading={isLoading}
							className="w-full text-xs sm:text-sm tracking-widest font-black"
						/>

						<div className="flex justify-center items-center gap-2 text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-wide">
							<Cpu size={10} />
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

export default ForgotModal;
