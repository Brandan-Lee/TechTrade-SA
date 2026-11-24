import React, { useState, useEffect } from "react";
import { Terminal, Cpu } from "lucide-react";
import AuthModalWrapper from "@/features/auth/components/AuthModalWrapper";
import { apiFetch } from "@/lib/api";
import AuthInput from "@/components/ui/AuthInput";
import CyberActionButton from "@/components/ui/CyberActionButton";
import AuthFooter from "@/features/auth/components/AuthFooter";
import CyberAlert, { type AlertType } from "@/components/ui/CyberAlert";
import { useAuthModalScroll } from "@/features/auth/context/AuthModalScrollContext";

export const ForgotModal = ({
	isOpen,
	onClose,
	onSwitchToOTP,
	onSwitchToLogin,
	onSwitchToReset,
}) => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorField, setErrorField] = useState("");
	const [shakeTick, setShakeTick] = useState(0);
	const scrollToTop = useAuthModalScroll();
	const [alert, setAlert] = useState<{ show: boolean; message: string; type: AlertType }>({
		show: false,
		message: "",
		type: "error",
	});

	useEffect(() => {
		if (isOpen) {
			setEmail("");
			setErrorField("");
			setAlert({ show: false, message: "", type: "error" });
		}
	}, [isOpen]);

	const triggerStatus = (message: string, type: AlertType = "error", fieldName = "") => {
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
		if (errorField === name || errorField === "email") {
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
			triggerStatus("Please enter your email address.", "error", "email");
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

			if (!response.ok || data.status === "error") {
				throw new Error(
					data.message ||
						"We could not process your request. Please try again.",
				);
			}

			if (data.status === "pending_otp") {
				triggerStatus(
					"Security code sent. Please check your email.",
					"success",
				);

				setTimeout(() => {
					setIsLoading(false);
					onSwitchToOTP(email.trim(), "reset");
				}, 2000);
			} else if (data.status === "success") {
				triggerStatus(
					data.message || "Email verified. Proceeding to reset.",
					"success",
				);

				setTimeout(() => {
					setIsLoading(false);
					onSwitchToReset(email.trim());
					onClose();
				}, 200);
			}
		} catch (error) {
			triggerStatus(
				error.message ||
					"Unable to connect to the server. Please try again later.",
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
			<div className="space-y-6 sm:space-y-8 p-1 selection:bg-secondary/30 selection:text-white font-mono bg-base-200/95 text-slate-300 rounded-xl text-sm">
				<header className="space-y-1.5">
					<h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
						Forgot{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-violet-500">
							Password
						</span>
					</h1>
					<p className="text-slate-500 text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wider pt-1">
						Enter the email address associated with your account to reset your
						password.
					</p>
				</header>

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
						<div className="absolute top-3 right-4 pointer-events-none text-slate-700 group-focus-within:text-secondary/40 transition-colors hidden sm:block">
							<Terminal size={14} />
						</div>

						<AuthInput
							key={
								errorField === "email"
									? `shake-email-${shakeTick}`
									: "normal-email"
							}
							id="recovery-email"
							label="Email Address"
							type="email"
							name="email"
							value={email}
							onChange={handleInputChange}
							placeholder="name@example.com"
							required
							disabled={isLoading}
							error={errorField === "email"}
							className={errorField === "email" ? "animate-shake" : ""}
						/>
					</div>

					<footer className="space-y-4 pt-2 border-t border-white/5">
						<CyberActionButton
							label={isLoading ? "Sending..." : "Send Verification Code"}
							type="submit"
							isLoading={isLoading}
							className="w-full text-[10px] sm:text-xs md:text-sm tracking-widest font-black"
						/>

						<div className="flex justify-center items-center gap-2 text-[10px] sm:text-xs md:text-sm text-slate-600 font-bold uppercase tracking-wide">
							<Cpu size={10} />
							<AuthFooter
								label="Back to Login"
								onClick={onSwitchToLogin}
								className="hover:text-secondary transition-colors focus:outline-none focus:underline"
							/>
						</div>
					</footer>
				</form>
			</div>
		</AuthModalWrapper>
	);
};

export default ForgotModal;
