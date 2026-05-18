import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, AlertOctagon } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import PasswordStrengthMeter from "../../ui/PasswordStrengthMeter";
import AuthFooter from "./AuthFooter";

export const ResetModal = ({
	isOpen,
	onClose,
	onSwitchToOTP,
	onSwitchToLogin,
}) => {
	const [newShowPassword, newSetShowPassword] = useState(false);
	const [confirmShowPassword, confirmSetShowPassword] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [systemError, setSystemError] = useState("");

	const handleReset = async (e) => {
		e.preventDefault();
		setSystemError(""); // Reset error block states

		if (password !== confirmPassword) {
			setSystemError("MATRIX_MISMATCH: Input parameters do not align.");
			return;
		}

		setIsLoading(true);
		try {
			// Pipeline secure authorization stream to endpoint
			console.log("Rewriting encryption tokens...");

			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Terminate transaction and bounce back to access log on success
			onSwitchToLogin();
		} catch (error) {
			setSystemError("TRANSMISSION_FAILURE: Security handshake dropped.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthModalWrapper isOpen={isOpen} onClose={onClose} onBack={onSwitchToOTP}>
			<div className="space-y-6 sm:space-y-8 p-1 font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl selection:bg-fuchsia-500/30">
				{/* Visual Anchor Terminal Top Header */}
				<div className="space-y-1.5">
					<h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
						RESET PASSWORD
					</h1>
					<p className="text-slate-500 text-[11px] sm:text-xs font-medium leading-normal uppercase tracking-wider pt-1">
						Establish an updated authorization string sequence to patch your
						access footprint.
					</p>
				</div>

				{/* Inline System Diagnostic Error Indicator */}
				{systemError && (
					<div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-2.5 animate-[pulse_2s_infinite]">
						<AlertOctagon className="text-red-400 shrink-0" size={14} />
						<span className="text-[10px] sm:text-xs font-bold text-red-400 uppercase tracking-wide">
							{systemError}
						</span>
					</div>
				)}

				<form onSubmit={handleReset} className="space-y-5">
					<div className="space-y-2.5">
						<div className="relative">
							<AuthInput
								label="New Password"
								type={newShowPassword ? "text" : "password"}
								isPassword={true}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								showPassword={newShowPassword}
								togglePassword={() => newSetShowPassword(!newShowPassword)}
								disabled={isLoading}
								className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-800 focus:border-fuchsia-500/50"
							/>
						</div>

						<div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
							<PasswordStrengthMeter password={password} />
						</div>
					</div>

					{/* Verification Duplication Cipher Stack */}
					<div className="relative">
						<AuthInput
							label="Confirm Password"
							type={confirmShowPassword ? "text" : "password"}
							isPassword={true}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							showPassword={confirmShowPassword}
							togglePassword={() =>
								confirmSetShowPassword(!confirmShowPassword)
							}
							disabled={isLoading}
							className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-800 focus:border-fuchsia-500/50"
						/>
					</div>

					{/* Operational Executable Action Cluster Stack */}
					<div className="space-y-4 pt-4 border-t border-white/5">
						<CyberActionButton
							label={
								isLoading
									? "Request Sent"
									: "UPDATE PASSWORD"
							}
							type="submit"
							isLoading={isLoading}
							className="w-full text-xs sm:text-sm tracking-widest font-black"
                            onClick={onSwitchToLogin}
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
