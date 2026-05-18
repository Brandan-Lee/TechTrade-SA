import React, { useState } from "react";
import { Terminal, ShieldAlert, Cpu } from "lucide-react";
import AuthModalWrapper from "./AuthModalWrapper";
import AuthInput from "../../ui/AuthInput";
import CyberActionButton from "../../ui/CyberActionButton";
import AuthFooter from "./AuthFooter";

export const ForgotModal = ({
	isOpen,
	onClose,
	onSwitchToOTP,
	onSwitchToLogin,
}) => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleRequestOTP = async (e) => {
		onSwitchToOTP();
	};

	return (
		<AuthModalWrapper
			isOpen={isOpen}
			onClose={onClose}
			onBack={onSwitchToLogin}
		>
			<div
				className="space-y-6 sm:space-y-8 p-1 selection:bg-fuchsia-500/30 selection:text-white font-mono bg-[#0c0c0e]/95 text-slate-300 rounded-xl"
				aria-describedby="modal-desc"
			>
				{/* Visual Anchor Header */}
				<div className="space-y-1.5">
					<h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
						FORGOT PASSWORD
					</h1>

				</div>

				{/* Secure Recovery Gateway Form */}
		        <div onSubmit={handleRequestOTP} className="space-y-5 sm:space-y-6">
					<div className="relative group flex flex-col gap-1">
						<div className="absolute top-3 right-4 pointer-events-none text-slate-700 group-focus-within:text-fuchsia-500/40 transition-colors hidden sm:block">
							<Terminal size={14} />
						</div>

						<AuthInput
							id="recovery-email"
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="operator@terminal.network"
							required
							disabled={isLoading}
							className="font-mono text-xs sm:text-sm bg-[#121214] border-white/10 text-white placeholder:text-slate-700 focus:border-fuchsia-500/50"
						/>
					</div>

					{/* Operational Action Stack */}
					<div className="space-y-4 pt-2 border-t border-white/5">
						<CyberActionButton
							label={
								isLoading ? "" : "REQUEST OTP"
							}
							type="submit"
							isLoading={isLoading}
							className="w-full text-xs sm:text-sm tracking-widest font-black"
                            onClick={onSwitchToOTP}
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
				</div>
			</div>
		</AuthModalWrapper>
	);
};

export default ForgotModal;
